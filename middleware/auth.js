const User=require('../database/model/User')
module.exports=(request,respond,next)=>{
    User.findById(request.session.UserId,(error,user)=>{
        if(error||!user)
        {
            respond.redirect('/login/user')
        }
        next()
    })
}