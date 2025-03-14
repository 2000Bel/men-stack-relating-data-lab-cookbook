const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');

const port = process.env.PORT ? process.env.PORT : '3000';

// require our new middleware!
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./routes/users.js');

const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');


const app = express();

// connetion with DB
mongoose.connect(process.env.MONGODB_URI);

  mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);
app.use('/users', usersController);

app.get('/', (req, res) => {
      res.render('index');
    });

    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: true })); 
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('view engine', 'ejs');  

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/recipes', recipesController);
app.use('/ingredients', ingredientsController);

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

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
