const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const path = require('path');
const hpp = require('hpp');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const historyRouter = require('./routes/historyRouter');
const dayRouter = require('./routes/dayRouter');
const viewRouter = require('./routes/viewRouter');
const mealRouter = require('./routes/mealRouter');

//Start express APP
const app = express();

//PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1)GLOBAL MIDDLEWARES
// app.disable('etag');

//Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Limit requests frome same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try agan in an hour',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(cookieParser());

//Data sanitization againts NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp());

app.use(
  expressCspHeader({
    policies: {
      'default-src': [expressCspHeader.NONE],
      'img-src': [expressCspHeader.SELF],
    },
  })
);

//Serving static files
app.use(express.static(`${__dirname}/public`));

//compress request
app.use(compression());

//Routes
app.use('/', viewRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/history', historyRouter);
app.use('/api/v1/days', dayRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/meals', mealRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
