import axios from "axios"
import fs from "fs"
import FormData from "form-data"
import User from "../models/user.model.js"

const removeBgImage = async (req,res) => {
    try {
        const {clerkId} = req.body

        const user = await User.findOne({clerkId})

        if(!user){
            return res.json({success:false,message:"User Not Found"})
        }

        if(user.creditBalance === 0){
            return res.json({success:false,message:'No Credit Balance',creditBalance:user.creditBalance})
        }

        const imagePath = req.file.path

        const imageFile = fs.createReadStream(imagePath)



    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })   
    }
}


export {removeBgImage}

