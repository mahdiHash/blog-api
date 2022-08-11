const router = require('express').Router();

router.post('/like/comment/:id', require('../controllers/like-dislike/likeComment'));

router.post('/like/post/:id', require('../controllers/like-dislike/likePost'));

router.post('/dislike/comment/:id', require('../controllers/like-dislike/dislikeComment'));

router.post('/dislike/post/:id', require('../controllers/like-dislike/dislikePost'));

module.exports = router;
