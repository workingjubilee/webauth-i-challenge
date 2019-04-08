const db = require('../data/index.js');

async function add(user) {
  const id = await db('users').insert(user);

  return findByID(id);
}

async function find() {
  const userList = await db('users').select('*');
  return userList;
}

function findByID(id) {
  return db('users').from('id').where(id).first();
};

function findByName(name) {
  console.log(name);

  return db('users').where({ name }).first();
}

module.exports = {
  add,
  find,
  findByName,
  findByID
};