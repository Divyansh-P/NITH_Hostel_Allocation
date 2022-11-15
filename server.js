const express=require('express')
const app=express()
const PORT=process.env.PORT||5000
app.get('/',(res,req)=>{
    res.send('Hello NITH')
})
app.listen(PORT,()=>{
    console.log(`Server is running in ${PORT}`)
})