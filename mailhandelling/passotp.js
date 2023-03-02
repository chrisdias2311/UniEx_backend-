const nodemailer =require('nodemailer')
const fs = require('fs')
const path = require('path')

async function sendOtp(otp, email){
    htmlfile = fs.readFileSync(path.resolve(__dirname,'./otpverif.html'))
    let transporter = nodemailer.createTransport(
        {
            host: "smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
                user: "jasonsampy88@gmail.com", //add acc
                pass:"lsuhlqxqogwerbdq"//change
            }
        }
    );
    let info =await transporter.sendMail({
        from:'UniEx <jasonsampy88@gmail.com>',
        to: email,
        subject:"OTP verification",
        text:"Your otp is "+otp+"do not reply",
        attachments:{
            filename:'Logo.jpeg',
            path: __dirname+'/Logo.jpeg',
            cid:'logo'
        },
        html:htmlfile+'<code style="font-size:1.2em; background:#212121;padding:5px">'+otp+"</code></h1></div></body>"

    })
    console.log("message has been sent: %s",info.messageId);

}



//sendOtp("341JKAD","jasonsampy88@gmail.com")
module.exports = {sendOtp};