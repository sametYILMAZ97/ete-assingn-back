import mongoose from 'mongoose'
// An interface that describes the properties
// that are fields for Company model
interface CompanyAttrs {
  name: string
  legalNumber: string
  country?: string
  url?: string
}

// An interface that describes the properties
interface CompanyModel extends mongoose.Model<CompanyDoc> {
  build(attrs: CompanyAttrs): CompanyDoc
}

// An interface that describes the properties
interface CompanyDoc extends mongoose.Document {
  name: string
  legalNumber: string
  country?: string
  url?: string
}

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    legalNumber: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      default: 'Turkey',
    },
    url: {
      type: String,
      default: null,
    },
    income: {
      type: Number,
      default: 0,
    },
    expense: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// pre sample
// companySchema.pre('save', async function (done) {
// })

companySchema.statics.build = (attrs: CompanyAttrs) => {
  return new Company(attrs)
}

const Company = mongoose.model<CompanyDoc, CompanyModel>('Company', companySchema)
export { Company }
