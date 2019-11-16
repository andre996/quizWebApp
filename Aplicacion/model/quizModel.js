const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSchema = new Schema ({
    title: String,
    program: {
        type: Schema.Types.ObjectId,
        ref: 'program'
    },
    quizCopies:[{
        type: Schema.Types.ObjectId,
        ref: 'quizCopy'
    }],
    questions: [{
        /*
        [{"tipo":0,
        "value":"¿Es usted guei?",
        "fieldsNumber":3,
        "answers":[{"label":"Si","bool":false},
            {"label":"No","bool":false},
            {"label":"Aveces","bool":true}]},
        {"tipo":1,
        "value":"¿Quienes de los siguientes pertenecen a tu ganado?",
        "fieldsNumber":3,
        "answers":[{"label":"Daniel","bool":true},
            {"label":"Jesús","bool":true},
            {"label":"Kinan","bool":true}]},
        {"tipo":2,
        "value":"¿Se meten todos con todos?",
        "fieldsNumber":0,
        "answers":[{"label":"Verdadero","bool":true},
            {"label":"Falso","bool":false}]}]
        */
    }], statistics:{
        totalStudents: Number,
        takenBy:{type: Number, default: 0},
        meanGrade: {type: Number, default: 0},
        studentsGrade:[]
    }
},{strict: false})

const Quiz = mongoose.model('quiz',quizSchema)
module.exports = Quiz

