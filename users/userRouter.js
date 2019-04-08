// | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
// | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.                                                                                                                                                 |
// | POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!' |
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.            |

const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const Users = require('./userKnex.js');

const router = express.Router();

router.get('/', async (req,res) => {
  try {
  const userList = await Users.find();

  res.status(200).json(userList);
} catch(error) {
  res.status(500).json({ message: "Whoops!" })
}
});

router.post('/login', async (req, res, next) => {
  let { name, password } = req.body;

  try {
  let loggingUser = await Users.findByName(name);

  if (loggingUser && bcrypt.compareSync(password, loggingUser.password)) {

        req.session.user = loggingUser;

        res.status(200).json({
          message: `Welcome ${loggingUser.name}!`,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials?' });
      }
    } catch(error) {
    res.status(500).json(error);
  }

});

router.post('/register', async (req, res) => {
  let { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: "Need both name and password to register." })
  } else {
    const hash = await bcrypt.hashSync(password, 4);
    password = hash;

    try {
      const newUser = await Users.add({ name, password });
      res.status(200).json(newUser);
    } catch(error) {
      res.status(500).json({ error: "Huh?" });
  }}

});

router.get('/restricted/users', async (req,res) => {
  try {
    const userList = await Users.find();

    res.status(200).json(userList);
  } catch(error) {
    res.status(500).json({ message: "Eh?" })
  }
});




module.exports = router;