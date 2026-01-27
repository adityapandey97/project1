
// higher order function to handle aysnc errorr in express rout it do work as a wraper function over the request respose way of clint and server the data coming fron the clint it 
// may wrong due to server issue or clint issue so to handle that we use this higher order function
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((error)=>next(error))
    }
}

export{asyncHandler}   


// this was a try cathch method of this higher order function
// const asyncHandler =(fn)=> async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code||500).jason({
//             sucssess:false,
//             messege:error.message
//         })
//     }    
// }