import { NextFunction } from 'express'
import express, { Request, Response } from 'express'

import { Password } from '../services/password'
import { Token } from '../services/token'

import { User } from '../models/user'
const router = express.Router()

router.post('/api/user', async (req: Request, res: Response, next: NextFunction) => {
  // We are checking if the user has provided an email, password and name
  // Proper way to do this is to use a validation library like Joi
  // But in this short time we can do this
  // TODO: Use Joi to validate the request body
  if (!req.body.password || !req.body.email || !req.body.name) {
    return res.status(400).send({
      code: 400,
      message: 'Please provide email, password and name for register.',
    })
  }

  let isExist = false
  // check if the user is already registered
  await User.findOne({ email: req.body.email })
    .then((result: any) => {
      if (result) isExist = true
      else isExist = false
    })
    .catch(async (err: any) => (isExist = false))

  if (isExist) {
    return res.status(400).send({
      code: 400,
      message: 'User already registered.',
    })
  }

  req.body.password = Password.toHash(req.body.password)
  let userDatas = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  }

  function create(data: any) {
    return new Promise(async (resolve, reject) => {
      await User.create(data)
        .then(async (result: any) => {
          await Token.createToken({ _id: result._id, name: result.name })
            .then((token: any) => {
              result = {
                token: token,
                ...result._doc,
              }
            })
            .catch((err: any) => reject(err))

          resolve(result)
        })
        .catch((err: any) => reject(err))
    })
  }
  await create(userDatas)
    .then((result: any) => res.status(201).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.get('/api/user', async (req: Request, res: Response, next: NextFunction) => {
  // In this route we should add a security for the can be only accessed by admin
  // TODO: Add security for only admins can access this route
  function find() {
    return new Promise(async (resolve, reject) => {
      await User.find()
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await find()
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.get('/api/user/:id', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id)
    return res.status(400).send({
      code: 400,
      message: 'Missing company ID',
    })
  function findOneWithID(id: string) {
    return new Promise(async (resolve, reject) => {
      await User.findOne({ _id: id })
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await findOneWithID(req.params.id)
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

// ✅ test for wrong password
// ✅ test for not registered user
router.post('/api/user/login', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.password || !req.body.name) {
    return res.status(400).send({
      code: 400,
      message: 'Please provide password and name for login.',
    })
  }

  function login(name: string) {
    return new Promise(async (resolve, reject) => {
      // email field is unique so we can use
      // normally we can find name and password
      // but for database and server protection, we will be check password after the find from MongoDB
      await User.findOne({ name: name })
        .then(async (result: any) => {
          let hashedPassword = Password.toHash(req.body.password)

          let isCorrect = false
          if (result.password == hashedPassword) isCorrect = true
          else isCorrect = false

          await Token.createToken({ _id: result._id, name: result.name })
            .then((token: any) => {
              result = {
                token: token,
                ...result._doc,
              }
            })
            .catch((err: any) => reject(err))

          if (isCorrect) resolve(result)
          else {
            reject({
              code: 401,
              message: 'Please check your name and password.',
            })
          }
        })
        .catch((err: any) => {
          reject({
            code: 401,
            message: 'Please check your name and password.',
          })
        })
    })
  }
  await login(req.body.name)
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

export { router as userRouter }
