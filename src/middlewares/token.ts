import { Request, Response, NextFunction } from 'express'
import { Token } from '../services/token'
import { User } from '../models/user'

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || null
  if (!token) {
    return res.status(401).send({
      code: 401,
      message: 'Unauthorized access to this resource, please login first.',
    })
  }

  // error template for unauthorized access message to client side
  const errorObject = {
    code: 401,
    message: 'Unauthorized access to this resource, please login first.',
  }

  Token.verifyToken(token)
    .then(async (result: any) => {
      await User.findOne({ _id: result._id })
        .then((result: any) => {
          req.body.user = result
          next()
        })
        .catch((err: any) => {
          return res.status(401).send(errorObject)
        })
    })
    .catch((err: any) => {
      return res.status(401).send(errorObject)
    })
}

module.exports = authentication
