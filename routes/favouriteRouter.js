const express = require('express');
const authenticate = require('../authenticate');
const Favourites = require('../models/favourite');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { authorize } = require('passport');
const Dishes = require('../models/dishes');
const favRouter = new express.Router(); 

favRouter.use(bodyParser.json());
favRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne({userId:req.user._id})
    .populate('dishes')
    .populate('userId')
    .then((favourite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourite);
    },(err)=>next(err))
    .catch((err)=>next(err));  
})

.post(authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne({userId: req.user._id})
    .then((favourite)=>{
        if(favourite==null)
        {
            Favourites.create({userId: req.user._id})
            .then((favourite)=>{
                for(var i = (req.body.length -1);i>=0;i--){

                        favourite.dishes.push(req.body[i]._id);
                }
                favourite.save()
                .then((favourrite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                },(err) => next(err));
                
            },(err)=>next(err));
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
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            },(err)=>next(err));
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOneAndRemove({userId: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favRouter.route('/:dishId')
.post(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!==null)
        {
            Favourites.findOne({userId: req.user._id})
            .then((favourite)=>{
                if(favourite==null)
                {
                    Favourites.create({userId: req.user._id,dishes:[req.params.dishId]})
                    .then((favourite)=>{ 
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    },(err)=>next(err));
                }
                else{
                    if(favourite.dishes.indexOf(req.params.dishId) ===-1)
                    {
                        favourite.dishes.push(req.params.dishId);
                    }
                    favourite.save()
                    .then((favourite)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
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

.delete(authenticate.verifyUser, (req,res,next)=>{
   
    Favourites.findOne({userId: req.user._id})
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
            .then((favourite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            },(err)=>next(err));
        }
    })

    .catch((err)=>next(err));
});

module.exports = favRouter;
