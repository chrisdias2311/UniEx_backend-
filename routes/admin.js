const express = require('express');
const router = express.Router();
const Admin = require('../schemas/AdminSchema')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { application } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('../middlewares/multer')


router.post("/register", async (req, res) => {
    try {
        const admin = await Admin.findOne({email: req.body.email});
        if (admin) return res.status(400).send("Account already exists");

        const newAdmin = new Admin({
            pid: req.body.pid,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
        })

        const saved = await newAdmin.save();
        res.send(newAdmin);

    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

router.post("/login", async(req, res) => {
    try {
        let admin = await Admin.findOne(req.body);
        if(admin){
            res.send(admin);
        }else{
            res.send("No user found");
        }
    } catch (error) {
        res.send(err);
        console.log(err);
    }
})

module.exports = router;