const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({}).populate('blogs');
  res.json(users.map(user => user.toJSON()))
});

usersRouter.post('/', async (req, res) => {
  const body = req.body;
  const password = body.password;
  const username = body.username;

  if (!password || password.length < 3) {
    return res.status(400).json({
      error: 'Password invalid: Password required and must be minimum of 3 characters',
    });
  }

  if (!username || username.length < 3) {
    return res.status(400).json({
      error: 'Username invalid: Username required and must be minimum of 3 characters',
    });
  }

  const existingUser = await User.find({ username: username });

  if (existingUser.length > 0) {
    return res.status(409).json({
      error: `Username ${username} already exists.`,
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.json(savedUser);
});

module.exports = usersRouter;
