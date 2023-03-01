const express = require('express');
const router = express.Router();
const Admin = require('../schemas/AdminSchema')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { application } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('../middlewares/multer')

const bcrypt = require('bcryptjs');

router.post("/register", async (req, res) => {
    const saltRounds = 10;ssssssssssssssssss
    try {
        const admin = await Admin.findOne({email: req.body.email});
        if (admin) return res.status(400).send("Account already exists");
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        
            if(err){
                console.log(error)
                res.send(error)
            }
            const newAdmin = new Admin({
            pid: req.body.pid,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hash,
        })

        const saved = await newAdmin.save((err,user)=>{
            if(err){
                console.log(err);
                res.send(400,'bad request');
            }else{
                res.send(user);
            }
            
        });
    })

    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

router.post("/login", async(req, res) => {
    try {
        let admin = await Admin.findOne(req.body.email);
        
        if(admin){
            const match = await bcrypt.compare(req.body.password, admin.password);
            if (match) {
                console.log('match')
                res.send(admin); //dont think we should send user!!!!
            }
            else {
                console.log('incorrect password')
                res.send('incorrect password')
            }
        }else{
            res.send("No user found");
        }
    } catch (error) {
        res.send(err);
        console.log(err);
    }
})

module.exports = router;