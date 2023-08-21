import { NextFunction } from 'express'
import express, { Request, Response } from 'express'

import { Product } from '../models/products'
const authtentication = require('../middlewares/token')
const router = express.Router()

router.post('/api/product', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  interface ProductAttrs {
    name: string
    category: string
    amount: number
    unit: string
    company: string
  }

  if (!req.body.name || !req.body.category || !req.body.amount || !req.body.unit || !req.body.company) {
    return res.status(400).send({
      code: 400,
      message: 'Please provide name, category, amount, unit, and company for product.',
    })
  }

  const { name, category, amount, unit, company } = req.body
  function create(data: ProductAttrs) {
    return new Promise(async (resolve, reject) => {
      await Product.create(data)
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await create({ name, category, amount, unit, company })
    .then((result: any) => res.status(201).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.get('/api/product', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  function find() {
    return new Promise(async (resolve, reject) => {
      await Product.find()
        .populate('company')
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await find()
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.get('/api/product/:id', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id)
    return res.status(400).send({
      code: 400,
      message: 'Missing product information',
    })
  function findOneWithID(id: string) {
    return new Promise(async (resolve, reject) => {
      await Product.findOne({ _id: id })
        .populate('company')
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await findOneWithID(req.params.id)
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.delete('/api/product/:id', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id)
    return res.status(400).send({
      code: 400,
      message: 'Missing product information',
    })

  function deleteOneWithID(id: string) {
    return new Promise(async (resolve, reject) => {
      await Product.deleteOne({ _id: id })
        .then((result: any) => resolve(result))
        .catch((err: any) => reject(err))
    })
  }
  await deleteOneWithID(req.params.id)
    .then((result: any) => res.status(200).send(result))
    .catch((err: any) => res.status(400).send(err))
})

router.put('/api/product/:id', authtentication, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id)
    return res.status(400).send({
      code: 400,
      message: 'Missing product information',
    })
  // TODO: Joi validaiton for updateble fields
  function updateOneWithID(id: string, data: any) {
    return new Promise(async (resolve, reject) => {
      await Product.findOne({ _id: id })
        .then(async (foundProduct: any) => {
          if (!foundProduct)
            return reject({
              code: 400,
              message: 'Product not found.',
            })

          // every req.body its an object with key and value
          // for every key in req.body we will update the value
          // in the foundProduct
          Object.keys(req.body).forEach((key: string) => {
            foundProduct[key] = req.body[key]
          })
          await Product.findByIdAndUpdate(id, foundProduct, { new: true })
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

export { router as productRouter }
