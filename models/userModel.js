const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    require: [true, 'A user must have an Email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'coach', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please provide a password'],
    unique: false,
    minlength: [8, 'A password must have at least 8 characters'],
    select: false, //don't show password in database
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Confirm your password'],
    validate: {
      //This only works on CREATE and SAVE!!!
      validator: function (pass) {
        return pass === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: { type: Date, default: Date.now() },
  history: {
    type: mongoose.Schema.ObjectId,
    ref: 'History',
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //Hash the password cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//looking for everything with "find" word
userSchema.pre(/^find/, function (next) {
  //this points to current query
  this.find({ active: { $ne: false } }); //not equal to false

  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'history',
  });
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    //Converting this.passwordChangedAt to timestamp as an integer
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  //False means NOT changed
  return false;
};

// Generate reset password token
userSchema.methods.createPasswordResetToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // crypto.createHash('sha256').update("variable where the token is stored")
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  //When the token will be expired
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.pointToHistory = function (id) {
  return (this.history = id);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
