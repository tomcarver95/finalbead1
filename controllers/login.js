
var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('login/index', {
        errorMessages: req.flash('error')
    });
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/errors/list',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Hiányzó adatok'
}));

router.get('/signup', function (req, res) {
    res.render('login/signup', {
        errorMessages: req.flash('error')
    });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect:    '/login',
    failureRedirect:    '/login/signup',
    failureFlash:       true,
    badRequestMessage:  'Hiányzó adatok'
}));

module.exports = router;

