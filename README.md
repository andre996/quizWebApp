# Quiz Web App

Web app to generate quizzes, take them, calculate grade per student and per class.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

* mongoDB
* npm/yarn
* code editor
* postman


### Installing
First clone the repository
```
npm install
```

Second install back-end dependencies at **Application folder**
```
npm install
```

third install front-end dependencies at **tesis-app folder**
```
npm install
```

then start the back-end 
```
npm start
```

Open a new terminal and Second at **tesis-app folder** start the front-end 
```
npm start
```

at the begin to get login as admin, you must post a user using postman:
```
endpoint: http://localhost:3000/users

{
    "firstName":"Admin", 
    "lastName": "Admin",
    "email":  "admin@gmail.com",
    "password": "admin",
    "admin": true
}
```

## Built With

* [ReactJS]
* [NodeJs]
* [Mongoose]


## Authors

* **Gonzalez Sean** - *Initial work* - [saga](https://github.com/SeanGonzalezAbreu)
* **Prieto Daniel** - *Initial work* - [samudex](https://github.com/samudex)
* **Rodriguez Andres** - *Initial work* - [andre996](https://github.com/andre996)
