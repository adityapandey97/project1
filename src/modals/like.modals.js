import mongoose,{Schema} from "mongoose";
const likeSchema = new mongoose.Schema(
    {
        likedby:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        tweet:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tweet",
            required:true
        },
        comment:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment",
            required:true
        },
        video:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video",
            required:true
        },timestamps:true
        
    }
)
const Like = mongoose.model("Like",likeSchema);
export default Like;