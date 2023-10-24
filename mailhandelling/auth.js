
const nodemailer = require('nodemailer')
//const fs = require('fs')
const path = require('path')
async function sendOtp(otp, email) {
    //htmlfile = fs.readFileSync(path.resolve(__dirname,'./emailverif.html'))
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


    try {
        let info = await transporter.sendMail({
            from: 'UniEx <jasonsampy88@gmail.com>',
            to: email,
            subject: "OTP verification",
            text: "Your otp is " + otp + "do not reply",
            attachments: {
                filename: 'Logo.jpeg',
                path: __dirname + '/Logo.jpeg',
                cid: 'logo'
            },
            html: `
        <body style = "background-color: #212121;">
            <center><img style="width:10em;"src="cid:logo"></center>
            <div style="background-color: #262626;color:antiquewhite; ">
            <h3 style="text-align: center;padding-top: 20px;">Use this verification code to verify your email.</h3>
            <h1 style="padding-top: 100px;padding-bottom: 100px;text-align: center;" >Your otp is 
        <code style="font-size:1.2em; background:#262626;padding:5px">${otp}</code></h1></div></body>
        `
        })
        console.log("message has been sent: %s", info.messageId);
    } catch (err) {
        console.log(err)
    }
}

//sendOtp("341JKAD", "jasonsampy88@gmail.com")
module.exports = { sendOtp };