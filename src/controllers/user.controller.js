import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../modals/user.modals.js";
import uploadOnCloudinary  from "../utils/cloudinary.js";


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

export default registerUser;