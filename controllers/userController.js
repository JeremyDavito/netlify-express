const UserModel = require('../models/userModel');
const ObjectID = require('mongoose').Types.ObjectId;



module.exports.getAllUsers = async (req, res) =>{
const users = await UserModel.find().select('-password'); //Cache MDP dans la requete pr le protéger, ont peut rajouter d'autre choses.
res.status(200).json(users);

};

module.exports.userInfo = (req, res) => {
console.log(req.params);
if (!ObjectID.isValid(req.params.id))
return res.status(400).send('ID unknow : '+ req.params.id);

UserModel.findById(req.params.id, (err, docs) => {
if (!err) res.send(docs);
else console.log('ID unknow : ' + err);
}).select('-password');
}



module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
    try {
      await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            bio: req.body.bio,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }, // A RAJOUTER QUAND PATCH §§
        (err, docs) => {
          if (!err) return res.send(docs);
          if (err) return res.status(500).send({ message: err });
        }
      );
    } catch (err) {
        //PROBLEME ENVOI ERREUR AU CATCH 
        //"Cannot set headers after they are sent to the client in JS"
        //return res.status(500).send(err);
        //console.log(err)
    }
  };

  module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
    try {
        await UserModel.deleteOne({_id: req.params.id}).exec();
        res.status(200).send({ message: 'Successfully deleted' });
    }
    catch (err){
        return res.status(500).json({ message: err });
    }
  }

  module.exports.follow = async (req, res) => {
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.body.idToFollow)
    )
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      // add to the follower list
      await UserModel.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { following: req.body.idToFollow } },
        { new: true, upsert: true },
      //POUR RAISON INCONNUE NE FONCTIONNE PAS SI JE MET LES ERREURS ICI, CA ARRETE LA FONCTION AU MILLIEU
        /* (err, docs) => {
          if (!err) res.status(201).json(docs);
          else return res.status(400).json(err);
        } */
      ); 
      // add to following list
       await UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        { $addToSet: { followers: req.params.id } },
        { new: true, upsert: true },
        (err, docs) => {
           if (!err) res.status(201).json(docs);
          if (err) return res.status(400).json(err);
        }
      );
    } catch (err) {
      /* return res.status(500).json({ message: err }); */
    }
  };
  
  module.exports.unfollow = async (req, res) => {
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.body.idToUnFollow)
    )
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      await UserModel.findByIdAndUpdate(
        req.params.id,
        { $pull: { following: req.body.idToUnFollow } },
        { new: true, upsert: true },
        /* (err, docs) => {
          if (!err) res.status(201).json(docs);
          else return res.status(400).json(err);
        } */
      );
      // remove to following list
      await UserModel.findByIdAndUpdate(
        req.body.idToUnFollow,
        { $pull: { followers: req.params.id } },
        { new: true, upsert: true },
        (err, docs) => {
          if (!err) res.status(201).json(docs);
          if (err) return res.status(400).json(err);
        }
      );
    } catch (err) {
     /*  return res.status(500).json({ message: err }); */
    }
  };

  module.exports.verifyUser = (req, res, next) => {
   
    UserModel.findOneAndUpdate(
   { confirmationCode: req.params.confirmationCode},
       {
        $set: 
           {
            status: "Active",
        } 
    },
    { new: true, upsert: true}, 
    )
    .then((err)=>{
      console.log(err)
       res.redirect('http://localhost:4000/'); 
      if (!err) {
        res.status(201).json(docs)
        res.redirect('http://localhost:4000/');
      }
    })
    .catch((err) =>{
     res.redirect('http://localhost:4000/');
     res.status(500).send({ message: "Utilisateur n'éxiste pas ou l'adresse est incorrect" })});
    
  };
  