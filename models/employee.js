const  mongoose  = require("mongoose");
const employee  =  new  mongoose.Schema ({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    cccd:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    }    
});
module.exports = mongoose.model("employee",employee);
