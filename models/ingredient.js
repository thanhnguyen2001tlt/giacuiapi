const  mongoose  = require("mongoose");
const ingredient  =  new  mongoose.Schema ({
    name:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    unitPrice:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    prepaid:{
        type:Number,
        required:true
    },
    remaining:{
        type:Number,
        required:true
    }
});
module.exports = mongoose.model("ingredient",ingredient);
