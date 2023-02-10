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
// router.post('/signup', (req, res) => {
//     const newUser = new User({
//         email: req.body.email,
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         password: req.body.password,
//         idCard: req.body.idCard
//     });

//     newUser.save()
//         .then(newUser => res.json(newUser))
//         .catch(err => res.status(400).json(err));
// })



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
            validity: 'Yes', //
        });

        const saved = await newUser.save();
        // res.send(newUser);
        res.send("Your Request was sent Successfully!")


    } catch (error) {
        console.log(error);
        res.send(error)
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

router.get('/unvalidusers', async (req, res) => {

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




// app.get("/products", async (req, resp) => {
//     let products = await Product.find();
//     if (products.length > 0) {
//         resp.send(products)
//     } else {
//         resp.send({ result: "No products found" });
//     }
// })


// app.delete("/product/:id", async (req, resp) => {
//     const result = await Product.deleteOne({ _id: req.params.id });
//     resp.send(result);
//     console.log(result)
// })

module.exports = router;