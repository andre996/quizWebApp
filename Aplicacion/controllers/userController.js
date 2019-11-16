const User = require('../model/userModel')
const quizCopy = require('../model/quizCopyModel')
const Program = require('../model/programModel')
const Quiz = require('../model/quizModel')
const utilitis = require('../utilities')


module.exports = {

    index: async (req,res,next) => {
        try{
             const usersData = await User.find({admin:false})
             const adminBody = req.body
             let users = JSON.parse(JSON.stringify(usersData))
             listUsers = []
             users.map((user) => {

                  delete user.password
                  listUsers.push(user)
              })
             res.status(200).json(listUsers)
        }catch (err) {
             next(err)
        }
   },
   all: async (req,res,next) => {
    try{
         const usersData = await User.find()
         const adminBody = req.body
         let users = JSON.parse(JSON.stringify(usersData))
         listUsers = []
         users.map((user) => {

              delete user.password
              listUsers.push(user)
          })
         res.status(200).json(listUsers)
    }catch (err) {
         next(err)
    }
},

     //Fine
     newUser: async (req,res,next) => {
          try {
               
            let userData = req.body
            userData.password = Buffer.from(userData.password).toString('base64')


              let newUser = new User(userData)
               if(newUser.admin === true){
                   try{
                       const numberOfAdmin = await User.find({admin:true})
                       console.log(numberOfAdmin.length)
                       if(numberOfAdmin.length < 3){
                           try{
                            const user = await newUser.save()
                            res.status(201).json({'message':'Usuario registrado 👌'})
                           }
                           catch(err){
                            if ( err.code == 11000 ) {
                                res.status(500).json({'message':'El correo ya esta agregado 😒'})
                              }
                               next(err)
                           }

                       }else{
                        res.status(200).json({
                            'message':'Alcanzo el maximo numero de adminstradores 🤷‍'
                        })
                       }
                   }
                   catch(err){
                       next(err)
                   }
                

               }else{
                const user = await newUser.save()
                await Promise.all(user.programs.map(async (program) => {
                    try{
                         const programData = await Program.findById(program).populate('quiz')
                         programData.users.push(user._id)
                         try{
                              await Program.findByIdAndUpdate(program,programData)
                          }catch (err) {
                              next(err)
                          }

                            //Get quizzes
                            let quizzes = programData.quiz

                            //pass trohgt all quizzes
                            await Promise.all(quizzes.map(async quizModel => {

                                    console.log('3')
                                    let quizOriginal = quizModel
                                    quizModel = JSON.parse(JSON.stringify(quizModel))
                                    delete quizModel.statistics
                                    delete quizModel.quizCopies
                                    quizModel.quiz = quizModel._id
                                    delete quizModel._id
                                    delete quizModel.__v
                                    quizModel.student = user.id


                                    //Delete Answers
                                    console.log('4')
                                    quizModel.questions.map(async (question) => { 
                                        question.answers.map(async (answer) => {
                                            answer.bool = false
                                        } )
                                    })
                                    
                                    //Create new model
                                    console.log('5')
                                    const newQuizCopy = new quizCopy(quizModel)

                                    //Add the model to db and push id to copies exames list
                                    console.log('6')
                                    try{
                                        console.log('6.1')
                                        const quizCopy = await newQuizCopy.save()
                                        console.log('6.2')
                                        quizOriginal.quizCopies.push(quizCopy._id)
                                    }catch (err) {
                                        next(err)
                                    }

                                    //add and update quizzes Copies to quiz Document
                                    console.log('7')
                                    quizOriginal.statistics.totalStudents = parseInt(programData.users.length) + 1
                                    console.log('7.1')
                                    try{
                                        console.log('7.2')
                                        console.log(typeof(quizOriginal._id))
                                        console.log(quizOriginal._id)
                                        console.log(typeof(JSON.parse(JSON.stringify(quizOriginal._id))))
                                        console.log(JSON.parse(JSON.stringify(quizOriginal._id)))
                                        console.log(quizOriginal)
                                        await Quiz.findByIdAndUpdate(JSON.parse(JSON.stringify(quizOriginal._id)),JSON.parse(JSON.stringify(quizOriginal)))
                                        console.log('7.3')
                                    }catch (err) {
                                        next(err)
                                    }
                                }))
                        }catch (err) {
                            next(err)
                        }
                        
                    }))
                    res.status(201).json({'message':'Usuario registrado 👌'})
               }
          }catch (err) {
            if ( err.code == 11000 ) {
                res.status(500).json({'message':'El correo ya esta agregado 😒'})
              }
               next(err)
          }
     },

     //Fine
     getUser: async (req, res, next) => {
          try {
               const { userid } = req.params 
               const user = await User.findById(userid)
               if (user.admin == false){
                const quizzes = await quizCopy.find({student:user._id,taken:false})
                res.status(200).json({
                     userData: user,
                     quizzesData: quizzes
                })}
                else{
                    res.status(200).json(user)
                }
          }catch (err) {
               next(err)
          }
     },

     getAdmins: async (req, res, next) => {
        try {
            const adminBody = req.body
            const adminsData = await User.find({admin:true})
            let admins = JSON.parse(JSON.stringify(adminsData))
               listAdmins = []
               admins.map((admin) => {
                    delete admin.password
                    delete admin.programs
                    delete admin.grades
                    if(admin._id!==adminBody.id){
                        listAdmins.push(admin)
                    }
               })
               res.status(200).json(listAdmins)
        }catch (err) {
             next(err)
        }
   },

     //Fine
     updateUser: async (req, res, next) =>{
          try{
              const { userid } = req.params
              const updateUser = req.body
              updateUser.password = Buffer.from(updateUser.password).toString('base64')
              const userData = await User.findById(userid)
              const newProgramsList = req.body.programs
              const oldProgramsList = userData.programs
              const addPrograms = utilitis.arrayDifferences(newProgramsList ,oldProgramsList)
              const deletePrograms = utilitis.arrayDifferences(oldProgramsList,newProgramsList )
  
  
              /*updating program's data*/
              await Promise.all(addPrograms.map(async program => {
                  try{
                      let programData = await Program.findById(JSON.parse(program))
                      programData.users.push(userid)
                      try{
                          await Program.findByIdAndUpdate(JSON.parse(program),programData)
                      }catch (err) {
                          next(err)
                      }
                  }catch (err) {
                      next(err)
                  } 
              }))
              
              /*updating User's programs (delete)*/
              await Promise.all(deletePrograms.map(async program => {
                  try{
                      const programData = await Program.findById(JSON.parse(program))
                      const index = programData.users.indexOf(JSON.parse(program))
                      programData.users.splice(index,1)
                      try{
                          await Program.findByIdAndUpdate(JSON.parse(program),programData)
                      }catch (err) {
                          next(err)
                      }
                  }catch (err) {
                      next(err)
                  }
              }))
  
              /*Update User*/
              try{
                  const result = await User.findByIdAndUpdate(userid,updateUser)
                  console.log(1)
                  res.status(201).json({
                      'message':'Usuario registrado 👌',
                      'result': result
                      })
              }catch (err) {
                if ( err.code == 11000 ) {
                    res.status(500).json({'message':'El correo ya esta agregado 😒'})
                    return
                }
                  next(err)
              }
          } catch (err) {
              console.log(4)
              next(err)
          }},

     /*updateUser: async (req, res, next) => {
          // req.body contains any element
          try {
               const { userid } = req.params 
               const newUser  = req.body
               const result = await User.findByIdAndUpdate(userid, newUser)
               res.status(200).json(result)
          }catch (err) {
               next(err)
          }
     },*/

     //Fine
     deleteUser: async (req, res, next ) => {
               try{
                const { userid } = req.params
                const userData = await User.findById(userid)
                const programId = userData.programs
                   
                   /*updating Programs's Users is sign in (delete)*/
                   await Promise.all(programId.map(async program => {
                    console.log("Program")
                    console.log(program)
                       try{
                           //Get program's data
                           const programData = await Program.findById(program)

                           //Delete delete user from program students
                           const index = programData.users.indexOf(program)
                           programData.users.splice(index,1)
                           try{
                               await Program.findByIdAndUpdate(program,programData)
                           }catch (err) {
                               next(err)
                           }

                           //Delete user from programa's statistics
                           //Pass throgh all quiz in the program
                           await Promise.all(programData.quiz.map( async quizModel => {
                               /*console.log("Quizzes")
                               console.log(quizModel)*/
                            try{
                                //Get the data of the quiz
                                let quizData = await Quiz.findById(quizModel)
                                //Find student's statictis obj in the students grade array 
                                let obj = quizData.statistics.studentsGrade.find(x => x.id == userid);
                                //Get obj index
                                const indexGrade = quizData.statistics.studentsGrade.indexOf(obj)
                                /*console.log("quiz index")
                                console.log(indexGrade)
                                console.log("Before")
                                console.log("students Grades:",quizData.statistics.studentsGrade)
                                console.log("takenBy:",quizData.statistics.takenBy)*/
                                //if student has taken the quiz get in
                                if(indexGrade!=-1){
                                    //delete from statictis
                                    quizData.statistics.studentsGrade.splice(indexGrade,1)
                                    quizData.statistics.takenBy -= 1
                                    quizData.statistics.totalStudents -= 1
                                    const add = (a, b) => a + b
                                    //Set mean grade
                                    if(quizData.statistics.studentsGrade.length>=2)
                                    {
                                        quizData.statistics.meanGrade = quizData.statistics.studentsGrade.reduce(add)/quizAnsweres.statistics.takenBy
                                    }else if(quizData.statistics.studentsGrade.length==1){
                                        quizData.statistics.meanGrade = quizData.statistics.studentsGrade[0].grade
                                    }else{
                                        quizData.statistics.meanGrade = 0
                                    }
                                }
                                /*console.log("After")
                                console.log("students Grades:",quizData.statistics.studentsGrade)
                                console.log("takenBy:",quizData.statistics.takenBy)*/
                                
                                //Updating quiz data
                                try{
                                    await Quiz.findByIdAndUpdate(quizModel,quizData)
                                }catch (err) {
                                    next(err)
                                }//end Updating quiz data
                                
                            }catch(err){
                                next(err)
                            }
                        
                        }))
                       }catch (err) {
                           next(err)
                       }
                }))
                   try{
                       const result = await User.findByIdAndDelete(userid)
                       res.status(200).json({
                           'message':'delete user',
                           'result': result
                       })
                   }catch(err){
                       next(err)
                   }
               }catch(err) {
                   next(err)
               }
           },

           userlogin: async(req,res,next) =>{
            try{
                 const { email, password } = req.body
                 let userData = await User.findOne({email})
                 if(userData==null){
                    res.status(500).json({
                        message: "Usuario no registrado",
                   })
                 }
                 user = JSON.parse(JSON.stringify(userData))
                 dbPassword = Buffer.from(user.password, 'base64').toString()
                 if (password == dbPassword) {
                     delete user.password
                     if (user.admin == false){
                      const quizzes = await quizCopy.find({student:user._id,taken:false})
                      res.status(200).json({
                           userData: user,
                           quizzesData: quizzes
                      })}
                      else {
                          res.status(200).json({
                              userData: user
                         })}
                      }else{
                      res.status(500).json({
                           message: "La clave no coincide",
                      })}
            }catch (err) {
                 next(err)
            }

       },

       sendQuiz: async (req,res,next) => {
           try{
                let quizResponse = req.body
                let answerBodyString
                let answerQueryString
                let correctsAnswers = 0
                let questionsNumber = 0
                
                let quizAnsweres = await Quiz.findById(quizResponse.quiz)
                quizResponse.questions.map((answerBody) => {
                    answerBodyString = JSON.stringify(answerBody)
                    quizAnsweres.questions.map((answerQuery)=>{
                        answerQueryString = JSON.stringify(answerQuery)
                        if(answerBodyString===answerQueryString){
                            correctsAnswers += 1
                        }
                    })
                    questionsNumber += 1
                })
                testGrade = ((20/questionsNumber)*correctsAnswers).toFixed(2)
                quizResponse.grade = testGrade

                try{
                    studentData = await User.findById(quizResponse.student)
                }catch(err){
                    next(err)
                }

                //Updating quiz satistics
                
                quizAnsweres.statistics.studentsGrade.push({
                                                            name: studentData.firstName,
                                                            grade:parseFloat(testGrade),
                                                            id:quizResponse.student
                                                            })
                quizAnsweres.statistics.takenBy = quizAnsweres.statistics.takenBy + 1
                
                if(quizAnsweres.statistics.takenBy>=2)
                {
                    let totalGrade = 0
                    quizAnsweres.statistics.studentsGrade.map( obj => {
                        totalGrade = totalGrade + parseInt(obj.grade)
                    })
                    console.log(totalGrade)
                    console.log(quizAnsweres.statistics.takenBy)
                    quizAnsweres.statistics.meanGrade = totalGrade/quizAnsweres.statistics.takenBy
                    console.log(quizAnsweres.statistics.meanGrade)
                }else if(quizAnsweres.statistics.takenBy==1){
                    console.log("taken = 1")
                    
                    quizAnsweres.statistics.meanGrade = testGrade
                    console.log(quizAnsweres.statistics.meanGrade)
                }else{
                    console.log("taken = 0")
                    quizAnsweres.statistics.meanGrade = 0
                    console.log(quizAnsweres.statistics.meanGrade)
                }
                
                try{
                    await Quiz.findByIdAndUpdate(quizAnsweres._id,quizAnsweres)
                }catch(err){
                    next(err)
                }
                
                //Updating and quizCopy
                quizResponse.taken = true
                try{
                    await quizCopy.findByIdAndUpdate(quizResponse._id,quizResponse)
                }catch(err){
                    next(err)
                }

                //student update statictis
                studentData.grades.push({
                    grade:parseFloat(testGrade),
                    program:quizResponse.program,
                    quiz:quizResponse.quiz,
                    title:quizResponse.title
                })

                try{
                    const resp = await User.findByIdAndUpdate(studentData._id,studentData)
                }catch(err){
                    next(err)
                }

                res.status(200).json({
                    quizResponse
                })

           }catch(err){
               next(err)
           }

       }
/*
     getPrograms: async (req, res, next) => {
          try{
               const { userid } = req.params
               const user = await User.findById(userid)
               console.log(user.programs)
               res.status(200).json({
                    programs:user.programs,
               })
          }catch(err){
               next(err)
          }
     },*/
/*
     addProgram: async (req,res,next) => {
        try{
            const { userid , programid } = req.params
            let newUser = await User.findById(userid).subjects.programs(programid)
            try{
                const result = await User.findByIdAndUpdate(userid,newUser)
            }catch (err) {
                next(err)
            }
            res.status(200).json({
                result
            })
        }catch (err) {
             next(err)
        }
     },*/


}