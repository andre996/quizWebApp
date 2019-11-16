import { errorResponse } from "../responses";

const mongoose = require('mongoose')
const joi = require('joi')
const joigoose = require('joigoose')
const express = require('express')(mongoose)



const schmRegistryUser = joi.object().keys({
    name: joi.string().required(),
    lastname: joi.string().required(),
    ci: joi.string().min(6).max(8).required(),
    ciType: joi.string().min().required(),
    bornDate: joi.string().min(8).max(10),
    password: joi.string().min(8).required(), 
    phone: joi.string(),
    email: joi.string().email({minDomainAtoms: 2}).required()
}).unknown(true)

const evaluateDate = (year, month, date) => {
    const bisiesto = (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
    switch (month) {
      case 2:
        if (bisiesto && date > 29 || !bisiesto && date > 28)
          return false
        break
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        if (date > 31)
          return false
        break
      default:
        if (date > 30)
          return false
        break
    }
    return true
  }

export const handleAddUser = async (req, res) => {

    const result = joi.validate(req.body, schmRegistryUser)

    if (result.error) {
        console.log(`error: ${result.error}`)
        return res.json(errorResponse(`Parametros Invalidos`))
    }


}//handleAddUser