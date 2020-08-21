const express = require('express');
const authenticate = require('../authenticate');
const Favourites = require('../models/favourite');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { authorize } = require('passport');
const Dishes = require('../models/dishes');
const favRouter = new express.Router(); 
const cors = require('./cors');

favRouter.use(bodyParser.json());
favRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne({user:req.user._id})
    .populate('dishes')
    .populate('user')
    .then((favourite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourite);
    },(err)=>next(err))
    .catch((err)=>next(err));  
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne({user: req.user._id})
    .then((favourite)=>{
        if(favourite==null)
        {
            Favourites.create({user: req.user._id})
            .then((favourite)=>{
                for(var i = (req.body.length -1);i>=0;i--){

                        favourite.dishes.push(req.body[i]._id);
                }
                favourite.save()
                .then((favourite)=>{
                    Favourites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                },(err) => next(err));
                
            })
            .catch((err)=>next(err));
        }
        else{
            for(var i = (req.body.length -1);i>=0;i--)
            {
                if(favourite.dishes.indexOf(req.body[i]._id) ===-1)
                {
                    favourite.dishes.push(req.body[i]._id);
                }
            }
            favourite.save()
            .then((favourite)=>{
                Favourites.findById(favourite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            },(err)=>next(err));
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOneAndRemove({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favourites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!==null)
        {
            Favourites.findOne({user: req.user._id})
            .then((favourite)=>{
                if(favourite==null)
                {
                    Favourites.create({user: req.user._id,dishes:[req.params.dishId]})
                    .then((favorite)=>{ 
                        Favourites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    },(err)=>next(err));
                }
                else{
                    if(favourite.dishes.indexOf(req.params.dishId) ===-1)
                    {
                        favourite.dishes.push(req.params.dishId);
                    }
                    favourite.save()
                    .then((favorite)=>{
                        Favourites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    },(err)=>next(err));
                }
            })
        }
        else{
            res.statusCode=404;
            err = new Error('Invalid Dish');
            return next(err);
        }
    })
    .catch((err)=>next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
   
    Favourites.findOne({user: req.user._id})
    .then((favourite)=>{
        if(favourite==null)
        {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
          
        }
        else{
            if(favourite.dishes.indexOf(req.params.dishId) !==-1)
            {
                favourite.dishes = favourite.dishes.filter((dishid) => dishid.toString() !== req.params.dishId);
            }
            favourite.save()
            .then((favorite)=>{
                Favourites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            },(err)=>next(err));
        }
    })

    .catch((err)=>next(err));
});

module.exports = favRouter;
