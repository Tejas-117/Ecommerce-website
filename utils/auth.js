const db = require("../config/db-config");
const { checkHashPassword } = require("./hash");
const { newHttpError } = require("./error");

// Check is user is logged in 
function isLoggedIn(req, res, next){
   if(!req.session.user){
     return next(newHttpError(401, "Unauthorised"));
   }
   next();
}

// Check if a user is Admin 
function isAdmin(req, res, next){
  if(req.session.user?.isAdmin){
    next();    
  }
  else{
    return next(newHttpError(401, "Unauthorised"));
  }
}

// Utility function to login
async function loginUtil(req) {
  const { email, password } = req.body;

  try {
    // select user along with their role 
    const { rows } = await db.query("SELECT users.*, roles.name AS role FROM users JOIN user_roles ON users.id = user_id JOIN roles ON user_roles.roles_id = roles.id WHERE email = $1", [email]);

    if (rows.length == 0) {
      return { message: "User not found." };
    }

    const hash = await checkHashPassword(password, rows[0].password);

    if (!hash) {
      return { message: "Incorrect username or password." };
    } 
    else {
      const user = { 
        id: rows[0].id,
        name: rows[0].name,
        isAdmin: (rows[0].role === "admin")
      };

      req.session.user = user; 
      return { message: "Logged In", user };
    }
  } 
  catch (error) {
    return { message: "Unknown error occured, try again!!" };
  }
}

module.exports = { isLoggedIn, isAdmin, loginUtil };