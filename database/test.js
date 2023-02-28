
const User = require('../schemas/Userschema')
const connection = require('../database');

connection();

async function test(){
        User.find({"validity":"No","verified":"yes"},(error,data)=>{
            if(error)
            {
                console.log(error)
            }
            console.log(data)
        })
}

test();