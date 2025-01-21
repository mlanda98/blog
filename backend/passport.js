const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const prisma = require("./prisma");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
};
