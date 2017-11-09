const express=require('express');
const appRouter=express.Router();
const http=require('http');
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose');
const secret = 'mypassword!!';
const myModel=require('./model/user.model.js');
const User=mongoose.model('User', myModel);

const errorHandler = (err,res,cb) => {
	if(err){
		return res.sendStatus(401);
	}
	return cb();
}

const successHandler = (req, next, data) => {
	const token = jwt.sign({username: data.username, somedata: data._id}, secret, {expiresIn: 30});
	req.token=token;
	next();
}

const verifyUser=(req, res, next)=>{
	const {username ,password} = req.body;
	User.find({username: username, password: password}, (err, data) => errorHandler(err, res, () => successHandler(req, next, data)))
}

appRouter.post('/login', verifyUser, (req,res)=>{
    return res.redirect('/index.html?token=' + req.token);
})

const getCountries = (req, res, next) => {
    http.get({
        host: 'restcountries.eu',
        path: '/rest/v2/all?fields=name;population;area;flag'
    }, response => {
        let body = "";
        response.on('data', data => {
            body += data;
        });
        response.on('end', () => {
            req.data=JSON.parse(body);
            next();
        })
    })
}
appRouter.get('/main', (req, res) => res.json({status:'hello'}));

appRouter.get('/charts', getCountries, (req, res) => res.json({data: req.data}));

appRouter.get('/game', getCountries, (req, res) => res.json({data: req.data}));

/*appRouter.get('/api', (req,res)=>{
    return res.json({data: 'abc'})
})
appRouter.get('/abc', (req,res)=>{
    const token = req.headers.authorization.split(' ')[1];
    res.json({token: jwt.decode(token)});
})*/
module.exports=appRouter;