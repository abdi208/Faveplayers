require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const isLoggedin = require('./middleware/isLoggedin');
const helmet = require('helmet');
const app = express();
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const RateLimit = require('express-rate-limit');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(ejsLayouts);
app.use(methodOverride('_method'))

app.use(helmet());

// Rate limiter for log in and sign up
const loginLimiter = new RateLimit({
  windowMs: 1000,
  // max: 3,
  delayMs: 0,
  message: 'Maximum login attempts exceeded. Please try again Later.'
});

const signupLimiter = new RateLimit({
  windowMs: 1000,
  // max: 3,
  delayMs: 0,
  message: 'Maximum signups reached, please try again after 1 hour.'
});

app.use('/auth/login', loginLimiter);
app.use('/auth/signup', signupLimiter);

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30
});

// Session must come before flash and passport //
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// USe this line once to set up store table

sessionStore.sync();

//-- Must come after session and before passport middleware --//
app.use(flash());
//-- These two lines come after setup of session --//

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;

  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedin, function(req, res) {
  db.faves.findAll({
    where : {userId: req.user.id}
  }).then(function(foundfaves) {
  console.log('hellloooooooooooo',foundfaves)
      res.render('profile', { faves: foundfaves })
  })
});

app.put('/profile/:id',isLoggedin, function(req, res) {
  db.faves.destroy({
    where: { id:  parseInt(req.params.id)}
  }).then(function(data) {
    res.redirect('/profile')
  })
}); 

app.delete('/profile/:id',isLoggedin, function(req, res) {
  db.faves.destroy({
    where: { id:  parseInt(req.params.id)}
  }).then(function(data) {
    res.redirect('/profile')
  })
}); 
app.use('/auth', require('./controllers/auth'));
app.use('/faves', require('./controllers/faves'));
app.use('/events', require('./controllers/events'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
