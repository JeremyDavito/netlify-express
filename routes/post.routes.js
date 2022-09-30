const router = require('express').Router();
const postController = require('../controllers/postController');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const { fileStorageEnginePost, fileFilter, limitOption } = require('../middleware/multer');
const upload = multer({ storage: fileStorageEnginePost, limits: limitOption, fileFilter: fileFilter })


router.get('/', postController.readPost);
router.post('/', upload.single('file'), postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
//Like
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unLikePost);
//Comments

router.patch('/comment-post/:id',postController.commentPost);
router.patch('/comment-edit/:id',postController.editCommentPost);  
router.patch('/delete-comment-post/:id',postController.deleteCommentPost);



module.exports= router;