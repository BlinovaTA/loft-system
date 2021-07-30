const config = require("config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const user = require("../db-models/user");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get("jwt").secret,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const findedUser = await user.findById(payload.userId);

        if (findedUser) {
          done(null, findedUser);
        } else {
          done(null, false);
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
};
