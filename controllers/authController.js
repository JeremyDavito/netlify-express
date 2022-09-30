const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/errors.utils");
const nodemailer = require("nodemailer");
const { sendConfirmationEmail } = require("../config/nodemailer.config");



const maxAge = 2 * 24 * 60 * 60 * 1000;
const createToken = (id, isAdmin) => {
  return jwt.sign(
    { id, isAdmin },
    process.env.TOKEN_SECRET,
    {
      expiresIn: maxAge,
    },
    { algorithm: "HS256" }
  );
};

async function signUp(req, res) {

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let tokenValidation = '';
for (let i = 0; i < 25; i++) {
  tokenValidation += characters[Math.floor(Math.random() * characters.length )];
}

  const { pseudo, email, password } = req.body;
  console.log(req.query);
  try {
    const user = {
      pseudo,
      email,
      password,
      confirmationCode: tokenValidation,
    };
    const userData = new UserModel(user);
    await userData.save(() => {
      
        sendConfirmationEmail(
          user.pseudo,
          user.email,
          user.confirmationCode
    );
 });
     return res.status(201).json({
      text: "Créer avec succès, veuillez regarder votre email",
      user: userData._id,
    }); 

  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

 
  try {
    const user = await UserModel.login(email, password);
    if (user.status != "Active") {
      return res.status(401).send({
        message: "Pending Account. Please Verify Your Email!",
      });
    }
    const token = createToken(user._id, user.isAdmin);
    const { ...otherDetails } = user._doc;

    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({
      user: user._id,
      details: { ...otherDetails },
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(200).json({ errors });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};




exports.signUp = signUp;
