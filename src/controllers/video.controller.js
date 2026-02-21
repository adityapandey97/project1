import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {

/* ================= FETCH ALL VIDEOS =================

asyncHandler → async errors automatically handle karta hai
req.query → URL parameters (page, limit, search, sort, userId)

page → current page number (pagination)
limit → ek page me kitni videos
query → search keyword
sortBy → kis field se sort karna
sortType → asc (1) ya desc (-1)
userId → specific user ki videos filter

filter → MongoDB query object
isPublished: true → sirf public videos

$or → multiple conditions me se koi ek match ho
$regex → partial text search
$options: "i" → case insensitive (Node = node)

isValidObjectId() → MongoDB ID valid hai ya nahi check karta
throw → error stop karke error handler me bhejta

sort() → data ko arrange karta (1 = asc, -1 = desc)
skip() → pagination ke liye starting records ignore
limit() → kitne records return karne hain

populate() → ObjectId ko actual user data se replace karta (MongoDB join jaisa)

countDocuments() → total matching videos count karta
Math.ceil() → total pages calculate karta (round up)

ApiResponse → custom structured JSON response bhejne ke liye
*/
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const filter = { isPublished: true }
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        filter.uploadedBy = userId;
    }
    let sortOptions = {}
    if (sortBy && sortType) {   
        sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
    }
    const videos = await Video.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("uploadedBy", "fullName avatar username")
    const totalVideos = await Video.countDocuments(filter)
    const totalPages = Math.ceil(totalVideos / limit)
    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            videos,
            pagination: {
                totalVideos,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        }, "Videos fetched successfully")
    );
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    
    const videoLocalPath = req.files?.video[0]?.path
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }
    // upload files to cloudinary and get the uploaded file urls
    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!video) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail file is required")
    }
    // create video in the database
    const createdVideo = await Video.create({
        title,
        description,
        videoUrl: video.url,
        thumbnailUrl: thumbnail.url,
        uploadedBy: req.user._id
    })
    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while publishing the video");
    }
    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video published successfully")
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId).populate("uploadedBy", "fullName avatar username")
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.uploadedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description
            }
        },
        { new: true }
    )
    if (!updatedVideo) {
        throw new ApiError(500, "Failed to update video details");
    }
    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.uploadedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }
    await Video.findByIdAndDelete(videoId);
    // deleteFromCloudinary(video.videoUrl);
    // deleteFromCloudinary(video.thumbnailUrl);
    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    );
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.uploadedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        { new: true }
    )
    if (!updatedVideo) {
        throw new ApiError(500, "Failed to toggle publish status");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "Publish status toggled successfully"
            )
        );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}