const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

async function sendBooked(product_name, email) {
    let transporter = nodemailer.createTransport(
        {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "uniexsfit@gmail.com", //add acc
                pass: "fwrdsquycvfufiuo"//change
            }
        }
    );


    let info = await transporter.sendMail({
        from: 'UniEx <uniexsfit@gmail.com>',
        to: email,
        subject: "Product Booked",
        attachments: {
            filename: 'Logo.jpeg',
            path: __dirname + '/Logo.jpeg',
            cid: 'logo'
        },
        context: {
            product: product_name,
        },
        html: `
            <body style = "background-color: #212121;">
            <center><img style="width:10em;" src="cid:logo"></center>
            <div style="background-color: #262626;color:antiquewhite; ">
                <h2 style="text-align: center;padding-top: 20px;">You have successfully booked the product</h2>
                <h1 style="padding-top: 20px;padding-bottom: 50px;text-align: center;" >the product you have booked is ${product_name} </h1></div></body>
            `
    })
    console.log("message has been sent: %s", info.messageId);

}



//sendBooked("341JKAD","jasonsampy88@gmail.com")
module.exports = { sendBooked };