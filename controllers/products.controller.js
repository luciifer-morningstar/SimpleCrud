const Products = require('../models/products')
const validator = require('../helpers/validate');

const ProductController = {
    async index (req, res) {
        try{
            const data = await Products.find()
             res.status(200).send({ message: "Product Retrived Successfully", data: data});
        }catch(err){
            res.send('Error ' + err)
        }
    },

    async getOne (req, res) {
        try{
            const data = await Products.findById(req.params.id)
            res.status(200).send({ message: "Product Retrived Successfully", data: data['_doc'] });
        }catch(err){
            res.send('Error ' + err)
        }
    },

    async store (req, res) {
        const validationRule = {
            "name": "required|string",
            "type": "required|string",
            "size": "required|integer",
            "color": "required|string",
            "quantity": "required|string",
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        let newObject = {};
        newObject = {
            name: req.body.name,
            type: req.body.type,
            size: req.body.size,
            quantity: req.body.quantity,
            color: req.body.color
        }
        if(req.body.images && req.body.images.length > 0){
            newObject = {
                ...newObject,
                images:req.body.images
            }
        }
        
        const data = new Products(newObject)
        try{
            const _data =  await data.save() 
            res.status(200).send({ message: "Product Created Successfully", data: data });
        }catch(err){
        	console.log("Error",err)
            res.send('Error')
        }
    },

    async update(req, res){

        const validationRule = {
            "name": "required|string",
            "type": "required|string",
            "size": "required|integer",
            "color": "required|string",
            "quantity": "required|string",
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try{
		newObject = {
		    name: req.body.name,
		    type: req.body.type,
		    size: req.body.size,
		    quantity: req.body.quantity,
		    color: req.body.color
		}
		if(req.body.images && req.body.images.length > 0){
		    newObject = {
		        ...newObject,
		        images:req.body.images
		    }
		}
            const data = await Products.updateOne({_id:req.params.id},{$set:newObject});
            
            //const _data = await data.save()
            const data_ = await Products.findById(req.params.id) 
            res.status(200).send({ message: "Product Updated Successfully", data: data_['_doc'] });
        }catch(err){
            res.send('Error')
        }
    },

    async addProductImage(req, res){

        const validationRule = {
            "image": "required|string",
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try{
            const data = await Products.updateOne({_id:req.params.id},{$addToSet:{images:req.body.image}})
            res.status(200).send({ message: "Product Image Added Successfully"});
        }catch(err){
            res.send('Error')
        }
    },

    async removeProductImage(req, res){
        const validationRule = {
            "image": "required|string",
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });
        try{
            const data = await Products.updateOne({_id:req.params.id},{$pull:{images:req.body.image}})
            res.status(200).send({ message: "Product Image Removed Successfully"});
        }catch(err){
            res.send('Error')
        }
    },

    async remove(req, res){
        try{
            await Products.deleteOne({_id:req.params.id})
            res.status(200).send({ message: "Product Removed Successfully", data: req.params.id }); 
        }catch(err){
        	console.log("err",err)
            res.send('Error')
        }
    }
};

module.exports = ProductController;
