const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const registerController = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).send({ message: 'User Already Exists', success: false });
    }

    // Hash the password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    // Save the new user
    const newUser = new userModel(req.body);
    await newUser.save();

    res.status(201).send({ message: "Register Successful", success: true });
  } catch (error) {
    console.error('Register Controller Error:', error);
    res.status(500).send({ success: false, message: `Register Controller Error: ${error.message}` });
  }
};

//login callback

const loginController = async(req,res) => {
  try{
    const user = await userModel.findOne({email:req.body.email})
    if(!user){
      return res.status(200).send({message:'user not found',success:false})
    }
    const isMatch = await bcrypt.compare(req.body.password,user.password)
    if(!isMatch){
      return res.status(200).send({message:'Invalid email or password',success:false})
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
    res.status(200).send({message:'Login Success',success:true,token:token})


  }
  catch(error){
    console.log(error)
    res.status(500).send({message:`Error in Login CTRL ${error.message}`})
  }
};

const authController = async(req,res) =>{
  try {
    const user = await userModel.findOne({_id:req.body.userId})
    if(!user){
      return res.status(200).send({
        message:'user not found',
        success:false,
      });
    }else{
      res.status(200).send({
        success:true,
        data:{
          name:user.name,
          email:user.email,
        },
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:'auth error',
      success:false,
      error
    });
  }
};




module.exports = {loginController,registerController,authController};