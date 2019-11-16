const Program = require("../model/programModel");
const User = require("../model/userModel");
const QuizCopy = require("../model/quizCopyModel");
const Quiz = require("../model/quizModel");
const utilitis = require("../utilities");
const mongoose = require("mongoose");
ObjectId = require("mongodb").ObjectID;

module.exports = {
  //Fine
  index: async (req, res, next) => {
    try {
      const programs = await Program.find({});
      res.status(200).json(programs);
    } catch (err) {
      next(err);
    }
  },

  //Fine
  newProgram: async (req, res, next) => {
    try {
      const newProgram = new Program(req.body);
      const program = await newProgram.save();
      await Promise.all(
        program.users.map(async student => {
          try {
            const studentData = await User.findById(student);
            studentData.programs.push(program._id);
            try {
              await User.findByIdAndUpdate(student, studentData);
            } catch (err) {
              next(err);
            }
          } catch (err) {
            next(err);
          }
        })
      );
      res.status(201).json(program);
    } catch (err) {
      next(err);
    }
  },

  dashboard: async (req, res, next) => {
    try {
      const programsList = await Program.find({}).populate("quiz");
      let totalQuizzesTaken = 0;
      const programsMeanGrades = [];

      programsList.map(program => {
        let numberQuizzes = program.quiz.length;
        if (numberQuizzes != 0 && numberQuizzes != null) {
          let sumMeanGrades = 0;
          program.quiz.map(quizOriginal => {
            totalQuizzesTaken += quizOriginal.statistics.takenBy;
            if (
              quizOriginal.statistics.meanGrade != 0 &&
              quizOriginal.statistics.meanGrade != null
            ) {
              sumMeanGrades += quizOriginal.statistics.meanGrade;
            } else if (numberQuizzes > 1) {
              numberQuizzes -= 1;
            }
            console.log("4");
          });
          console.log("5");
          programMeanGrade = sumMeanGrades / numberQuizzes;
        } else {
          programMeanGrade = 0;
        }

        programsMeanGrades.push({
          programName: program.name,
          programMeanGrade
        });
      });

      res.status(200).json({
        totalQuizzesTaken,
        programsMeanGrades
      });
    } catch (err) {
      next(err);
    }
  },

  //Fine
  /*getProgram:  async (req, res, next) =>{
        try{
            const { programid } = req.params
            const programData = await Program.findById(programid).populate({path:'quiz'})
            let program = JSON.parse(JSON.stringify(programData))
            listQuiz = []
            program.quiz.map( quiz => {
                delete quiz.questions
                delete quiz.quizCopies
                delete quiz.program
                delete quiz.__v
                listQuiz.push(quiz)
            })
            delete program.questions
            res.status(200).json({program
                ,listQuiz})
        } catch (err) {
            next(err)
        }
    }*/

  //Statistics
  getProgram: async (req, res, next) => {
    try {
      const { programid } = req.params;
      try {
        const programData = await Program.findById(programid);
        const quizzes = await Quiz.find({ program: programid });
        let listStatistics = [];
        let quizzesJSON = JSON.parse(JSON.stringify(quizzes));
        let numberTest = quizzesJSON.length;
        let meanGradeAdd = 0;
        let totalTestTaken = 0;
        const totalStudents = programData.users.length;
        let totalCopies = programData.users.length * numberTest;
        console.log("Copies", totalCopies);
        quizzesJSON.map(quiz => {
          totalTestTaken = totalTestTaken + parseFloat(quiz.statistics.takenBy);
          meanGradeAdd = meanGradeAdd + parseFloat(quiz.statistics.meanGrade);
          quiz.statistics.title = quiz.title;
          listStatistics.push(quiz.statistics);
        });
        console.log(totalTestTaken);
        console.log(parseInt(numberTest));
        totalTestTaken = parseFloat(
          ((totalTestTaken / totalCopies) * 100).toFixed(2)
        );
        meanGrade = meanGradeAdd / parseInt(numberTest);
        res.status(200).json({
          listStatistics,
          totalTestTaken,
          meanGrade,
          totalStudents
        });
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  },

  //Fine
  updateProgram: async (req, res, next) => {
    try {
      const { programid } = req.params;
      const updateProgram = req.body;
      const programData = await Program.findById(programid);
      const newUsersList = req.body.users;
      const oldUsersList = programData.users;
      const addUsers = utilitis.arrayDifferences(newUsersList, oldUsersList);
      const deleteUsers = utilitis.arrayDifferences(oldUsersList, newUsersList);

      /*updating User's programs (add)*/
      await Promise.all(
        addUsers.map(async student => {
          try {
            let studentData = await User.findById(JSON.parse(student));
            studentData.programs.push(programid);
            try {
              await User.findByIdAndUpdate(JSON.parse(student), studentData);
            } catch (err) {
              next(err);
            }

            //Get quizzes
            try {
              console.log("1");
              const programData1 = await Program.findById(programid).populate(
                "quiz"
              );
              console.log(programData.users.length);
              let quizzes = programData1.quiz;

              //pass trohgt all quizzes
              console.log("2");
              await Promise.all(
                quizzes.map(async quizModel => {
                    try{
                      const quizExist = QuizCopy.findOne({student:JSON.parse(student),quiz:quizModel})
                      console.log(quizExist)
                      console.log(typeof(quizExist))
                      console.log(quizExist.length)
                      if(quizExist.length==undefined){

                        console.log("3");
                        let quizOriginal = quizModel;
                        quizModel = JSON.parse(JSON.stringify(quizModel));
                        delete quizModel.statistics;
                        delete quizModel.quizCopies;
                        quizModel.quiz = quizModel._id;
                        delete quizModel._id;
                        delete quizModel.__v;
                        quizModel.student = JSON.parse(student);

                        /*console.log(quizModel)*/

                        //Delete Answers
                        console.log("4");
                        quizModel.questions.map(async question => {
                          question.answers.map(async answer => {
                            answer.bool = false;
                          });
                        });

                        //Create new model
                        console.log("5");
                        const newQuizCopy = new QuizCopy(quizModel);

                        //Add the model to db and push id to copies exames list
                        console.log("6");
                        try {
                          console.log("6.1");
                          const quizCopy = await newQuizCopy.save();
                          console.log("6.2");
                          quizOriginal.quizCopies.push(quizCopy._id);
                        } catch (err) {
                          next(err);
                        }

                        //add and update quizzes Copies to quiz Document
                        console.log("7");
                        quizOriginal.statistics.totalStudents =
                          parseInt(programData.users.length) + 1;
                        console.log("7.1");
                        try {
                          console.log("7.2");
                          console.log(typeof quizOriginal._id);
                          console.log(quizOriginal._id);
                          console.log(
                            typeof JSON.parse(JSON.stringify(quizOriginal._id))
                          );
                          console.log(JSON.parse(JSON.stringify(quizOriginal._id)));
                          console.log(quizOriginal);
                          await Quiz.findByIdAndUpdate(
                            JSON.parse(JSON.stringify(quizOriginal._id)),
                            JSON.parse(JSON.stringify(quizOriginal))
                          );
                          console.log("7.3");
                        } catch (err) {
                          next(err);
                        }}
                }catch(err){
                    next(err)
                }
                })
              );
            } catch (err) {
              next(err);
            }
          } catch (err) {
            next(err);
          }
        })
      );

      /*updating User's programs (delete)*/
      await Promise.all(
        deleteUsers.map(async student => {
          try {
            let studentData = await User.findById(JSON.parse(student));
            studentData = JSON.parse(JSON.stringify(studentData));
            let index = studentData.programs.indexOf(programid);
            console.log("Index: ", index);
            studentData.programs.splice(index, 1);

            //Delete program's grades from students statistics
            let indexGrade = 0;
            while (indexGrade != -1) {
              let obj = studentData.grades.find(x => x.program == programid);
              //Get obj index
              indexGrade = studentData.grades.indexOf(obj);
              console.log("Student grade index: ", indexGrade);
              //change student data
              if (indexGrade != -1) {
                //delete from grades
                console.log("in slice");
                studentData.grades.splice(indexGrade, 1);
              }
            }

            student = JSON.parse(student);

            try {
              console.log(150);
              await User.findByIdAndUpdate(student, studentData);
            } catch (err) {
              next(err);
            }

            await Promise.all(
              programData.quiz.map(async quizModel => {
                try {
                  await QuizCopy.deleteOne({
                    student: student,
                    quiz: quizModel
                  });
                  console.log("done");
                } catch (err) {
                  next(err);
                }
                try {
                  //Get the data of the quiz
                  console.log("done 1");
                  console.log(typeof quizModel);
                  let quizData = await Quiz.findById(quizModel);
                  console.log("done 2");
                  //Find student's statictis obj in the students grade array
                  let obj = quizData.statistics.studentsGrade.find(
                    x => x.id == student
                  );
                  //Get obj index
                  indexGrade = quizData.statistics.studentsGrade.indexOf(obj);
                  /*console.log("quiz index")
                         console.log(indexGrade)
                         console.log("Before")
                         console.log("students Grades:",quizData.statistics.studentsGrade)
                         console.log("takenBy:",quizData.statistics.takenBy)*/
                  //if student has taken the quiz get in
                  if (indexGrade != -1) {
                    //delete from statictis
                    quizData.statistics.studentsGrade.splice(indexGrade, 1);
                    quizData.statistics.takenBy -= 1;
                    quizData.statistics.totalStudents -= 1;
                    const add = (a, b) => a + b;
                    //Set mean grade
                    if (quizData.statistics.studentsGrade.length >= 2) {
                      quizData.statistics.meanGrade =
                        quizData.statistics.studentsGrade.reduce(add) /
                        quizData.statistics.takenBy;
                    } else if (quizData.statistics.studentsGrade.length == 1) {
                      quizData.statistics.meanGrade =
                        quizData.statistics.studentsGrade[0].grade;
                    } else {
                      quizData.statistics.meanGrade = 0;
                    }
                  }
                  /*console.log("After")
                         console.log("students Grades:",quizData.statistics.studentsGrade)
                         console.log("takenBy:",quizData.statistics.takenBy)*/
                  /*Delete program from student statistics*/

                  //Updating quiz data
                  try {
                    await Quiz.findByIdAndUpdate(quizModel, quizData);
                  } catch (err) {
                    next(err);
                  } //end Updating quiz data
                } catch (err) {
                  next(err);
                }
              })
            );
          } catch (err) {
            next(err);
          }
        })
      );

      /*Update Program*/
      try {
        const result = await Program.findByIdAndUpdate(
          programid,
          updateProgram
        );
        res.status(201).json({
          message: "Succed program",
          result: result
        });
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  },

  //Fine
  deleteProgram: async (req, res, next) => {
    try {
      const { programid } = req.params;
      const programData = await Program.findById(programid);
      const usersId = programData.users;
      const quizzes = programData.quiz;

      /*updating User's programs (delete)*/
      await Promise.all(
        usersId.map(async student => {
          try {
            const studentData = await User.findById(student);
            const index = studentData.programs.indexOf(student);
            studentData.programs.splice(index, 1);

            /*Delete program from student statistics*/
            let indexGrade = 0;
            while (indexGrade != -1) {
              const obj = studentData.grades.find(x => x.program == programid);
              //Get obj index
              indexGrade = studentData.grades.indexOf(obj);
              //change student data
              if (indexGrade != -1) {
                //delete from grades
                studentData.grades.splice(indexGrade, 1);
              }
            }

            try {
              await User.findByIdAndUpdate(student, studentData);
            } catch (err) {
              next(err);
            }
          } catch (err) {
            next(err);
          }
        })
      );

      //delete exams in the program
      await Promise.all(
        quizzes.map(async quiz => {
          try {
            await QuizCopy.deleteMany({ quiz: quiz });
            try {
              await Quiz.findByIdAndDelete(quiz);
            } catch (err) {
              next(err);
            }
          } catch (err) {
            next(err);
          }
        })
      );

      //respuesta of Service
      try {
        const result = await Program.findByIdAndDelete(programid);
        res.status(200).json({
          message: "delete program",
          result: result
        });
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  }
};
