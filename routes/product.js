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
const sendMail = require('../mailhandelling/book')

const secretKey = "secretKey";

const URL = `localhost:5000`



router.post("/addproduct", multer.upload.single("file"), async (req, res) => {
    try {
        console.log(req.file)
        //Will send the email

        const newProduct = new Product({
            ownerId: req.body.ownerId,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            link: req.body.link,
            bookedBy: '',
            bookingStatus: 'available',
            sellingDate: (new Date).toString(),
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

router.post('/myproducts', async (req, res) => {
    try {
        // console.log(req.body.ownerId)
        let products = await Product.find({ ownerId: req.body.ownerId, bookingStatus: 'available' });
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ result: "No products found" })
        }
    } catch (error) {
        console.log(error)
    }
})



router.post('/bookedproducts', async (req, res) => {
    try {
        let products = await Product.find({ bookedBy: req.body.id });
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ result: "No products found" })
        }
    } catch (error) {
        console.log(error)
    }
})

// router.post('/bookproduct', async (req, res) => {
//     try {
//         let toDelete = await Product.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
//         let gfs = multer.gfs.grid
//         let filename = toDelete.productImage

//         let temp = []
//         temp = filename.split("/")
//         console.log(temp)
//         let removingFile = temp[temp.length - 1]
//         // user_icon_1662560350693undefined
//         // console.log(removingFile);
//         try {
//             await gfs.files.deleteOne({ filename: removingFile })
//             console.log("Done")
//         } catch (error) {
//             console.log("Not Done")
//         }

//         let booked = await Product.updateOne(
//             {_id: mongoose.Types.ObjectId(req.body.id)},
//             {
//                 $set: {
//                     bookingStatus:'booked',
//                     bookedBy: req.body.bookedBy
//                 }
//             }
//         )
//         console.log(booked)
//         res.status(200).send("Product deleted successfully!")

//     } catch (error) {
//         res.status(400).send("uNSUCCESSFUL")
//     }
// })





router.post('/bookproduct', async (req, res) => {
    try {
        let toDelete = await Product.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
        let gfs = multer.gfs.grid
        let filename = toDelete.productImage

        let temp = []
        temp = filename.split("/")
        console.log(temp)
        let removingFile = temp[temp.length - 1]
        // user_icon_1662560350693undefined
        // console.log(removingFile);
        try {
            await gfs.files.deleteOne({ filename: removingFile })
            console.log("Done")
        } catch (error) {
            console.log("Not Done")
        }

        try {
            const Seller = await User.findOne({ _id: mongoose.Types.ObjectId(req.body.sellerId) })
            const SellerName = await Seller;

            let transDate = (new Date).toString()
            let slicedDate = transDate.substring(0, 24);



            const newTransaction = new Transaction({
                productId: req.body.id,
                productName: req.body.productName,
                soldBy: req.body.sellerId,
                broughtBy: req.body.buyerId,
                sellerName: SellerName.firstname,
                buyerName: req.body.buyerName,
                date: slicedDate,
                transactionType: 'booked'
            })

            const saved = await newTransaction.save();
            res.send(saved);
            console.log("Saved: ", saved);
        } catch (error) {
            console.log("Error new trans: ", error)
        }


        try {
            let booked = await Product.updateOne(
                { _id: mongoose.Types.ObjectId(req.body.id) },
                {
                    $set: {
                        bookingStatus: 'booked',
                        bookedBy: req.body.buyerId
                    }
                }
            )
            sendMail.sendBooked(product.productName,req.body.useremail)
            console.log(booked)
            // res.status(200).send("Product deleted successfully!")
        } catch (error) {
            consoler.log("Error: ", error)
        }


        // try {
        //     const result = await Product.deleteOne({ _id: mongoose.Types.ObjectId(req.body.id) })
        //     res.send(result)
        // } catch (error) {
        //     console.log("Product deletion error: ", error)
        // }



    } catch (error) {
        console.log("The error: ", error)
        res.status(400).send("UNSUCCESSFUL")
    }
})


router.post('/downloadproduct', async (req, res) => {

    try {
        const Seller = await User.findOne({ _id: mongoose.Types.ObjectId(req.body.sellerId) })
        const SellerName = await Seller;
        console.log("SELLERNAME:", 
        SellerName)

        let transDate = (new Date).toString()
        let slicedDate = transDate.substring(0, 24);
        


        const newTransaction = new Transaction({
            productId: req.body.id,
            productName: req.body.productName,
            soldBy: req.body.sellerId,
            broughtBy: req.body.buyerId,
            sellerName: SellerName.firstname,
            buyerName: req.body.buyerName,
            date: slicedDate,
            transactionType: 'downloaded'
        })
        const saved = await newTransaction.save();
        res.send(saved);
        console.log("Saved: ", saved);
    } catch (error) {
        console.log("Error new trans: ", error)
    }
})



router.post('/productdetails', async (req, res) => {
    try {
        let product = await Product.findOne({ _id: mongoose.Types.ObjectId(req.body.productid) });
        if (product) {
            res.send(product)
        } else {
            res.send("No product found")
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})


router.post('/updateproduct', async (req, res) => {
    try {
        console.log(req.body)
        let updated = await Product.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.productid) },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    link: req.body.link
                }
            }
        )
        console.log(updated)
        res.send(updated)
    } catch (error) {
        console.log(error)
    }
})

router.post('/deleteproduct', async (req, res) => {
    try {
        let toDelete = await Product.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
        let gfs = multer.gfs.grid
        let filename = toDelete.productImage

        let temp = []
        temp = filename.split("/")
        console.log(temp)
        let removingFile = temp[temp.length - 1]
        // user_icon_1662560350693undefined
        // console.log(removingFile);
        try {
            await gfs.files.deleteOne({ filename: removingFile })
            console.log("Done")
        } catch (error) {
            console.log("Not Done")
        }

        try {
            const result = await Product.deleteOne({ _id: mongoose.Types.ObjectId(req.body.id) });
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





// router.post('/testing', async (req, res) => {
//     console.log(req.body);
//     const Seller = await User.findOne({_id: mongoose.Types.ObjectId(req.body.sellerId)})
//     const SellerName = await Seller;
//     console.log('sellerName: ', SellerName.firstname)
//     res.send("Done")
// })





module.exports = router;