import mongoose from 'mongoose'
import express from 'express'
import { Request, Response, NextFunction } from 'express'
import { signinRouter } from './routes/signin'
import { companyRouter } from './routes/company'
import { userRouter } from './routes/user'
import { productRouter } from './routes/product'
const app = express()

// dotenv usage
import dotenv from 'dotenv'
dotenv.config()

app.use(express.json())
app.use(signinRouter)
app.use(companyRouter)
app.use(userRouter)
app.use(productRouter)

app.all('*', async (req: Request, res: Response, next: NextFunction) => {
  return next(new Error('Invalid route'))
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: err.message || 'an unknown error occurred!',
  })
})

// Connecting to Mongodb
const initializeConfig = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`)
    console.log('🚀MongoDB connected!')
  } catch (err) {
    console.log(err)
  }
}

app.listen(process.env.APP_PORT || 3000, async () => {
  await initializeConfig()
  console.log(`🚀Server Port: ${process.env.APP_PORT || 3000}`)

  // after the server started, get mock data from mock_datas folder
  // and insert to database if not exists
  // companies : 'ete-assignment.companies.json'
  // products : 'ete-assignment.products.json'
  // users : 'ete-assignment.users.json'
  const mockDatas = [
    {
      collectionName: 'companies',
      mockDataPath: 'ete-assignment.companies.json',
    },
    {
      collectionName: 'products',
      mockDataPath: 'ete-assignment.products.json',
    },
    {
      collectionName: 'users',
      mockDataPath: 'ete-assignment.users.json',
    },
  ]

  function insertMockData(collectionName: string, mockDataPath: string) {
    return new Promise(async (resolve, reject) => {
      // json file read
      const fs = require('fs')
      const path = require('path')
      const data = fs.readFileSync(path.join(__dirname, '../mock_datas', mockDataPath), 'utf8')
      console.log(`🚀${collectionName} mock data readed!`)
      console.log(`🚀${collectionName} mock data inserting to database!`)
      // json file insert to database
      // if  "_id": {"$oid":"5e666e346e781e0b34864de4"},  this type of id exists in json file
      // we should parse it to ObjectId like  "_id": ObjectId("5e666e346e781e0b34864de4"),
      // so we should use JSON.parse(data) for this
      console.log(`🚀${collectionName} formatting for data entry!`)
      const formattedData = JSON.parse(data).map((item: any) => {
        return {
          ...item,
          _id: new mongoose.Types.ObjectId(item._id.$oid),
        }
      })
      for (const item of formattedData) {
        await mongoose.connection
          .collection(collectionName)
          .insertOne(item)
          .then((result: any) => {
            console.log(`🚀${collectionName} inserted!`)
          })
          .catch((err: any) => {
            console.log(`🚀${collectionName} already exists!`)
          })
          .finally(() => {
            resolve(true)
          })
      }
    })
  }

  for (const mockData of mockDatas) {
    await insertMockData(mockData.collectionName, mockData.mockDataPath)
  }
})
