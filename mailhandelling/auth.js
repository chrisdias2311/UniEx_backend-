const nodemailer =require('nodemailer')

async function sendOtp(otp, email){
    let transporter = nodemailer.createTransport(
        {
            host: "smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
                user: "jasonsampy88@gmail.com", //addacc
                pass:"lsuhlqxqogwerbdq"//change
            }
        }
    );
    let info =await transporter.sendMail({
        from:'UniEx <jasonsampy88@gmail.com>',
        to: email,
        subject:"OTP verification",
        text:"do not reply",
        html:"<b> your otp is"+ otp+"</b>"

    })
    console.log("message has been sent: %s",info.messageId);

}

module.exports = sendOtp;