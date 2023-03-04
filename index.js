const express = require('express');
const app = express();
const ConnectionDB = require("./database");
const User = require('./schemas/Userschema')
const cors = require('cors')
const passport = require("passport");
const { initializingPassport } = require('./middlewares/passportConfig');
const expressSession = require('express-session')
const jwt = require("jsonwebtoken")
const http = require('http');





const multer = require('multer')
const ImageModel = require('./schemas/ImageModel')







const secretKey = "secretKey";

ConnectionDB();

initializingPassport(passport);


app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(expressSession({ secret:"secret", resave:false, saveUninitialized:false }));
app.use(passport.initialize());
app.use(passport.session());



app.set("view engine", "ejs")
// app.get('/', (req, resp)=>{
//     resp.send("Server home page")
// })
app.get('/', (req, resp)=>{
    resp.render("index");
})




app.use('/api/image', require('./middlewares/multer').router)
app.use('/api/user', require('./routes/user'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/products', require('./routes/product'))
app.use('/api/transactions', require('./routes/transactions'))






//For the form views 
app.get('/', (req, resp)=>{
    resp.render("index");
})

app.get("/api/user/register", (req, res)=> {
    res.render("register")  
})

app.get("/api/user/login", (req, res)=> {
    res.render("login")
})

app.use("/img",express.static('images'))

const server = require('http')

app.listen(5000,()=>{
    console.log(`server is running on port 5000`);
})