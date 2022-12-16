var fs = require('fs-extra'); 
const path = require('path');
const HomeController = {
    async fileUpload(req, res){
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            let fileName = Math.random().toString(36).substring(7)+filename.replace(/ /g,"_");
            let imagePath = path.join('./','public/')+fileName;
            fstream = fs.createWriteStream(imagePath);
            file.pipe(fstream);
            fstream.on('close', function () {
                res.json({message:"file uploaded successfully",data:`file/${fileName}`})
            });
        });
    },

    async fileRetrive(req, res){
        try{            
            const filePath =  path.join(__dirname,'../public/',req.params.filename)
            fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
                if (!err) {
                    res.sendFile(filePath);
                } else {
                    console.log(err);
                }
            });
        }catch(err){
            res.send('Error ' + err)
        }
    }
};

module.exports = HomeController;