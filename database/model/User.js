const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const UserSchema=mongoose.Schema({
    Username:String,
    Email:String,
    PhoneNumber:String,
    Password:String,
    Image:String
})

UserSchema.pre('save',function(next){
        const User=this
        bcrypt.hash('User.Password',10,(error,encrypt)=>{
            User.Password=encrypt
            next()
        })
    })

const User=mongoose.model('User',UserSchema)

module.exports = User