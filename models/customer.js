const  mongoose  = require("mongoose");
const customer  =  new  mongoose.Schema ({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },  
    address:{
        type:String,
        required:false,
    },
    point:{
        type:Number,
        required:true,
    }
});
module.exports = mongoose.model("customer",customer);
