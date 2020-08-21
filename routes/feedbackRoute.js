const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();
const authenticate = require('../authenticate');
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');
const cors = require('./cors');
const feedbackRoute = new express.Router();
feedbackRoute.use(bodyParser.json());

feedbackRoute.route('/')
.options(cors.corsWithOptions,authenticate.verifyadmin, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next)=>{
    Feedback.find(req.query)
    .then((feedback)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(cors.corsWithOptions,(req,res,next)=>{
    Feedback.create(req.body)
    .then((feedback)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.put(cors.corsWithOptions, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyadmin,(req,res,next)=>{
    Leaders.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = feedbackRoute;