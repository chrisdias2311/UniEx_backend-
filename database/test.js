
const User = require('../schemas/Userschema')
const connection = require('../database')

connection();

async function test(){
let test  = await User.updateOne({email:'jasonsampy88@gmail.com'},{$set:{validity:"yes"}})

console.log(test);
}

test();