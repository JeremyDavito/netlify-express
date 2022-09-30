const userModel = require('../models/userModel.js');
/* const fs = require('fs'); */
/* const { promisify } = require('util'); */
/* const { uploadErrors } = require('../utils/errors.utils.js'); */
/* const pipeline = promisify(require('stream').pipeline);
const multer = require('multer'); */

module.exports.uploadProfil = async (req, res) => {
    /*     console.log(req) */
    /* const fileName = req.file.originalname; */
    /* console.log(req.file) */
    const fileName = req.file.originalname;
    //TODO ATTENTION TOUJOURS ENVOYER LE FILE EN DERNIER DANS LA REQUETE POUR RECUPERER LES INFO DU BODYYYYYYYYYYYY
    //thanks, learned one more crutial thing: "attach media files in last of the req content"
    /* + fileName */

    await userModel.findByIdAndUpdate(

        req.body.userId,

        { $set: { picture: "./uploads/profil/" + `${req.body.userId}-${fileName}` } },
        { new: true, upsert: true, setDefaultsOnInsert: true },


    ).then((docs) => res.send(docs))
        .catch((err) => res.status(500).send(err));


};
