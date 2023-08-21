import mongoose from 'mongoose'
import { Password } from '../services/password'
// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string
  password: string
  name: string
  companies?: string[]
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// An interface that describes the properties
// that a User Doc has
interface UserDoc extends mongoose.Document {
  email: string
  password: string
  name: string
  companies?: string[]
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    companies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// I will using this in controller
// userSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hashed = Password.toHash(this.get('password'))
//     this.set('password', hashed)
//   }
// })

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
export { User }
