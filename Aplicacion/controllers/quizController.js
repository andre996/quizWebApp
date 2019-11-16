const Quiz = require('../model/quizModel')
const QuizCopy = require('../model/quizCopyModel')
const User = require('../model/userModel')
const Program = require('../model/programModel')
const mongoose = require('mongoose')


module.exports = {
  index: async (req, res, next) => {
    try {
      const { programid, quizid } = req.params;
      console.log(programid);
      console.log(quizid);
      const quizs = await Quiz.find({ _id: quizid });
      res.status(201).json(quizs);
    } catch (err) {
      next(err);
    }
  },

  newQuiz: async (req, res, next) => {
    try {
      let quizReq = JSON.parse(JSON.stringify(req.body));
      const newQuiz = new Quiz(req.body);
      const quiz = await newQuiz.save();
      const { programid } = req.params;
      const listQuizCopies = [];
      try {
        //add new quiz to the program
        const programData = await Program.findById(programid);
        programData.quiz.push(quiz._id);
        try {
          await Program.findByIdAndUpdate(programid, programData);
        } catch (err) {
          next(err);
        }//try

                //Delete Answers
                quizReq.questions.map(async (question) => { 
                    question.answers.map(async (answer) => {
                        answer.bool = false
                     } )
                } )//map

        quizReq.quiz = quiz._id;
        //Create a exam copy for each student
        await Promise.all(
          programData.users.map(async student => {
                    //Add field to de new copy
                    quizReq.student = student
                    
                    //Create new model
                    const newQuizCopy = new QuizCopy(quizReq)
                    
                    //Add the model to db and push id to copies exames list
                    try{
                        const quizCopy = await newQuizCopy.save()
                        listQuizCopies.push(quizCopy._id)
                    }catch (err) {
                        next(err)
                    }
                }))
        res.status(200).json(quizReq)
        }catch (err) {
            next(err);
          }//try
    }catch (err) {
        next(err);
      }},//try

    deleteQuiz: async (req,res,next) => {
        try{
            const { quizid } = req.params

                //get quiz data
                try{
                    const quizData = await Quiz.findById(quizid)

                    //get program data
                    try{
                        const programData = await Program.findById(quizData.program)

                        //delete quiz from program
                        const index = programData.quiz.indexOf(quizid)
                        programData.quiz.splice(index,1)
                        try{
                            await Program.findByIdAndUpdate(programData._id,programData)
                        }catch (err) {
                            next(err)
                        }

                        //pass thorgh all students
                        await Promise.all(programData.users.map(async student => {

                            try{
                                //get student info
                                let studentData = await User.findById(student)
                                //Find student's statictis obj in the students grade array 
                                const obj = studentData.grades.find(x => x.quiz == quizid);
                                console.log(obj)
                                //Get obj index
                                const indexGrade = studentData.grades.indexOf(obj)

                                //change student data
                                if(indexGrade!=-1){
                                    //delete from grades
                                    console.log("in")
                                    studentData.grades.splice(indexGrade,1)
                                }

                                //Updating quiz data
                                try{
                                    await User.findByIdAndUpdate(student,studentData)
                                }catch (err) {
                                    next(err)
                                }
                            
                            }catch(err){
                            next(err)
                            }

                        }))

                    }catch(err){
                        next(err)
                    }

                    //Delete quiz copies
                    await QuizCopy.deleteMany({quiz:quizid})
        
                    //Delete quiz
                    try{
                        await Quiz.findByIdAndDelete(quizid)
                        res.status(200).json({
                            message:'Quiz eliminado'
                        })
                    }catch(err){
                        next(err)
                    }

                }catch (err) {
                    next(err)
                }
            
            }catch (err) {
                next(err)
            }
    },

  quizzesProgram: async (req, res, next) => {
    try {
      const program = req.body;
      const quizzes = await Quiz.find({program:program.id})
      res.status(200).json(quizzes)
    } catch (err) {
      next(err);
    }
  }
}
