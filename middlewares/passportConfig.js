const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../schemas/Userschema')

exports.initializingPassport = (passport) => {

    passport.use(new LocalStrategy(async (email, password, done) => {
        try {
            const user = await User.findone({ email });

            if (!user) return done(null, false);

            if (user.password !== password) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });


    passport.deserializeUser(async(id, done)=>{
        try{
            const user = await User.findById(id);
            done(null, user);
        }catch(error){
            done(error, false);
        }
    });
}