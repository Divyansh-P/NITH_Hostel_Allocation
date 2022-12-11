const mongoose=require('mongoose')
const User=require('../model/user')
const {validationResult}=require('express-validator')
const HttpError=require('../model/http-error')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {JWT_sec}=process.env

const getUserById = async (req, res, next) => {
  let { userId } = req.params;
  let user;
  try {
    user = await User.findById(userId, '-password')
    ;
    //exclude password, i.e. return only name and email
  } catch (err) {
    return next(new HttpError('Getting user failed, please try again!', 500));
  }
  res.status(200).json({
    user: user.toObject({ getters: true }),
  });
};

const createUser=async (req,res,next)=>{
    const error=validationResult(req)
    if(!error.isEmpty()){
 return next( new HttpError("Invalid input passed,please check your data",422))
    }
    const {name,email,password}=req.body
    // checking if user already exist
    let existinguser
    try {
        existinguser = await User.findOne({ email });
      
      } catch (err) {
        console.log(err)
        return next(new HttpError('Signing up failed, please try again!', 500));
      }
    if(existinguser){
  return next(new HttpError('Email already exist,Please login or try another email',422));
    }
   //hasing password
   let hashedpassword
   try {
    hashedpassword=await bcrypt.hash(password,12)
   } catch (err) {
return next(new HttpError('Cannot create new user,please try again',500))
   }
   //save user
    const createdUser=new User({name,email,password:hashedpassword})
    try {
        await createdUser.save()
    } catch (err) {
        console.log(err)
 return next(new HttpError('Signup failed please try again',500))
        
    }
   //generate token
   let token
   try {
    token=jwt.sign(
        {userId:createdUser._id,email:createdUser.email},
        JWT_sec
    )
   } catch (err) {
    console.log(err)
    return next(new HttpError('Signup failed, please try again', 500));
    
   }
   res.status(201).json({
    user: {
      name: createdUser.name,
      userId: createdUser.id,
      email: createdUser.email,
      token,
      bio: createdUser.bio,
      avatar: createdUser.avatar,
    },
  });
}


const login=async (req,res,next)=>{
const {email,password}=req.body
let existinguser
try {
    existinguser=await User.findOne({email})
} catch (err) {
    return next(new HttpError('Login failed, try again',500))
}
//check if user exist
if(!existinguser){
    return next(new HttpError('No such email exist, try again or create new account',403))
}
//validate the password
let isvalidPassword=false
try {
    isvalidPassword=await bcrypt.compare(password,existinguser.password)
} catch (error) {
    return next(new HttpError('Login failed, try again',500))
}
if(!isvalidPassword){
    return next(new HttpError('WRONG password, try again',401))
}
//generate token
let token
try {
    token=jwt.sign({userId:existinguser._id,email:existinguser.email},JWT_sec)
} catch (error) {
    return next(new HttpError('Login failed, try again',500))
}
res.json({
    user: {
      name: existinguser.name,
      userId: existinguser.id,
      email: existinguser.email,
      token,
      bio: existinguser.bio,
      avatar: existinguser.avatar
    },
  });
}

const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { body } = req;

 /*  if (req.file) {
    const imageUrl = await uploadToCloudinary(req.file);
    req = { ...req, body: { ...body, avatar: imageUrl } };
  } */
  

  let user;
  try {
    user = User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true },
      (err, data) => {
        if (err) {
          return next(new HttpError('Could not find user to update', 500));
        } else {
          const { name, id: userId, bio, email, avatar } = data;
          res.status(200).json({ user: { name, userId, bio, email, avatar } });
        }
      }
    );
  } catch (err) {
    return next(new HttpError('Could not update user', 500));
  }
};

exports.createUser=createUser
exports.login=login
exports.updateUser=updateUser
exports.getUserById=getUserById