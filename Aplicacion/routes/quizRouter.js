const express = require('express')
const router = express.Router()
const quizController = require('../controllers/quizController')


/*router.route('/')
    .get(quizController.index)
    .post(quizController.newQuiz)*/
router.route('/')
    .post(quizController.quizzesProgram)

router.route('/:quizid')
    .delete(quizController.deleteQuiz)

module.exports=router;