const CryptoJS = require('crypto-js')
const signature = process.env.PASSWORD_SIGNATURE || 'password_signature'
export class Password {
  static toHash(password: string) {
    return CryptoJS.HmacSHA256(password, signature).toString()
  }
}
