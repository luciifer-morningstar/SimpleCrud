var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const secret = 'BHRTPO(TY&'
const Users = require('../models/users');

const AuthController = {
    async register (req, res) {
        if(req.body.email){
            var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            let newUser = {
                name: req.body.name,
                email: req.body.email,
                image: req.body.image,
                password: hashedPassword,
            }
            const _data = await new Users(newUser).save()

            try{
                var token = jwt.sign({ id: _data._id }, secret, {
                    expiresIn: 86400
                  });
                res.status(200).send({ auth: true, token: token });
            }catch(err){
                res.send('Error ' + err)
            }
        }
    },

    async login (req, res) {
        try{
            let email = req.body.email.toLowerCase();
            let password = req.body.password;
            let user = await Users.findOne({email:email});
            if(!user) res.status(401).send({ message: "Unauthorise User"});
            let valid = await bcrypt.compare(password, user['password']);
            if(valid){
                delete user['_doc']['password'];
                let token = jwt.sign({ id: user._id }, secret, {
                            expiresIn: 86400
                        });
                res.status(200).send({...user['_doc'], token:token});
            }
            res.status(401).send({ message: "Unauthorise User"});
        }catch(err){
            res.send('Error ' + err)
        }
    },

    async auth_user(req, res){
        var token = req.headers['authorization'];
        if (!token) return res.status(401).send({ message: 'Token Required.' });
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) return res.status(406).send({ message: 'Invalid Token.' });
            let user = await Users.findById(decoded['id'])
            if(!user) res.status(401).send({ message: "Unauthorise User"});
            delete user['_doc']['password']
            res.status(200).send({message:"Data Retrived Successfully",data:user['_doc']});
        });
    },

checkAuthUser(token){
        if (!token) return res.status(401).send({ message: 'Token Required.' });
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) return res.status(406).send({ message: 'Invalid Token.' });
            let user = await Users.findById(decoded['id'])
            if(!user) res.status(401).send({ message: "Unauthorise User"});
            return {status: true, id:user['_id']};
        });
    },
    
    async updateProfile(req, res){
        try{
            let updateObject = {};
            let result = {};
            let token = req.headers['authorization'];
            //let result = await this.checkAuthUser(req.headers['authorization']);
            if (!token) return res.status(401).send({ message: 'Token Required.' });
		jwt.verify(token, secret, async function(err, decoded) {
		    if (err) return res.status(406).send({ message: 'Invalid Token.' });
		    let user = await Users.findById(decoded['id'])
		    if(!user) res.status(401).send({ message: "Unauthorise User"});
            result = {status: true, id:user['_id']};
            });
            const data = await Users.findById(result['id'])
            if(req.body.email){
                let checkMailExists = await Users.findOne({email:req.body.email.toLowerCase()});
                if(checkMailExists && result['id'].toString() != checkMailExists['_doc']['_id'].toString()){
                    res.status(406).send({ message: "Email Already Exists"});
                }
                updateObject['email'] = req.body.email.toLowerCase();
            }
            if(req.body.password){
                updateObject['password'] = crypt.hashSync(req.body.password, 8);
            }
            if(req.body.name){
                updateObject['name'] = req.body.name;
            }
            if(req.body.image){
                updateObject['image'] = req.body.image;
            }
               const _data = await Users.updateOne({_id:result['id']},{$set:{...updateObject}})
               res.status(200).send({message:"Profile Updated Successfully",data:_data['_doc']});   
            }catch(err){
            console.log("Error",err)
                res.send('Error')
            }
        },
    
};

module.exports = AuthController;
