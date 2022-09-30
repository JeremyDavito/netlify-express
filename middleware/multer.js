const multer = require('multer');

    //TODO ATTENTION TOUJOURS ENVOYER LE FILE EN DERNIER DANS LA REQUETE POUR RECUPERER LES INFO DU BODYYYYYYYYYYYY

module.exports.fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        /* console.log(req.body.userId)  */
        cb(null, `${__dirname}/../client/public/uploads/profil/`)
    },
    filename: (req, file, cb) => {
       /*  console.log(req.body) 
        console.log(file)  */

        const fileName = file.originalname;

        cb(null, /* fileName  */ `${req.body.userId}-${fileName}`)
    }

});  

module.exports.fileStorageEnginePost = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../client/public/uploads/posts/`)
        
    },
    filename: (req, file, cb) => {

        const fileName = file.originalname ;
        //console.log(req.body);

        cb(null, `${req.body.posterId}-${fileName}`)
    }
 
});



module.exports.limitOption = {
    fields: 5,
    fieldNameSize: 30,
    fieldSize: 400,
    fileSize: 2500000,
}


module.exports.fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
        console.log('OKAYYYY')
       
    } else {
        cb('Type de fichier incorrect ') //CALLBACK
    }
}