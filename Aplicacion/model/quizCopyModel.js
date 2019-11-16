const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizCopySchema = new Schema ({
    title: String,
    student: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    program: {
        type: Schema.Types.ObjectId,
        ref: 'program'
    },
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'quiz'
    },
    taken: {type: Boolean, default: false},
    grade: {type: Number, default: 0},
    questions: [{
        /*
        [{"type":0,
        "code":001,
        "value":"¿Es usted guei?",
        "fieldsNumber":3,
        "answers":[{"label":"Si","bool":false},
            {"label":"No","bool":false},
            {"label":"Aveces","bool":true}]},
        {"tipo":1,
        "code":002,
        "value":"¿Quienes de los siguientes pertenecen a tu ganado?",
        "fieldsNumber":3,
        "answers":[{"label":"Daniel","bool":true},
            {"label":"Jesús","bool":true},
            {"label":"Kinan","bool":true}]},
        {"tipo":2,
        "code":003,
        "value":"¿Se meten todos con todos?",
        "fieldsNumber":0,
        "answers":[{"label":"Verdadero","bool":true},
            {"label":"Falso","bool":false}]}]
        */
    }],
},{strict: false})

const QuizCopy = mongoose.model('quizCopy',quizCopySchema)
module.exports = QuizCopy