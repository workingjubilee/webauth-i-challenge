const express = require('express');
const helmet = require('helmet');

const userRouter = require('./users/userRouter.js');

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api/', userRouter);

server.listen(5000, () => {
  console.log('\n\tAwaken, my masters!')
})