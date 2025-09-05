const path = require('path')
const express=require('express')
const rootDir=require("../utils/pathUtil")


const app=express()



app.use((req,res,next)=>{
  console.log(req.url,req.method);
  next()
})


app.get('/sample',(req,res,next)=>{
  res.send('<h1>hello world this is new  </h1>')
})


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
