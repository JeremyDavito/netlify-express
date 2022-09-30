const postModel = require("../models/postModel");
const groupPostModel = require("../models/groupPostModel");
const userModel = require("../models/userModel");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const groupModel = require("../models/groupModel");

//GROUP

module.exports.createGroup = async (req, res) => {
  const newGroup = await new groupModel({
    groupCreatorId: req.body.groupCreatorId,
    groupName: req.body.groupName,
    groupMembers: req.body.groupCreatorId,
    groupPosts: [],
    bio: req.body.bio,
  });

  newGroup
    .save()
    .then((docs) => {
      res.send(docs);
      try {
        console.log(docs._id);

        userModel
          .findByIdAndUpdate(
            req.body.groupCreatorId,
            {
              $push: { groups: docs._id },
            },
            { new: true, upsert: true }
          )
          .then((res) => {
            console.log(res);
          });
      } catch (err) {
        /* res.status(400).send(err);  */
      }
    })
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.getAllGroup = async (req, res) => {
  const groups = await groupModel.find();
  res.status(200).json(groups);
};

module.exports.groupInfo = (req, res) => {
  console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("group ID unknow : " + req.params.id);

  groupModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("group ID unknow : " + err);
  });
};

module.exports.readGroup = (req, res) => {
  groupModel
    .find((err, docs) => {
      if (!err) res.send(docs);
      else console.log("error to get data : " + err);
    })
    .sort({ created_at: -1 });
};

module.exports.pendingRequestGroup = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await groupModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { pendingMembers: req.body.id },
        },
        { new: true }
      )
      .then((docs) => {
        res.send(docs);
        try {
          console.log(docs._id);
          console.log(docs.groupId);
          userModel
            .findByIdAndUpdate(
              req.body.id,
              {
                $push: { groupsRequest: req.params.id },
              },
              { new: true, upsert: true }
            )
            .then((res) => {
              console.log(res);
            });
        } catch (err) {
          /* res.status(400).send(err);  */
        }
      })
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {}
};

module.exports.joinGroup = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await groupModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { groupMembers: req.body.id },
          $pull: { pendingMembers: req.body.id },
        },
        { new: true }
      )
      .then((docs) => {
        res.send(docs);
        try {
          console.log(docs._id);
          console.log(docs.groupId);
          userModel
            .findByIdAndUpdate(
              req.body.id,
              {
                $push: { groups: req.params.id },
                $pull: { groupsRequest: req.params.id },
              },
              { new: true, upsert: true }
            )
            .then((res) => {
              console.log(res);
            });
        } catch (err) {
          /* res.status(400).send(err);  */
        }
      })
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {}
};

module.exports.leaveGroup = async (req, res) => {
  console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

  try {
    await groupModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $pull: { groupMembers: req.body.id },
        },
        { new: true }
      )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {}
};

// GROUP POSTS

module.exports.readAllGroupPost = (req, res) => {
  groupPostModel
    .find((err, docs) => {
      if (!err) res.send(docs);
      else console.log("error to get data : " + err);
    })
    .sort({ created_at: -1 }); //Prends commentaires du plus récent au plus ancien.
}; // PEUT ETRE LES TRIER AVEC UN FILTER OU UN UN SORT §/§§§§§§§§§§§§§§§§§§§§§§  §§§§§§§§§§§§§§§§§§§§§§

module.exports.readGroupPost = (req, res) => {
  groupPostModel
    .find({ groupId: { $in: [req.params.id] } })
    .sort({ created_at: -1 })
    .then((docs) => res.send(docs))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.createGroupPost = async (req, res) => {
  const newGroupPost = await new groupPostModel({
    posterId: req.body.posterId,
    groupId: req.params.id,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
    picture:
      req.file != null
        ? "./uploads/posts/" + `${req.body.posterId}-${req.file.originalname}`
        : "",
  });

  newGroupPost
    .save()
    .then((docs) => {
      res.send(docs);
      try {
        console.log(docs._id);
        console.log(docs.groupId);

        groupModel
          .findByIdAndUpdate(
            docs.groupId,
            {
              $addToSet: { groupPosts: docs._id },
            },
            { new: true, upsert: true }
          )
          .then((res) => {
            console.log(res);
          });
      } catch (err) {
        /* res.status(400).send(err);  */
      }
    })
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.updateGroupPost = (req, res) => {
  //console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

  const updateRecord = {
    message: req.body.message,
  };

  groupPostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error: " + err);
    }
  );
};

module.exports.deleteGroupPost = (req, res) => {
  groupPostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) {
      res.send(docs);
      console.log(docs._id);
      console.log(docs.groupId);

      groupModel
        .findByIdAndUpdate(
          docs.groupId,
          {
            $pull: { groupPosts: docs._id },
          },
          { new: true, upsert: true }
        )
        .then((res) => {
          console.log(res);
        });
    } else {
      console.log("Error while delete post : " + err);
    }
  });
  /*    groupModel.findByIdAndUpdate(
        req.params.id,
        {
            $pull: { likers: req.body.id }
        },
        { new: true }, */
};

module.exports.likeGroupPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await groupPostModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true }
        /*  (err, docs) => {
               if (err) return res.status(400).send(err);
             } */
      )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
    await userModel
      .findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true }
        /* (err, docs) => {
              if (!err) res.send(docs);
              else return res.status(400).send(err);
            } */
      )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    /* res.status(400).send(err);  */
  }
};

module.exports.unLikeGroupPost = async (req, res) => {
  console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

  try {
    await groupPostModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true }

        /*   (err, docs) => {
                  if (err) return res.status(400).send(err);
              } */
      )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));

    await groupPostModel(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
      //NEW MONGODB VERSION, USE .THEN INSTEAD OF CALLBACK
      //https://stackoverflow.com/questions/69090486/nodejs-express-mongodb-err-http-headers-sent
      /*  (err, docs) =>{
                 if (!err) res.send(docs);
                 else return res.status(400).send(err);
             } */
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    /*  return res.status(400).send(err); */
  }
};

module.exports.commentGroupPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return groupPostModel
      .findByIdAndUpdate(
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
        { new: true }
        /* (err, docs) => {
              if (!err) return res.send(docs);
              else return res.status(400).send(err);
            } */
      )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    /*  return res.status(400).send(err); */
  }
};

/* module.exports.editCommentPost = (req, res) => {
     if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    postModel.findById(req.params.id, (docs) => {
        const theComment = docs.comments.find((comment) =>
            comment._id === (req.body.commentId)

            if {(!theComment) return res.status(404).send("Comment not found", err);
            theComment.text = req.body.text;}
            else docs.save((err) => {
            if (!err) return res.status(200).send(docs);
            return res.status(500).send(err);
        })
        .then((docs) => res.send(docs))
        .catch((err) => res.status(500).send(err))); 
}; */
module.exports.editCommentGroupPost = (req, res) => {
  /* //console.log(req); */ ///TODO PROBLEME CRASH EDIT COMMENTS /§§§

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  groupPostModel.findByIdAndUpdate(
    req.params.id,
    /* { $set: updateRecord },*/
    { insert: true },
    (err, docs) => {
      console.log(req.body);
      console.log(docs.comments);
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );
      if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;
      console.log(theComment);
      docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    }
  );
};

module.exports.deleteCommentGroupPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  groupPostModel
    .findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true }
    )
    .then((docs) => res.send(docs))
    .catch((err) => res.status(500).send(err));
};
