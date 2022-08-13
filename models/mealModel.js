const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
  weight: { type: Number, required: true },
  calories: { type: Number, default: 0 },
  userID: { type: mongoose.Schema.ObjectId, ref: 'User' },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

mealSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'product',
  });

  next();
});

mealSchema.post('find', async function (object) {
  object.forEach((el) => (el.calories = (el.product.energy * el.weight) / 100));
});
const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
