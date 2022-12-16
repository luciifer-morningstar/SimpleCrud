const validator = require('../helpers/validate');
const Users = require('../models/users')
var jwt = require('jsonwebtoken');
const secret = 'BHRTPO(TY&'

const register = (req, res, next) => {
    const validationRule = {
        "email": "required|email",
        "name": "required|string",
        "password": "required|string|min:6",
        "image": "required"
    }
    
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}

const loginUser = (req, res, next) => {
    const validationRule = {
        "email": "required|email",
        "password": "required|string|min:6"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}

const checkAuthentication = (req, res, next) => {
    var token = req.headers['authorization'];
    let errors = [];
    if (!token){
        res.status(401).send({ message: "Unauthorise User"});
    } else {
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) return res.status(406).send({ message: 'Invalid Token.' });
            let user = await Users.findById(decoded['id'])
            if(!user) res.status(401).send({ message: "Unauthorise User"});
            next();
        });
        }
}

const updateProfile = (req, res, next) => {
    const validationRule = {
        "email": "required|email",
        "name": "required|string",
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}


module.exports = { 
    register,
    loginUser,
    checkAuthentication,
    updateProfile
  }