const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');

const groupSchema = new mongoose.Schema({ 
    groupCreatorId: {
        type: String,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    bio:{
        type: String,
        required: true
    },
    groupMembers: {
        type: [String]
      },
    pendingMembers:{
        type: [String]
    },
    groupPosts: {
        type: [String]
      },

}
    , { timestamps: { createdAt: "created_at" } });

 
const groupModel = mongoose.model("group", groupSchema);

module.exports = groupModel;