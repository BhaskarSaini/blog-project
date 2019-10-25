const mongoose=require('mongoose')

const PostSchema=new mongoose.Schema({
    Name:String,
    Title:String,
    Subtitle:String,
    Content:String,
    Created_At:{
        type:Date,
        default:new Date()
    },
    Image:String
})

const Post=mongoose.model('Post',PostSchema)

module.exports = Post