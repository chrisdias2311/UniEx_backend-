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




//Rigister (alternative to Signup)
router.post("/register", multer.upload.single("file"), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send("Account already exists");
        console.log("This is REQ FILE =", req.file);

        const newUser = new User({
            pid: req.body.pid,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            year: req.body.year,
            dept: req.body.dept,
            class: req.body.class,
            password: req.body.password,
            IDcard: `${URL}/api/image/${req.file.filename}`,
            validity: 'No', //Default validity of user is no 
        });

        const saved = await newUser.save();
        // res.send(newUser);
        res.send(newUser)


    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


// router.post("/login", async (req, res) => {
//     if (req.body.password && req.body.email) {
//         let user = await User.findOne(req.body);
//         if (user) {
//             jwt.sign({ user }, secretKey, { expiresIn: '2h' }, (err, token) => {
//                 if (err) {
//                     console.log(err);
//                     res.send(err);
//                 }
//                 res.send({ user, auth: token })
//             })
//         } else {
//             res.send({ result: 'No user found' });
//         }
//     }
// })

router.post("/login", async(req, res) => {
    try {
        console.log("The request:", req.body)
        let user = await User.findOne(req.body);
        console.log(user);
        if(user){
            res.send(user);
        }else{
            res.send("No user found");
        }
    } catch (error) {
        res.send(error);
        console.log(error);
    }
})


router.get('/invalidusers', async (req, res) => {
    try {
        let users = await User.find({ validity: 'No' });
        if (users.length > 0) {
            res.send(users);
        } else {
            res.send({ result: "No users found" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/validateuser/:id", async(req, res)=> {
    let result = await User.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
})

router.put("/declineuser/:id", async(req, res)=> {
    let result = await User.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
})

module.exports = router;