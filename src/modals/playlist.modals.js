import mongoose,{Schema} from "mongoose";
const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:100,

    },
    description:{
        type:String,
        required:false,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    //extra hai
    videoscount:{
        type:Number,
        default:0
    },timestamps:true
})
const Playlist = mongoose.model("Playlist",playlistSchema);
export default Playlist;
