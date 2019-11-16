const express = require('express')
const router = express.Router()
const programController = require('../controllers/programController')
const quizController = require('../controllers/quizController')


router.route('/')
    .get(programController.index)
    .post(programController.newProgram)

router.route('/dashboard')
    .get(programController.dashboard)

router.route('/:programid')
    .get(programController.getProgram)
    .put(programController.updateProgram)
    .delete(programController.deleteProgram)

router.route('/quiz/:programid')
     .get(quizController.index)
     .post(quizController.newQuiz)

module.exports=router;