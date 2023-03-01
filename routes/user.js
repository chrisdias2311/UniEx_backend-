const express = require('express');
const router = express.Router();
const User = require('../schemas/Userschema')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { application } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('../middlewares/multer')
const otpGenerator = require('otp-generator');
const auth = require('../mailhandelling/auth');
const mongoose = require('mongoose')
const pass_otp = require('../mailhandelling/passotp')
const secretKey = "secretKey";

const URL = `localhost:5000`




//Rigister (alternative to Signup)
router.post("/register", multer.upload.single("file"), async (req, res) => {

    const saltRounds = 10;
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send("Account already exists");
        console.log("This is REQ FILE =", req.file);
        //bcrypt encryption
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            console.log(hash);
            if (err) {
                res.send('error generating hash')
            }
            else {
                const newUser = new User({
                    pid: req.body.pid,
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phone: req.body.phone,
                    year: req.body.year,
                    dept: req.body.dept,
                    class: req.body.class,
                    password: hash,
                    IDcard: `${URL}/api/image/${req.file.filename}`,
                    validity: 'No', //Default validity of user is no 
                    verified: 'No',
                    otp:"null"
                });
                const saved = await newUser.save((err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(400, 'bad request');
                    }

                    else{
                        res.send(user)
                    }
                 });
                // if (saved){
                    
                //     send_data = await User.findOne({ email:req.body.email },{password:0});
                //     res.send(send_data)
                // }
            }
        })
        //const saved = await newUser.save();
        // res.send(newUser);
        //res.send(newUser)
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

router.post("/login", async (req, res) => {
    try {
        console.log("The request:", req.body)
        let user = await User.findOne({ email: req.body.email });

        console.log(user);
        if (user) {
            //bcrypt compare
            const match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                console.log('match')
                res.send(user); //dont think we should send user!!!!
            }
            else {
                console.log('incorrect password')
                res.send('incorrect password')
            }
        } else {
            res.send("No user found");
        }
    } catch (error) {
        res.send(error);
        console.log(error);
    }
})


router.get('/invalidusers', async (req, res) => {
    try {
        let users = await User.find(
            { validity: 'No'}
        );
        if (users.length > 0) {
            console.log(users)
            res.send(users);
        } else {
            res.send({ result: "No users found" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/getuser', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.verifyEmail })
        if (user) {
            res.send(user)
        } else {
            res.send("No user found")
        }
    } catch (error) {

    }
})

router.put("/validateuser/:id", async (req, res) => {
    let result = await User.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
})

router.put("/declineuser/:id", async (req, res) => {
    let result = await User.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
})


router.get('/generateotp/:id', async (req, res) => {

    const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false });
    const user = await User.findOne({ email: req.params.id })
    if (user.validity == 'yes') {
        res.send("already verified")
    }
    else {
        try {
            let test = await User.updateOne({ _id: user._id }, { $set: { verified: otp } })
            console.log(test);
            auth.sendOtp(otp, user.email);

            res.send('generated');
        } catch (err) {
            console.log(err)
            res.send(err);
        }
    }
})

router.get('/verifyotp/:id/:otp', async (req, res) => {

    const user = await User.findOne({ email: req.params.id });
    console.log(user);

    if (user.verified == 'yes') {
        res.send("already verified")
    }
    else {
        if (user.verified == req.params.otp) {
            console.log('passed')
            const update = await User.updateOne({ email: req.params.id }, { $set: { verified: 'yes' } })
            console.log("verified");
            res.send(update);

        }
    }

})


router.post('/updateuser', async (req, res) => {
    try {
        console.log(req.body)
        let updated = await User.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.user_id) },
            {
                $set: {
                    year: req.body.year,
                    dept: req.body.department,
                    class: req.body.class
                }
            }
        )
        console.log(updated)
        res.send(updated)
    } catch (error) {
        console.log(error)
    }
})

router.post('/deleteuser', async (req, res) => {
    try {
        try {
            const result = await User.deleteOne({ _id: mongoose.Types.ObjectId(req.body.id) });
            console.log("Deleted",result)
            res.send(result);
        } catch (error) {
            console.log(error)
            res.send(error)
        }
        
    } catch (error) {
        res.status(400).send("UNSUCCESSFUL")
    }
})


router.get('/generateotp_pass/:id',async(req,res)=>
{
    
    const otp = otpGenerator.generate(6,{lowerCaseAlphabets:false,specialChars:false});
    const user =  await User.findOne({email:req.params.id})
    try{
        let test =await User.updateOne({_id:user._id},{$set:{validity:otp}})
        console.log(test);
        pass_otp.sendOtp(otp,user.email);

    res.send('generated');
    }catch(err){
        console.log(err)
        res.send(err);
    }

})


router.get('/verifyotp_pass/:id/:otp',async(req,res)=>{

    const user =  await User.findOne({email:req.params.id});

    if(user.otp == req.params.otp)
    {        
        const u_otp = await User.updateOne({email:req.params.id},{$set:{otp:'verified'}});
        res.send('verified_otp');
        //res.redirect       
    }
    else{
        res.send('incorrect otp')
    }

})

router.get('/change_pass/:id/:newpassword',async(req,res)=>
{
    
    const user =  await User.findOne({email:req.params.id});
    if(user.otp == 'verified'){
             
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            if(err){
                res.send('error has occured');
            }
            else{
            const u_pass = await User.updateOne({email:req.params.id},{$set:{password:hash}});
            console.log('u_pass');
            res.send('password updated')
            }
        })
    }
    else{
        res.send('please verify otp first')
    }
    
})


module.exports = router;