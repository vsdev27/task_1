import { mongoose } from "../.."


const logintokenSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    token:{
        type: String,
        default:''
    },
   
    created_at:{
        type:Date,
        default:new Date()
    }
});

export const logintokenmodel = mongoose.model('login_token', logintokenSchema);
