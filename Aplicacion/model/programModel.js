const mongoose = require('mongoose')
const Schema = mongoose.Schema

const programSchema = new Schema ({
    name: String,
    description: String,
    users:[{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    quiz:[{
        type: Schema.Types.ObjectId,
        ref: 'quiz'
    }]
})

const Program = mongoose.model('program',programSchema)
module.exports = Program