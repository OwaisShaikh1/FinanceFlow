const path = require('path')
const express=require('express')
const rootDir=require("../utils/pathUtil")
const userRouter=express.Router()

userRouter.get('/',(req,res,next)=>{
  console.log(req.url,req.method);

})
 

module.exports=userRouter