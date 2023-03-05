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
                user: "jasonsampy88@gmail.com", //add acc
                pass: "pohdsrsqvrvohkzv"//change
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
                <h1 style="text-align: center;padding-top: 20px;">Your ${product_name} was successfully booked!</h1>
                <h2 style="padding-top: 20px;padding-bottom: 50px;text-align: center;" >Check your UniEx dashboard for further details. Thanks for choosing UniEx! </h2></div></body>
            `
    })
    console.log("message has been sent: %s", info.messageId);

}



//sendBooked("341JKAD","jasonsampy88@gmail.com")
module.exports = { sendBooked };