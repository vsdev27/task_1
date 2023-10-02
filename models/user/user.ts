import { mongoose } from "../.."

const userschema = new mongoose.Schema({
    user_name: {
        type: String,
    },
    email:{
        type:String,
    },
    
    password: {
        type: String
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    },
})

export const userModel=mongoose.model("user",userschema)