const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        productId:{
            type:String,
            required:true,
            unique:true
        },
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:String,
            required:true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        

    }
)

module.exports = mongoose.model('Product',productSchema);