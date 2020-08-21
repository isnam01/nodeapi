var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var feedbackSchema = new Schema({  
    firstname: {
        type: String,
          default: ''
      },
      lastname: {
        type: String,
          default: ''
      },
     telnum:{
         type:Number,
         default:''
     },
     email:{
         type:String,
         required:true
     },
     agree:{
         type:String,
         default:false
     },
     contactType:{
         type:String,
     },
     message:{
         type:String,
        default:''
     },

},{
    timestamps: true
});

var Feedback = mongoose.model('Feedback',feedbackSchema);

module.exports = Feedback; 

