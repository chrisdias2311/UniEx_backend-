const express = require('express');
const app = express();

app.get('/', (req, resp)=>{
    resp.send("Server home page")
})


app.listen(3500,()=>{
    console.log(`server is running on port 3000`);
})