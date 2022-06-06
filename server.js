const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  // console.log('UNCAGHT EXEPTION!');
  // console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true, //make this also true
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`App running on port ${port}`));

process.on('unhandledRejection', (err) => {
  // console.log('UNHANDLED REJECTION');
  // console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
