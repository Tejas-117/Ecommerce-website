const db = require("../config/db-config");

// Util functions
const { loginUtil } = require("../utils/auth");
const { getHashPassword } = require("../utils/hash");
const { newHttpError } = require("../utils/error");

const getAllUsers = async (req, res, next) => {
  try {
    const { rows: users } = await db.query(
      `SELECT users.*, roles.name AS user_role
       FROM users
       JOIN user_roles
        ON users.id = user_roles.user_id
       JOIN roles
        ON roles.id = user_roles.roles_id;`
    );

    return res.status(200).json({ data: { users } });
  } catch (error) {
    return next(newHttpError(500, "Unknown error occured, try again!!"));
  }
};

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  // if any of the field is empty
  if (!name || !email || !password) {
    return next(newHttpError(409, "Please fill all details and try again."));
  }

  // if the user is already registered
  const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (rows.length) {
    return next(newHttpError(409, "Email already registered"));
  }

  const hash = await getHashPassword(password);
  await db.query(
    `INSERT INTO users (name, email, password) VALUES($1, $2, $3)`,
    [name, email, hash]
  );

  // Insert all users as customers
  await db.query(
    `INSERT INTO user_roles(SELECT id, 2 FROM users WHERE email = $1)`,
    [email]
  );

  // Automatically login after registering a new user
  const { user, message } = await loginUtil(req);

  if (user) {
    return res
      .status(200)
      .json({ status: "Success", message: "User registered", user });
  }

  return next(newHttpError(500, "Unknown error occured, try again!!"));
};

const authenticate = (req, res, next) => {
  res.status(200).json({ isLoggedIn: true, user: req.session.user });
};

const login = async (req, res, next) => {
  const { user, message } = await loginUtil(req);

  if (user) {
    return res.status(200).json({
      status: "Success",
      message,
      user,
    });
  } else {
    return next(newHttpError(404, message));
  }
};

const logout = (req, res, next) => {
  req.session.user = null;
  return res.status(200).json({ status: "Success", message: "Logged out" });
};

const changeRole = async (req, res, next) => {
  const { userID } = req.params;
  const { user_role } = req.body;

  const userRoles = new Set(["admin", "customer"]);
  if (!userRoles.has(user_role)) {
    return next(newHttpError(400, "Invalid user role"));
  }

  try {
    await db.query(
      `UPDATE user_roles
       SET roles_id = (SELECT id FROM roles WHERE name = $1)
       WHERE user_id = $2`,
      [user_role, userID]
    );

    return res.status(200).json({ data: { message: "User role changed" } });
  } catch (error) {
    return next(newHttpError(500, "Unknown error occured, try again!!"));
  }
};

module.exports = {
  getAllUsers,
  register,
  authenticate,
  login,
  logout,
  changeRole,
};
