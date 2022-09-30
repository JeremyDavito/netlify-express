const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');

const postSchema = new mongoose.Schema({
    posterId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        trim: true,
        maxLenght: 500,
    },
    picture: {
        type: String
    },
    video: {
        type: String
    },
    likers: {
        type: [String],
        required: true,
    },
    comments: {
        type: [
            {
                commenterId: String,
                commenterPseudo: String,
                text: String,
                timestamp: Number
            }
        ],
        required: true
    },

}
    , { timestamps: { createdAt: "created_at" } });

 
const postModel = mongoose.model("post", postSchema);

module.exports = postModel;