const express = require('express')
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const myRoute=require('./routes.js');
const mongoose=require('mongoose');
const async=require('async');
const secret = 'mypassword!!';
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(expressJWT({
    secret: secret,
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      }
}).unless({path: '/login'}));

app.use((err, req, res, next)=>{
    if(err.name === 'UnauthorizedError'){
        return res.sendStatus(401);
    }
    return next();
})

app.use('/', myRoute);

async.waterfall([
    cb=>mongoose.connect('mongodb://shani-countries:123456@ds125365.mlab.com:25365/countries', err => cb(err)),
    cb=>app.listen(3008, err => cb(err, 'server up'))
    ],
    (err, result)=>{
        if(!err){
            return console.log(result);
        }
        return console.log(err);
});