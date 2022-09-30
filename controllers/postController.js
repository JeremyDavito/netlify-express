const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require('fs');



module.exports.readPost = (req, res) => {

    postModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('error to get data : ' + err);
    }).sort({ created_at: -1 });//Prends commentaires du plus récent au plus ancien.


};



module.exports.createPost = async (req, res) => { 

   

     const newPost = await new postModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: [],
        picture: req.file != null ? "./uploads/posts/" +`${req.body.posterId}-${req.file.originalname}` : ""
    }); 
 
    newPost.save()
    .then((docs) => res.send(docs),

    )
    .catch((err) => res.status(500).send({ message: err })) 

};



module.exports.updatePost = (req, res) => {
    //console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknow : ' + req.params.id);

    const updateRecord = {
        message: req.body.message,
    }

    postModel.findByIdAndUpdate(
        req.params.id,
        { $set: updateRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error: " + err);
        }
    )

};



module.exports.deletePost = (req, res) => {
   
    postModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log('Error while delete post : ' + err);
        }
    )

};

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id },
            },
            { new: true },
            /*  (err, docs) => {
               if (err) return res.status(400).send(err);
             } */
        ).then((docs) => res.send(docs))
            .catch((err) => res.status(500).send({ message: err }));;
        await userModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id },
            },
            { new: true },
            /* (err, docs) => {
              if (!err) res.send(docs);
              else return res.status(400).send(err);
            } */
        ).then((docs) => res.send(docs))
            .catch((err) => res.status(500).send({ message: err }));;
    } catch (err) {
        /* res.status(400).send(err);  */
    }
};


module.exports.unLikePost = async (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true },

            /*   (err, docs) => {
                  if (err) return res.status(400).send(err);
              } */
        )
            .then((docs) => res.send(docs))
            .catch((err) => res.status(500).send({ message: err }));

        await postModel(
            req.body.id,
            {
                $pull: { likes: req.params.id }
            },
            { new: true },
            //NEW MONGODB VERSION, USE .THEN INSTEAD OF CALLBACK
            //https://stackoverflow.com/questions/69090486/nodejs-express-mongodb-err-http-headers-sent
            /*  (err, docs) =>{
                 if (!err) res.send(docs);
                 else return res.status(400).send(err);
             } */

        )
            .then((docs) => res.send(docs))
            .catch((err) => res.status(500).send(err));
    }
    catch (err) {
        /*  return res.status(400).send(err); */
    }

};


module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return postModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true },
            /* (err, docs) => {
              if (!err) return res.send(docs);
              else return res.status(400).send(err);
            } */

        ).then((docs) => res.send(docs))
            .catch((err) => res.status(500).send(err));
    } catch (err) {
        /*  return res.status(400).send(err); */
    }
};

module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
    /* console.log(req.params.id); */

      postModel.findByIdAndUpdate(
        req.params.id,
        /* { $set: updateRecord },*/
        { insert: true }, 
        (err, docs) => { 
            console.log(req.body);
            console.log(docs.comments);
         const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)); 
        if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;
        console.log(theComment);
        docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err); 
    }  
         
 
    )
  }
      )}
    
/* 
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
       return postModel.findById(req.params.id, (err, docs) => {
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body._id)
        ) .then((docs) => res.send(docs)) 
         .catch((err) => res.status(500).send(err)); 
  
        if (!theComment) return res.status(404).send("Comment not found");
        theComment.text = req.body.text;
  
        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err);
        })/* .then((docs) => res.send(docs))
        .catch((err) => res.status(500).send(err));  
      });
     */
 



module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    postModel.findByIdAndUpdate(
        req.params.id,
        {
            $pull: {
                comments: {
                    _id: req.body.commentId,
                },
            },
        },
        { new: true }
    ).then((docs) => res.send(docs))
        .catch((err) => res.status(500).send(err));

};
