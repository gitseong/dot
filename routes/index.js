const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.render('index', {title : 'hello node.js world'});
});

module.exports = router;