const mongoose = require('mongoose');
 const { isEmail } = require('validator'); 
 const bcrypt = require('bcrypt'); 
/* const { boolean } = require('webidl-conversions'); */


const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      validate: [isEmail],
      trim: true,
      unique: true,
      required: true 
    },
    password: {
      type: String,
      required: true 
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio :{
      type: String,
      max: 1024,
    },
    followers: {
      type: [String]
    },
    following: {
      type: [String]
    },
    likes: {
      type: [String]
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    groups: {
      type: [String]
    },
    groupsRequest: {
      type: [String]
    },
    status: {
      type: String, 
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    confirmationCode: { 
      type: String, 
      unique: true },
  },
  { timestamps: { createdAt: "created_at" } } 
);


 

// play function before save into display: 'block',
userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};
 
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;