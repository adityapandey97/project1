import {v2 as cloudinary} from "cloudinary";
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true
});
const cloudinaryupload=async(localfilepath)=>{
    try{
        if(!localfilepath) return null;
        const response=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto",
        });
        console.log("Cloudinary upload response:", response);
        return response;
    }catch(error){
        FileSystem.unlinkSync(localfilepath);
    }
}
export default cloudinaryupload;
