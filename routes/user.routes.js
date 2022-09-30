const router = require('express').Router();
const authController = require('../controllers/authController');
/* const authControllerTest = require('../controllers/authControllerTest'); */
const userController = require('../controllers/userController');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const { fileStorageEngine, fileFilter, limitOption } = require('../middleware/multer');
const verifyAdmin = require('../utils/verifyToken');
/* const { verifyAdmin } = require('../utils/verifyToken'); */

/* router.get('/', (req, res) => {
  res.render('index', {
    title: 'My Blog',
    admin: req.user && req.user.isAdmin,
    isAdmin
  } */
const upload = multer({ storage: fileStorageEngine, limits: limitOption, fileFilter: fileFilter })


//Auth
router.post('/register', authController.signUp);
/* router.post('/registerTest', authControllerTest.signup); */
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);
router.get("/auth/confirm/:confirmationCode", userController.verifyUser)

//User DB
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser);
router.delete('/:id', verifyAdmin, userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

//Upload


router.post("/upload" , upload.single('file') , uploadController.uploadProfil);

module.exports = router;

/* 
//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
}); */