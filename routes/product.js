const express = require('express');
const router = express.Router();
// const User = require('../schemas/Userschema')
const Product = require('../schemas/ProductSchema')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { application } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('../middlewares/multer')

const secretKey = "secretKey";

const URL = `localhost:5000`



router.post("/addproduct", multer.upload.single("file"), async (req, res) => {
    try {
        console.log(req.file)
    
        const newProduct = new Product({
            ownerId: req.body.ownerId,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            link:req.body.link,
            bookedBy: '',
            bookingStatus: 'available',
            productImage: `${URL}/api/image/${req.file.filename}`,
        });

        const saved = await newProduct.save();
        res.send(newProduct)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

router.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({ bookingStatus: 'available' });
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ result: "No products found" })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;