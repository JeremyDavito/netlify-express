const router = require('express').Router();
const groupPostController = require('../controllers/groupPostController');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const { fileStorageEnginePost, fileFilter, limitOption } = require('../middleware/multer');
const upload = multer({ storage: fileStorageEnginePost, limits: limitOption, fileFilter: fileFilter })

//GROUPS
router.get('/get', groupPostController.getAllGroup);
router.get('/get/:id', groupPostController.groupInfo);
router.post('/creation', groupPostController.createGroup);
router.patch('/join/:id', groupPostController.joinGroup);
router.patch('/request-join/:id', groupPostController.pendingRequestGroup);
router.patch('/leave/:id', groupPostController.leaveGroup);

//Posts
router.get('/', groupPostController.readAllGroupPost);
router.get('/posts/:id', groupPostController.readGroupPost);

router.post('/:id', upload.single('file'), groupPostController.createGroupPost);
router.put('/:id', groupPostController.updateGroupPost);
router.delete('/:id', groupPostController.deleteGroupPost);
//Like
router.patch('/group-like-post/:id', groupPostController.likeGroupPost);
router.patch('/group-unlike-post/:id', groupPostController.unLikeGroupPost);
//Comments
router.patch('/group-comment-post/:id',groupPostController.commentGroupPost);
router.patch('/group-comment-edit/:id',groupPostController.editCommentGroupPost);  
router.patch('/group-delete-comment-post/:id',groupPostController.deleteCommentGroupPost);



module.exports= router;