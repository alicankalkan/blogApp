const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create Modell's Schema

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image: {
        type: String
    },
    slug: {
        type: String,
        require: true,
        unique: true
    },
}, { timestamps:true });

categorySchema.virtual("blogs", {
    ref: "Blog",
    localField: "_id",
    foreignField: "category"
});


//create Model

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;