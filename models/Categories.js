const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    type:{
        type:Number,
        enum:[0,1,2,3,4,5]
    }
}, { timestamps: true });

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = { Categories };
