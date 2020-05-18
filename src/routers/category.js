const express = require("express");
const Category = require("../models/category");
const router = express.Router();
const auth = require("../middlewares/auth");
const slugify = require("slugify");




router.post("/category/add", auth, async (req, res) => {
    
    try{
        
        const { title } = req.body;
        const newSlug = slugify(title, {remove: /[*+~.()'"!:@]/g,lower:true});
        const createCategory = new Category({...req.body,slug: newSlug});

        const saveCategory = await createCategory.save();
        res.status(200).send(saveCategory);
    }catch(e){
        res.status(404).send(e);
    }
});

//you can filter categories 

// /category/all?limit=2&skip=6&sort=createdAt_desc

router.get("/category/all", async (req, res) => {

    try{
        
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);
        const sort = {};

        if(req.query.sort){
            const slice = req.query.sort.split('_');
            sort[slice[0]] = slice[1] === 'asc' ? 1 : -1;
        }

        const getAllCategories = await Category.find({})
        .limit(limit)
        .skip(skip)
        .sort(sort);
        res.status(200).send(getAllCategories);

    }catch(e){
        res.status(404).send(e);
    }

});

router.put("/category/update/:id", auth, async(req,res) => {

    try{
        
        const { id } = req.params;
        const { title } = req.body;
        const newSlug = slugify(title, {remove: /[*+~.()'"!:@]/g,lower:true});

        const updateCategory = await Category.findByIdAndUpdate({_id:id},{
            title: title, 
            description: req.body.description,
            slug: newSlug
        });

        if(updateCategory){
            res.status(201).send(updateCategory);
        }else{
            res.status(404).send("There is no category that your looking.")
        }

    }catch(e){
        res.status(404).send(e);
    }
});

router.delete("/category/delete/:id", auth, async(req, res) =>{

    try{
        
        const { id } = req.params;

        const deleteCategory = await Category.findByIdAndDelete({_id:id});
        if(deleteCategory){
            res.status(200).send("Category deleted.");
        }else{
            res.status(404).send("There is no category that your looking.");
        }

    }catch(e){
        res.status(404).send(e);
    }

});

router.get("/category/:slug", async(req ,res) => {


    try {

        const { slug } = req.params;
        const getCategory = await Category.find({slug:slug});
        res.status(200).send(getCategory);

    } catch (e) {
        res.status(404).send(e);
    }

});

module.exports = router;