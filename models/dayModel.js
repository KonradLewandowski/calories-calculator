const mongoose = require('mongoose');
const deepSearch = require('./../utils/deepSearch');

const daySchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: new Date() },
    breakfast: [{ type: mongoose.Schema.ObjectId, ref: 'Meal' }],
    lunch: [{ type: mongoose.Schema.ObjectId, ref: 'Meal' }],
    dinner: [{ type: mongoose.Schema.ObjectId, ref: 'Meal' }],
    calories: { type: Number, default: 0 },
    checker: { type: String, unique: true },
    history: {
      type: mongoose.Schema.ObjectId,
      ref: 'History',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

daySchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'breakfast',
  })
    .populate({
      path: 'lunch',
    })
    .populate({
      path: 'dinner',
    });
  next();
});

//Calculating calories of the day
daySchema.post(/^find/, function (object) {
  if (!object) return;

  const json = JSON.parse(JSON.stringify(object));
  const flag = json.breakfast ?? false;

  if (!flag) {
    return json.map((el, i) => (object[i].calories = deepSearch(json[i], 'calories')));
  } else {
    return (object.calories = deepSearch(json, 'calories'));
  }
});

daySchema.pre('save', async function (next) {
  this.checker = this.createdAt.toISOString().split('T')[0];

  next();
});

const Day = new mongoose.model('Day', daySchema);
module.exports = Day;
