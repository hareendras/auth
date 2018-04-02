const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret); // sub and iat are standard jwt properties. Subject and issuedAtTime
}

exports.signIn = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) }); // user object is added in req by passport. This happens when we call done(null,user) in passport.js
};
exports.signUp = function(req, res, next) {
  // see if the user with the sme email exits
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password)
    return res
      .status(422)
      .send({ error: "You must provide a username and password" });

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    // if the user with the email does exist return error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }
    // if the email does not exist create and save the record and resond to request indicating user was created

    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json({ token: tokenForUser(user) });
    });
  });
};
