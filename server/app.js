const express = require('express');
const cors = require('cors');

const dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');
const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routes/authRoutes');
const hostRouter = require('./routes/hostRoutes');
const guestRouter = require('./routes/guestRoutes');

const app = express();

//App configuration
//TODO: TRY TO REMOVE THIS
dotenv.config();
//CORS Configuration
var corsOptions = {
    origin: process.env.TRUSTED_FRONTEND_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
//Flash, for passing parameters between routes 
//--See login-callback routes in authRoutes.js
app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
app.use(flash());


//Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/host',hostRouter);
app.use('/api/v1/guest',guestRouter);
//Error handling
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);



module.exports = app;