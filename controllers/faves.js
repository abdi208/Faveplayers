const express = require('express');
const axios = require('axios'); 
const router = express.Router();

router.get('/', function(req, res) {
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
            res.render('results',{ results: response.data.data })
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
            res.render('detail',{ player: foundPlayer.data})
        }).catch((error)=>{
            console.log(error)
            })
})
module.exports = router