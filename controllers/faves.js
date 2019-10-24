const express = require('express');
const axios = require('axios'); 
const router = express.Router();
const db = require('../models')


router.get('/', function(req, res) {
    res.render('faves/home')
})
router.get('/:id/edit', function(req, res) {
    db.fave.findByPk(parseInt(req.params.id)).then(function(fave){
        res.render('faves/edit', {fave})
    })
})
router.get('/results', function(req, res) {
    axios({
        "method":"GET",
        "url":"https://free-nba.p.rapidapi.com/players",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"free-nba.p.rapidapi.com",
        "x-rapidapi-key":"342cd67e85mshfcdbe6893c84892p1e019cjsnb86513099f01"
        },"params":{
        "search": req.query.search
        }
    })
        .then((response)=>{
            
            console.log(response.data.data)
            res.render('faves/results',{ results: response.data.data })
        })
        .catch((error)=>{
        console.log(error)
        })
})

router.get('/:id', function(req, res) {
    var id = parseInt(req.params.id)
    axios({
        "method":"GET",
        "url":`https://free-nba.p.rapidapi.com/players/${id}`,
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"free-nba.p.rapidapi.com",
        "x-rapidapi-key":"342cd67e85mshfcdbe6893c84892p1e019cjsnb86513099f01"
        }
        }).then(function(foundPlayer) {
            console.log(id)
            console.log(foundPlayer.data)
            res.render('faves/details',{ player: foundPlayer.data})
        }).catch((error)=>{
            console.log(error)
            })
})

router.post('/', function(req, res) {
    db.fave.findOrCreate({
        where: {
            firstname: req.body.firstname,
            userId: req.user.id
        },defaults: {
            lastname: req.body.lastname,
            playerId: req.body.playerId
            
        }
    }).then(function([fave, created]) {
        console.log(`${fave.name} is ${created ? 'is created': 'in existance'}`)
        res.redirect('/profile')
    }).catch((error)=>{
        console.log(error)
        })
})

router.put('/:id', function(req, res) {
    db.fave.update({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    userId: parseInt(req.body.userId)
    }, {
    where: { id:  parseInt(req.params.id)}
    }).then(function(fave) {
    res.redirect('/profile')
    }).catch((error) =>{
        console.log(error)
    })
}); 

module.exports = router