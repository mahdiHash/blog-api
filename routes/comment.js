const router = require('express').Router();

router.get('/:id', require('../controllers/comments/getComment'));

router.post('/create', require('../controllers/comments/createComment'));

router.put('/:id', require('../controllers/comments/editComment'));

router.delete('/:id', require('../controllers/comments/delComment'));

module.exports = router;
