import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }
    const isLiked=await Like.findOne({video:videoId,owner:req.user._id})
    if(!isLiked){
        await Like.create({video:videoId,owner:req.user._id})
        return res.status(200).json(
            new ApiResponse(200,null,"Video liked successfully")
        )
    }else{
        await Like.findByIdAndDelete(isLiked._id)
        return res.status(200).json(
            new ApiResponse(200,null,"Video unliked successfully")
        )
    }
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid commentId")
    }
    const isLiked=await Like.findOne({comment:commentId,owner:req.user._id})
    if(!isLiked){
        await Like.create({comment:commentId,owner:req.user._id})
        return res.status(200).json(
            new ApiResponse(200,null,"Comment liked successfully")
        )
    }else{
        await Like.findByIdAndDelete(isLiked._id)
        return res.status(200).json(
            new ApiResponse(200,null,"Comment unliked successfully")
        )
    }
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweetId")
    }
    const isLiked=await Like.findOne({tweet:tweetId,owner:req.user._id})
    if(!isLiked){
        await Like.create({tweet:tweetId,owner:req.user._id})
        return res.status(200).json(
            new ApiResponse(200,null,"Tweet liked successfully")
        )
    }else{
        await Like.findByIdAndDelete(isLiked._id)
        return res.status(200).json(
            new ApiResponse(200,null,"Tweet unliked successfully")
        )
    }
    //TODO: toggle like on tweet
}
)
//not completed yet
const getLikedVideos = asyncHandler(async (req, res) => {
    //need of pipeline and populate in mongoose
    const likedVideos = await Like.findOne({owner:req.user._id}).populate("video")
    return res.status(200).json(
        new ApiResponse(200,likedVideos?.video || [],"Liked videos fetched successfully")
    )
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}