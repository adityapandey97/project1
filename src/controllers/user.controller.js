import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../modals/user.modals.js";
import uploadOnCloudinary  from "../utils/cloudinary.js";
import { decode } from "jsonwebtoken";


const registerUser = asyncHandler(async (req, res) => {

    // req.body contail data like text or json number boolean
    // here we are destructuring the data from req.body
    const { fullName, email, username, password } = req.body;


    // this is use to check all field are provided or not
    // and using the apierror to throw the error with status code and message in the proper way we desing it in utils/apiError.js
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }


    // check if user with the same email or username already exists
    // $or is a mongoDB operator to check multiple conditions(advanced query)
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }


    // ceck if files are uploaded
    // as avtar is required so we go through this specif check but coverimage is not required so we dont need to check this in that manner but
    // but still we can check if we want to store null or defauld vale to upload on cloudinary
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    } 

    // required file so chek confiormly it was given or not  if not given then throw error
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }



    // upload files to cloudinary and get the uploaded file urls
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);



    // again check if avatar upload was successfull or not
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }


    // as all data given perfectly so we create the user in the database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });





    // fetch the created user without password and refreshToken fields to send in response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");


    // if user creation failed then throw the error
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }


    // send success response with created user data
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );



});

const genrateAccessAndRefreshToken = async (userId)=>
{
    try{
      const user= await User.findById(userId);
      const accessToken= user.genrateAccessToken();
      const refreshToken= user.genrateRefreshToken();
      user.refreshToken= refreshToken;
      await user.save();
      return {accessToken, refreshToken};
    } catch(error){
      throw new ApiError(500, "Error generating tokens");
    }
    
}


    
const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password } = req.body;


    if(!username && !email){
        throw new ApiError(400, "Username or Email is required to login");
    }


    if(!password){
        throw new ApiError(400, "Password is required to login");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    });
    
    
    if(!user){
        throw new ApiError(404, "User does not exist");
    }


    if(!(await user.isPasswordMatched(password))){
        throw new ApiError(401, "Invalid credentials");
    }
    

    const {accessToken, refreshToken} = await genrateAccessAndRefreshToken(user._id);
 
    const loogedInUser = await User.findById(user._id).select("-password -refreshToken");
     
    const  options ={
        httpsonly:true,
        secure:true
    }

    
    
    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, {
            user:loogedInUser, 
            accessToken, 
            refreshToken
        },
        
    "User logged in successfully")
    );




});


const logoutUser = asyncHandler(async (req, res) => {

 await User.findByIdAndUpdate(
    req.user._id, 
    {
       $set: { 
            refreshToken: null
       }
    },
    {
        new:true
    }
);


const  options ={
        httpsonly:true,
        secure:true
    }



return res
.status(200)
.clearCookie("refreshToken", options)
.clearCookie("accessToken", options)
.json(
    new ApiResponse(200, {}, "User logged out successfully")
);



});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"Invalid request, refresh token is missing");
        }
    
        jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(401,"user not found with this token");
        }
    
        if(user.refreshToken !== incomingRefreshToken){
            throw new ApiError(401,"refresh token is invalid or expired");
        }
    
        const {accessToken, refreshToken} = await genrateAccessAndRefreshToken(user._id);
    
        const  options ={
            httpsonly:true,
            secure:true 
        }
    
        return res
        .status(200) 
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, {
                accessToken,
                refreshToken
            },
            
        "Refresh token generated successfully")
        );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken};