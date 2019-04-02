const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const userRouter = require('./users/userRouter.js');
const Users = require('./users/userKnex.js');

const server = express();

server.use(express.json());
server.use(helmet());

async function restrict(req,res,next) {
  let { name, password } = req.headers;

  if (!name || !password) {
    res.status(401).json({ message: "Please provide credentials." })
  } else {
    console.log({ name, password });

    try {
      let foundUser = await Users.findByName(name);
      console.log(foundUser);


      if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
        next();
      } else {
        res.status(403).json({ message: "You shall not pass!" })
      }

    } catch(error) {
      res.status(500).json({ message: "Error!" }) // Should be more descriptive "incorrect creds."
    }

}};

server.use('/restricted/', restrict)
server.use('/', userRouter);


// - Write a piece of **global** middleware that ensures a user is logged in when accessing _any_ route prefixed by `/api/restricted/`. For instance, `/api/restricted/something`, `/api/restricted/other`, and `/api/restricted/a` should all be protected by the middleware; only logged in users should be able to access these routes.





server.listen(5000, () => {
  console.log('\n\tAwaken, my masters!')
})