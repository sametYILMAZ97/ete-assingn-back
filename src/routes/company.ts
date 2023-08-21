import { NextFunction } from 'express'
import express, { Request, Response } from 'express'

import { Company } from '../models/company'
const authtentication = require('../middlewares/token')
const router = express.Router()

router.post('/api/company', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  interface CompanyAttrs {
    name: string
    legalNumber: string
    income?: number
    expense?: number
    country?: string
    url?: string
  }
  const { name, legalNumber, country, url, income, expense } = req.body
  function create(data: CompanyAttrs) {
    return new Promise(async (resolve, reject) => {
      await Company.create(data)
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await create({ name, legalNumber, country, url, income, expense })
    .then((result: any) => res.status(201).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.get('/api/company', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  function find() {
    return new Promise(async (resolve, reject) => {
      await Company.find()
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await find()
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.get('/api/company/:id', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id)
    return res.status(400).send({
      code: 400,
      message: 'Missing company ID',
    })
  function findOneWithID(id: string) {
    return new Promise(async (resolve, reject) => {
      await Company.findOne({ _id: id })
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await findOneWithID(req.params.id)
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.put('/api/company/:id', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id)
    return res.status(400).send({
      code: 400,
      message: 'Missing company ID',
    })
  console.log('COMPANY PUT ROUTE: ', req.body)

  // TODO: Joi validaiton for updateble fields
  function updateOneWithID(id: string, data: any) {
    return new Promise(async (resolve, reject) => {
      await Company.findOne({ _id: id })
        .then(async (foundCompany: any) => {
          if (!foundCompany) return reject({ code: 400, message: 'Company not found' })
          // every req.body its an object with key and value
          // for every key in req.body we will update the value
          // in the foundCompany

          Object.keys(req.body).forEach((key: string) => {
            if (key != 'user' && key != 'createdAt' && key != 'updatedAt') {
              foundCompany[key] = req.body[key]
            }
          })
          await Company.findByIdAndUpdate(id, foundCompany, { new: true })
            .then((result: any) => resolve(result))
            .catch((err: any) => reject(err))
        })
        .catch((err: any) => reject(err))
    })
  }
  await updateOneWithID(req.params.id, req.body)
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.delete('/api/company/:id', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id)
    return res.status(400).send({
      code: 400,
      message: 'Missing company ID',
    })
  function deleteOneWithID(id: string) {
    return new Promise(async (resolve, reject) => {
      await Company.findOne({ _id: id })
        .then(async (foundCompany: any) => {
          await Company.findByIdAndDelete(id)
            .then((result: any) => resolve(result))
            .catch((err: any) => reject(err))
        })
        .catch((err: any) => reject(err))
    })
  }
  await deleteOneWithID(req.params.id)
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.get('/api/company/filter/last3', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  function findLast3() {
    return new Promise(async (resolve, reject) => {
      await Company.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await findLast3()
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

export { router as companyRouter }
