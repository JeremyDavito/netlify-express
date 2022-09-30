const router = require("express").Router();
const Conversation = require("../models/conversationModel");
const conversationController = require('../controllers/conversationController');


//new conv

router.post("/", conversationController.createNewConversation );


router.get('/:userId', conversationController.getConversationbyUser);

router.get('/find/:convId', conversationController.getConversationInfo);
 

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


module.exports = router;
