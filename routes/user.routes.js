const express=require("express")
const {userModel}=require("../models/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
  const{name,email,password}=req.body
  try{
   bcrypt.hash(password,5,async(err,hash)=>{
    if(err){
        res.json({error:err.message})
    }else{
        const user=new userModel({name,email,password:hash})
        await user.save()
        res.json({message:"User has been registered!!",user:req.body})
    }
   })
  }catch(err){
    res.json({error:err.message})
  }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
      const user= await userModel.findOne({email})
      if(user){
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
              const token=jwt.sign({userID:user._id,name:user.name},process.env.secret)
              res.json({message:"Logged In!!",token})
            }else{
                res.json({message:"Wrong credentials!!"})
            }
        })
      }else{
        res.json({messsage:"User does not exist!"})
      }
    }catch(err){
        res.json({error:err.message})
    }
})


module.exports={
    userRouter
}