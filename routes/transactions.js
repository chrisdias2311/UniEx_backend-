const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const multer = require("multer");
const User = require('../schemas/Userschema')
const Product = require('../schemas/ProductSchema')
const Transaction = require('../schemas/TransactionSchema')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { application } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('../middlewares/multer')
const Razorpay = require('razorpay');
const path = require("path");

const secretKey = "secretKey";

const URL = `https://uniexserver.onrender.com`

const razorpay = new Razorpay({
    key_id: "rzp_test_Db4QDRjHhe5soI", // Replace with your Razorpay API key   
    key_secret: "n6469q0wY1Kqm20wL4veQZV4", // Replace with your Razorpay API secret       
});


router.post("/create", async (req, res) => {
    console.log("HIT")
    const totalAmountInPaise = req.body.totalAmountInPaise;

    const options = {
        amount: totalAmountInPaise,
        currency: "INR",
    };

    try {
        const order = await razorpay.orders.create(options);

        res.json({ success: true, order_id: order.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Order creation failed." });
    }
});

router.post('/soldproducts', async (req, res) => {
    try {
        let transactions = await Transaction.find({ soldBy: req.body.id });
        if (transactions.length > 0) {
            transactions.reverse()
            res.send(transactions);
        } else {
            res.send({ result: "No transactions found" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/mytransactions', async (req, res) => {
    try {
        let transactions = await Transaction.find({ broughtBy: req.body.id });
        if (transactions.length > 0) {
            transactions.reverse()
            res.send(transactions);
        } else {
            res.send({ result: "No transactions found" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/trasactiondetails', async (req, res) => {
    try {
        let transaction = await Transaction.findOne({ _id: mongoose.Types.ObjectId(req.body.tid) });
        if(transaction){
            res.send(transaction)
        }else{
            res.send("No transaction found")
        }
    } catch (error) {
        
    }
})


router.post('/userdetails', async (req, res) => {
    try {
        let user = await User.findOne({ _id: mongoose.Types.ObjectId(req.body.userid) });
        if(user){
            res.send(user)
        }else{
            res.send("No User found")
        }
    } catch (error) {
        
    }
})





module.exports = router;