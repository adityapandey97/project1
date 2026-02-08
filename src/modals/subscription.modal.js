import mongoose,{Schema} from "mongoose";


const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    channels:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    
},{timestamps: true});

const subscription=mongoose.model("Subscription",subscriptionSchema);

export default subscription;