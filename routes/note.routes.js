const express=require("express");
const {nodeModel, noteModel}=require("../models/note.model")
const {auth}=require("../middlewares/auth.middlewares")

const noteRouter=express.Router()

noteRouter.use(auth)
noteRouter.post("/create",async(req,res)=>{
  try{
   const note= new noteModel(req.body)
   await note.save()
   res.json({message:"New note has been added",note:req.body})
  }catch(err){
    res.json({error:err.message})
  }
})

noteRouter.get("/",async(req,res)=>{
    try{
        const notes= await noteModel.find({userID:req.body.userID})
        res.send(notes)
       }catch(err){
         res.json({error:err.message})
       }
})

noteRouter.patch("/update/:noteID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {noteID}=req.params;
    try{
        const note = await noteModel.findOne({_id:noteID});
        const userIDinNoteDoc=note.userID
        if(userIDinUserDoc===userIDinNoteDoc){
            await noteModel.findByIdAndUpdate({_id:noteID},req.body)
            res.json({message:`${note.title} has been updated`})
        }else{
            res.json({message:"Not Authorized"})
        }
    }catch(err){
        res.json({error:err})
    }
    
})

noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {noteID}=req.params;
    try{
        const note = await noteModel.findOne({_id:noteID});
        const userIDinNoteDoc=note.userID
        if(userIDinUserDoc===userIDinNoteDoc){
            await noteModel.findByIdAndDelete({_id:noteID})
            res.json({message:`${note.title} has been deleted`})
        }else{
            res.json({message:"Not Authorized"})
        }
    }catch(err){
        res.json({error:err})
    }
})

module.exports={
    noteRouter
}