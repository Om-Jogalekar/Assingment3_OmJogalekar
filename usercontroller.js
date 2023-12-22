require("dotenv").config();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require("jsonwebtoken");
const Secretkey = process.env.Secretkey

const validateRegistration = (req,res,next)=>{
    const {username , password} = req.body;
    if(!username || !password)
    {
        return res.status(400).json({eroor : 'Username and password are required'});
    }
    next();
}
const hashpassword = async(req,res,next)=>{
    try {
        const {password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        req.hashedPassword = hashedPassword;
        next();    
    } catch (error) {
        res.status(500).json({error:error.message});
    }
    
}

const registerUser = async(req,res)=>{
    try {
        const {userid,username , email, mobile , isAdmin} = req.body;
        const user = new User({
            userid,
            username,
            email,
            mobile,
            password:req.hashedPassword,
            isAdmin
        })

    const existUser = await User.findOne({email:email});
    if(existUser)
    {
        res.status(400).json({msg:"User already exist"});
    }
    else{
        await user.save();
        res.status(200).json({msg:"User register successful"});
    }

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const login = async (req , res)=>{
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({msg : "Invalid Username or Password"});
        }
        const vlaidPassword = await bcrypt.compare(password,user.password);
        if(!vlaidPassword){
            return res.status(401).json({msg : "Invalid Username or Password"});
        }
        const token = jwt.sign({ userId: user._id, isAdmin:user.isAdmin},Secretkey);
        res.status(200).json({msg:"login successfully", token });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


const userList = async(req,res)=>{
    try {
        const users = await User.find();  
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const userdetails = async (req,res)=>{
    try {
        const userid = req.userid;
        const data  = await User.findOne({userid:userid});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const updateDetails = async(req,res)=>{
    try {
        const userId = req.userId;
        const {userid,username,email,mobile,isAdmin} = req.body;
        const updatedData = {userid : userid,
                            username:username,
                            email:email,
                            mobile:mobile,
                            password:req.hashedPassword,
                            isAdmin:isAdmin}
        
        const update = await User.updateOne({userid:userId},updatedData);
        if(update.modifiedCount > 0){
            res.status(200).json({msg : "Details updated"});
        }
        else
        {
            res.status(404).json({message : "Profile Not Found"});
        }

    } catch (error) {
         res.status(500).json({error:error.message});
    }
}


const deleteUser = async(req,res)=>{
    try {
        const userid = req.params.userid;
        const deletedUser = await User.deleteOne({userid : userid});
        if(deletedUser.deletedCount >= 0){
            res.status(200).json({msg : "User deleted"});
        }
        else
        {
            res.status(404).json({message : "Profile Not Found"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}



module.exports = {validateRegistration,
                  hashpassword,
                  registerUser,
                  login,
                  userList,
                  userdetails,
                  updateDetails,
                  deleteUser
                };