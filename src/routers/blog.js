const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const auth = require("../middlewares/auth");
const slugify = require("slugify");
const User = require("../models/user");
const Category = require("../models/category");


router.post("/blog/add", auth, async(req, res) => {
    

    try {
        const userId = req.user._id;
        const newSlug = slugify(req.body.title, {remove: /[*+~.()'"!:@]/g,lower:true});    

        const createBlog = new Blog({
            title: req.body.title,
            description: req.body.description,
            slug: newSlug,
            category: req.body.category,
            user: userId
        });
        const addBlog = await createBlog.save();

        res.status(201).send(addBlog);
        

    } catch (e) {
        res.status(401).send(e);
    }
    

});


router.put("/blog/update/:id", auth, async(req, res) => {

    
    try {
        const userId = req.user._id;
        const { id } = req.params;
        
        const newSlug = slugify(req.body.title, {remove: /[*+~.()'"!:@]/g,lower:true});    

        const updateBlog = await Blog.findOneAndUpdate({_id:id,user:userId},{
            title: req.body.title,
            description: req.body.description,
            slug: newSlug,
            category: req.body.category,
            user: userId
        }, {new: true});
        
        res.status(200).send(updateBlog);
        
        
    } catch (error) {
        res.status(404).send(error)
    }
    

});

router.get("/blog/all", async(req,res) => {
   
    try {
        
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);
        const sort = {};

        if(req.query.sort){
            const slice = req.query.sort.split('_');
            sort[slice[0]] = slice[1] === 'asc' ? 1 : -1;
        }

        const getAllBlogs = await Blog.find({})
        .limit(limit)
        .skip(skip)
        .sort(sort);
        res.status(200).send(getAllBlogs);

    } catch (error) {
        res.status(404).send(error);
    }
});


router.get("/blog/:slug", async(req, res) =>{
    
    try {
        
        const { slug } = req.params;
        const getBlog = await Blog.findOne({slug:slug});
        const getCategory = await Category.findOne({_id:getBlog.category});
        const getUser = await User.findOne({_id:getBlog.user});

        res.status(200).send({blog:getBlog,category: getCategory,user:getUser});

    } catch (error) {
        res.status(404).send(error)
    }
});


router.delete("/blog/delete/:id", auth, async(req,res) => {
    try {
        
        const { id } = req.params;

        const removeBlog = await Blog.findByIdAndRemove({_id:id});

        if(removeBlog){
            res.status(200).send("Blog has been deleted.");
        }

    } catch (error) {
        res.status(404).send(error);
    }
});



module.exports = router;