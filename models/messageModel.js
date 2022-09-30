const mongoose = require("mongoose");
const bcrypt = require('bcrypt'); 

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

/* 
messageSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.text = await bcrypt.hash(this.text, salt);
  next();
}); */

module.exports = mongoose.model("Message", messageSchema);
