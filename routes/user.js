const express=require('express')
const router=new express.Router()
const Usercontroller=require('../controller/users')
const {createUser,login,updateUser,getUserById}=Usercontroller
router.get('/userinfo/:userId',getUserById)
router.post('/signup',createUser)
router.post('/login',login)
router.patch('/user/:userId',updateUser)
module.exports=router