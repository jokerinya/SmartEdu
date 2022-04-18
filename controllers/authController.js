const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // if user exists and if not callback function
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          // USER SESSION
          req.session.userID = user._id;
          res.status(200).redirect('/users/dashboard');
        } else {
          res.status(400).send('Wrong password baby');
        }
      });
    } else {
      res.status(400).send('No user baby');
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.logoutUser = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getDashboardPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    res.status(200).render('dashboard', {
      page_name: 'dashboard',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
