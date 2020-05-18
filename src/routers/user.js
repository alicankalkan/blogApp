const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middlewares/auth");

router.get("/users", auth, async (req, res) => {
    const users = await User.find({});
    res.send(users);
});

router.post("/user/add", async (req, res) => {
    
    const userAdd  = new User({...req.body});
    try{
        
        const checkEmail = await User.findOne({email: req.body.email});   
        
        if(checkEmail !== null){
            res.status(401).send("This mail already using. Please select another one.")
        }

        const addResult = await userAdd.save();
        const token = await addResult.createToken();
        res.status(201).send(addResult);

    }catch(e){
        res.status(400).send(e);
    }
    
});

router.put("/user/update/me", auth, async(req,res) => {
    
    const allowedUpdates = ["name", "password", "email", "biography"]; //güncellenebilir olanlar
    const keys = Object.keys(req.body); //güncellenebilirleri ayır
    const isValid = keys.every(x => allowedUpdates.includes(x)); // her birini kontrol et
    if(!isValid){
        return res.status(400).send("İstek geçersiz.");
    }

    try{

        keys.forEach(key => req.user[key] = req.body[key]) //gelen istekteki verileri kullanıcının keylerindeki verilerle değiştir
        const updateUser = await req.user.save(); // atanan yeni verilerle kaydet

        if(updateUser){
            res.status(200).send(updateUser);
        }

        

    }catch(e){
        res.status(500).send(e);
    }
});


router.post("/user/login", async (req, res) =>{
    const { email, password } = req.body;
    
    try{
        const user = await User.login(email, password);
        const token = await user.createToken();
        res.status(200).send({user: user, token});
    }catch(e){
        res.status(400).send(e);
    }

});


router.get("/user/logout", auth, async (req, res) => {
    
    try{
        req.user.token = "";
        req.user.save();
        res.status(200).send("Logged out.");
    }catch(e){
        res.status(401).send(e);
    }
    
});


router.delete("/user/delete/me", auth, async(req,res) => {
    
    try{
        await req.user.remove();
        res.status(200).send("Your account has been deleted.");

    }catch(e){
        res.status(401).send("There is no auth");
    }
})

module.exports = router;