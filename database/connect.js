const mongoose = require ('mongoose');

const url = 'mongodb://jasonsampy:6JFtsckoKSmiBmRsZ4esXU5jDlqikAtvx3PM2ST9UCW5TiSOxWJYhF070Hrl91weHlaWubzm30yDACDb14SbOA==@jasonsampy.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@jasonsampy@';

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log(`MongoDB connected ${conn.connection.host}`)
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;