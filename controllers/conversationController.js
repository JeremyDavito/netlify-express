const conversationModel = require('../models/conversationModel');
const ObjectID = require('mongoose').Types.ObjectId;





  


//new conv


module.exports.createNewConversation = async (req,res) => {


     const newConversation = await new conversationModel({
        members: [req.body.senderId, req.body.receiverId],
      });
 
      newConversation.save()
    .then((docs) => res.send(docs),

    )
    .catch((err) => res.status(500).send({ message: err })) 


};


  //get conv of a user

  module.exports.getConversationbyUser = (req, res) => {

    conversationModel.find( 
      { members: { $in: [req.params.userId]}}).sort({ created_at: -1 })
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
      
  
  };
  
  
  module.exports.getConversationInfo = (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.convId))
    return res.status(400).send('ID unknow : '+ req.params.convId);
    
    conversationModel.findById(req.params.convId, (err, docs) => {
    if (!err) res.send(docs);
    else console.log('ID unknow : ' + err);
    })
    }
  

 
/* 

  router.get('/:userId', async (req, res) => {
    
    try {
      const conversation = await Conversation.find(
         { members: { $in: [req.params.userId] },
      } );
      res.status(200).json(conversation);
      console.log(res.data);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // get conv includes two userId
  
  router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation)
    } catch (err) {
      res.status(500).json(err);
    }
  });
   */