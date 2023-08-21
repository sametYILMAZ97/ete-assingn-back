const JWT = require('jsonwebtoken')
const signature = process.env.TOKEN_SIGNATURE || 'token_signature'
export class Token {
  static createToken(payload: any) {
    return new Promise((resolve, reject) => {
      // 5 minutes
      JWT.sign(payload, signature, { expiresIn: 300 }, (err: any, token: any) => {
        if (err) reject(err)
        else resolve(token)
      })
    })
  }

  static verifyToken(token: string) {
    // In real world we can use refresh token to renew the token
    // but for this project we will not use refresh token for simplicity
    // In refresh token scenario, we must check the refresh token is valid or not
    // If it is valid, we can create new token and send it to client with old refresh token
    // If it is not valid, we can send error message to client to re-login
    return new Promise((resolve, reject) => {
      JWT.verify(token, signature, (err: any, decoded: any) => {
        if (err) reject(err)
        else resolve(decoded)
      })
    })
  }
}
