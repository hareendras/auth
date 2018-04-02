const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStratergy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const localStratergy = require("passport-local");

//create local stratergy
const localOptions = { usernameField: "email" }; // this tells passport to look at "email" property of the request and use it as username

const localLogin = new localStratergy(localOptions, function(
  email,
  password,
  done
) {
  //verify email and password and call "done" with the user if they are correct
  // othrewise call done without a user object
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    // compare passwords
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      if (!isMatch) {
        return done(null, user);
      }
    });
  });
});

//Setup options for JWT Stratergy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

//create JWT stratergy
const jwtLogin = new JwtStratergy(jwtOptions, function(payload, done) {
  // see if the user id in the payload exists in our database
  // if it does call 'done' with that user
  // othrewise call done witout a user object

  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
  });

  if (User) {
    done(null, User);
  } else {
    done(null, false);
  }
});

//tell passport to use this streatergy

passport.use(jwtLogin);
passport.use(localLogin);
