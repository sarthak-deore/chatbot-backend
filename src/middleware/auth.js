const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      return res.status(401).send({ error: "Authentication failed" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      return res.status(401).send({ error: "Authentication failed" });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Authentication failed" });
  }
};

module.exports = auth;
