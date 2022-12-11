const mongoose=require('mongoose')
const Room=require('../model/room')
const HttpError=require('../model/http-error')
const getRoom= async(req,res,next)=>{
    let rooms
    try {
        rooms = await Room.find().sort({ date: 'desc' })
        ;
    } catch (error) {
        return next(new HttpError('Could not fetch posts, please try again', 500));
    }
    res.json({ rooms: rooms.map((room) => room.toObject({ getters: true })) });
}
const allotRoom=async (req,res,next)=>{
    const {userId,userId2,roomId,number,direction,owners}=req.body
    // checking if user already exist
    let existingroom
    try {
        existingroom = await Room.findbyId({ roomId })
      } catch (err) {
        console.log(err)
        return next(new HttpError('Signing up failed, please try again!', 500));
      }
    if(existingroom.owners>0){
  return next(new HttpError('Room already alloted!',422));
    }
    let user1
    let user2
    try {
      user1 = await User.findById(userId); //check if the user ID exists
    } catch (err) {
      return next(new HttpError('Creating post failed, please try again', 500));
    }
    if(userId2){
      try {
        user2 = await User.findById(userId2); //check if the user ID exists
      } catch (err) {
        return next(new HttpError('Creating post failed, please try again', 500));
      }
    }
    const allotedRoom=await Room.create({
    number,mode,direction,in_out,_floor,owners
    })
   //save user and room
   try {
    const sess = await mongoose.startSession(); //start session
    sess.startTransaction(); //start transaction
    await allotedRoom.save({ session: sess }); //save new doc with the new post
    user1.room.push(allotedRoom); //add post id to the corresponding user
    if(userId2){
      user1.room.push(allotedRoom)
    }
    //(BTS: MongoDB grabs just the post id and adds it to the "posts" array in the "user" doc)
    await user1.save({ session: sess }); //save the updated user (part of our current session)
    await user2.save({ session: sess });
    await sess.commitTransaction(); //session commits the transaction
    //only at this point, the changes are saved in DB... anything goes wrong, EVERYTHING is undone by MongoDB
  } catch (err) {
    return next(new HttpError('Creating post failed, please try again', 500));
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
