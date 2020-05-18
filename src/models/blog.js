const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    photo: {
      type: Buffer  
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    slug:{
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});



const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;