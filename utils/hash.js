const bcrypt = require("bcrypt");

async function getHashPassword(password) {
   const hashedPassword = await bcrypt.hash(password, 12);
   return hashedPassword;
 }
 
 async function checkHashPassword(password, hash) {
   const result = await bcrypt.compare(password, hash);
   return result;
 }

module.exports = { getHashPassword, checkHashPassword };