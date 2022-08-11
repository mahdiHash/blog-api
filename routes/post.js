const router = require('express').Router();

router.get('/', require('../controllers/posts/getAllPosts'));

router.get('/exists/:title', require('../controllers/posts/doesExist'));

router.get('/:title', require('../controllers/posts/getPost'));

router.delete('/:id', require('../controllers/posts/delPost'));

router.put('/:id', require('../controllers/posts/updatePost'));

router.post('/create', require('../controllers/posts/createPost'));

module.exports = router;
