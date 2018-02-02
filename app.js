// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const Sequelize = require('sequelize');
const dbconfig = require('./config/database');

const sequelize = dbconfig;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// App Creation
const app = express();
const users = require('./routes/users'); 
const port = 3000;
//set static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
})

// Middleware
app.use(cors());
app.use(bodyParser.json());
//Router
app.use('/users', users);
// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


// App Running
app.listen(port, function (req, res) {
	console.log('Running ');
});