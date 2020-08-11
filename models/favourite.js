const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favouriteSchema = new Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        dishes: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }]
     },{
        timestamps: true
    }
);

var Favourites = mongoose.model('Favourite',favouriteSchema);
module.exports = Favourites;
