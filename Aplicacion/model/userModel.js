const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    firstName:String, 
    lastName: String,
    email:  {type : String, unique : true, sparse : true},
    password: String,
    programs : [{
        type: Schema.Types.ObjectId,
        ref: 'program'
    }],
    admin: {type: Boolean, default: false},
    grades:[{}]
})

const User = mongoose.model("user", userSchema);
module.exports = User;
