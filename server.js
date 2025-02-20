const morgan = require('morgan');
const session = require('express-session');

// require our new middleware!
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const applicationsController = require('./controllers/applications.js');

app.get('/', (req, res) => {
    // Check if the user is signed in
    if (req.session.user) {
      // Redirect signed-in users to their applications index
      res.redirect(`/users/${req.session.user._id}/applications`);
    } else {
      // Show the homepage for users who are not signed in
      res.render('index.ejs');
    }
  });
  
  app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); // use new passUserToView middleware here

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});
  
  app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/applications', applicationsController); // New!

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});