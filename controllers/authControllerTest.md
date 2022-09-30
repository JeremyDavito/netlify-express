const UserT = require("../models/userModelTest.js");
 const passwordHash = require("password-hash");
 
async function signup(req, res) {
  console.log (req.query);
  
  const { pseudo, password, email } = req.body;
  if (!email || !password || !pseudo) {
    //Le cas où l'email ou bien le password ne serait pas soumit ou nul
    return res.status(400).json({
      text: "Requête invalide MERDE",
    });
  }
  // Création d'un objet user, dans lequel on hash le mot de passe
  const user = {
    pseudo,
    email,
    password : passwordHash.generate(password) 
  };
  // On check en base si l'utilisateur existe déjà
  try {
    const findUser = await UserT.findOne({
      email
    });
    if (findUser) {
      return res.status(400).json({
        text: "L'utilisateur existe déjà"
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
  try {
    // Sauvegarde de l'utilisateur en base
    const userData = new UserT(user);
    await userData.save();
    return res.status(201).json({
      text: "Créer avec succès",
      user: userData._id,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}



exports.signup = signup;