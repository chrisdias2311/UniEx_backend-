
const User = require('../schemas/Userschema')
const connection = require('../database');

connection();

async function test(){
    const user = await User.findOne({ email:'jasonsampy88@gmail.com' },{password:0})
    console.log(user);
}

test();