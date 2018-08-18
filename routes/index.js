const express = require('express');
const router = express.Router();

const placeDirectoryRouter = require('./place/index');

router.use('/place', placeDirectoryRouter);

router.get('/', (req, res, next)=>{
    res.render('index', {title : 'hello node.js world'});
});

module.exports = router;