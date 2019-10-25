const path=require('path')
const express=require('express')
const bcrypt=require('bcrypt')
const FileUpload=require('express-fileupload')
const edge=require('edge.js')
const auth=require('./middleware/auth')
const expressEdge=require('express-edge')
const User=require('./database/model/User')
const Post=require('./database/model/Post')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressSession=require('express-session')
const connectMongo=require('connect-mongo')
const app=new express()
mongoose.connect('mongodb://localhost/my_database',{useNewUrlParser:true})
app.use(FileUpload())
app.use(express.static('public'))
app.use(expressEdge)
app.set('views', `${__dirname}/views`)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const mongoStore=connectMongo(expressSession)
app.use(expressSession({
    secret:'secret',
    store:new mongoStore({
        mongooseConnection:mongoose.connection
    })
}))
app.use('*',(request,respond,next)=>{
    edge.global('auth',request.session.UserId)
    next()
})
app.get('/',async (request,respond)=>{
    const posts=await Post.find({})
    const user=request.session.UserId
    const active_user=await User.findById(user)
    respond.render('index',{
        posts,active_user
    })
})
app.post('/post/create',(request,respond)=>{
    const {Image}=request.files
    Image.mv(path.resolve(__dirname,'public/posts',Image.name),(error,success)=>{
        Post.create(({
            ...request.body,
            Image:`/posts/${Image.name}`
        }),(error,post)=>{
            respond.redirect('/')
         })
    })
})
app.post('/user/create',(request,respond)=>{
    const {Image}=request.files
    Image.mv(path.resolve(__dirname,'public/user',Image.name),(error,success)=>{
        User.create(({
            ...request.body,
            Image:`/user/${Image.name}`
        }),(error,user)=>{
            respond.redirect('/')
        })
    })
})
app.post('/user/login',(request,respond)=>{
    const {Email,Password}=request.body
        User.findOne({Email},(error,User)=>{
            if(User)
            {
               bcrypt.compare(Password,User.Password,(error,same)=>{
                   request.session.UserId=User._id
                respond.redirect('/')
               })
            }
            else
            {
                respond.redirect('/login/user')
            }
        })
})
app.get('/register',(request,respond)=>{
    respond.render('register')
})
app.get('/post',(request,respond)=>{
    if(request.session.UserId)
    {
       return respond.render('post')
    }
    respond.redirect('/login/user')
})
app.get('/show/:id',async (request,respond)=>{
    const post=await Post.findById(request.params.id)
        respond.render('showpost',{
            post
        })
})
app.get('/login/user',(request,respond)=>{
    respond.render('login')
})
app.get('/contact',(request,respond)=>{
    respond.render('contact')
})
app.get('/logout',(request,respond)=>{
    request.session.destroy(()=>{
        respond.redirect('/')
    })
})
app.listen(3000,()=>{
    console.log('App Listening At Port 3000')
})