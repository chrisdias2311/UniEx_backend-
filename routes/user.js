const express = require('express');
const router = express.Router();
const User = require('../schemas/Userschema')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { application } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('../middlewares/multer')

const secretKey = "secretKey";

const URL = `localhost:5000`



// Signup
router.post('/signup', (req, res) => {
    const newUser = new User({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        idCard: req.body.idCard
    });

    newUser.save()
        .then(newUser => res.json(newUser))
        .catch(err => res.status(400).json(err));
})



//Rigister (alternative to Signup)
router.post("/register", multer.upload.single("file"), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send("Account already exists");
        console.log("This is REQ FILE =", req.file);

        const newUser = new User({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            IDcard: `${URL}/api/image/${req.file.filename}`
        });

        const saved = await newUser.save();
        res.send(newUser);


    } catch (error) {
        console.log(error);
    }

    // console.log("This is req body", req.body);
    // const user = await User.findOne({ email: req.body.email })
    // if (user) return res.status(400).send("Account already exists");

    // const newUser = await User.create(req.body);
    // // res.status(201).send(newUser);

    // jwt.sign({ newUser }, secretKey, { expiresIn: '2h' }, (err, token) => {
    //     if (err) {
    //         console.log(err);
    //         res.send(err);
    //     }
    //     res.status(201).send({ newUser, auth: token })
    // })
})


router.post("/login", async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body);
        if (user) {
            jwt.sign({ user }, secretKey, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                res.send({ user, auth: token })
            })
        } else {
            res.send({ result: 'No user found' });
        }
    }
})


module.exports = router;