var express = require('express');

var router = express.Router();

var statusTexts = {
    'not-done': 'Folyamatban',
    'done': 'Elvégezve'
};
var statusClasses = {
    'not-done': 'warning',
    'done': 'success'
};
function decorateErrors(errorContainer) {
    return errorContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

router.get('/list', function (req, res) {
    req.app.models.error.find().then(function (errors) {
        console.log(errors);

        res.render('errors/list', {
            errors: decorateErrors(errors),
            messages: req.flash('info')
        });
    });
});
router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('errors/new', {
        validationErrors: validationErrors,
        data: data,
    });
});

router.get('/edit/:id', function(req, res){
    req.app.models.error.findOne({id: req.params.id}).exec(function (err, data) {
        console.log('Editing', data);
        res.render('errors/edit', {
            data: data
        });
    });
});
router.post('/edit/:id', function(req, res){
    console.log('b4 edit', req.body);
    req.app.models.error.update({id: req.params.id}, {description:req.body.leiras, status: req.body.statusz}).exec(function (err, data) {
        console.log('updated', data[0]);
        res.redirect('/errors/list');
    });
});
router.get('/delete/:id', function(req, res){
    var id = parseInt(req.params.id);
    req.app.models.error.destroy({id: id}).then(function (data) {
        res.redirect('/errors/list');
    });
});
router.post('/new', function (req, res) {
    req.checkBody('leiras', 'Invalid description!').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    console.log(req.body);
    
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/errors/new');
    }
    else {

        req.app.models.error.create({
            status: 'not-done',
            description: req.body.leiras,
            location: function() 
                {
                    if(req.body.location){
                        return req.body.location;
                    } else {
                        return '';
                    }
                }
        })
        .then(function (error) {
            req.flash('info', 'A tárgy sikeresen felvéve!');
            res.redirect('/errors/list');
        })
        .catch(function (err) {
            console.log(err);
        });
    }
});

module.exports = router;