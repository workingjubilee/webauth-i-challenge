const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const knexConfig = require('./data/index.js');

const userRouter = require('./users/userRouter.js');


const server = express();

server.use(express.json());
server.use(helmet());

const sessionConfig = {
  name: 'baked', 
  secret: 'All right, then. Keep your secrets.',
  cookie: {
    maxAge: 1000 * 60 * 10, 
    secure: false, 
    httpOnly: true, 
  },
  resave: false, 
  saveUninitialized: false, 
  store: new KnexSessionStore({
    knex: knexConfig,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true, 
    clearInterval: 1000 * 60 * 30,
  }),
};

server.use(session(sessionConfig));

// - Write a piece of **global** middleware that ensures a user is logged in
// when accessing _any_ route prefixed by `/api/restricted/`.
// For instance, `/api/restricted/something`, `/api/restricted/other`, and `/api/restricted/a` 
// should all be protected by the middleware; only logged in users should be able to access these routes.

function restrict (req, res, next) {
  try {
    if (req && req.session && req.session.user) {
      next();
    } else {
      res.status(403).json({ message: 'You shall not pass!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Huh?!' });
  }
};

server.use('/api/restricted/', restrict)
server.use('/api/', userRouter);

server.listen(5000, () => {
  console.log('\n\tAwaken, my masters!')
})