const router = require('express').Router();

router.post('/upload', require('../controllers/img/uploadImg'));

router.get('/:imgName', require('../controllers/img/getImg'));

router.get('/isAccessible/:imgName', require('../controllers/img/isAccessible'));

router.delete('/:imgName', require('../controllers/img/delImg'));

module.exports = router;
