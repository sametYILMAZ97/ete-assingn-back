import mongoose from 'mongoose'
// An interface that describes the properties
// that are fields for create a new Product
// Product Name - Product Category - Product Amount - Amount
// Unit - Company (In relation with companies from Company table
interface ProductAttrs {
  name: string
  category: string
  amount: number
  unit: string
  company: string
}

// An interface that describes the properties
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc
}

// An interface that describes the properties
interface ProductDoc extends mongoose.Document {
  name: string
  category: string
  amount: number
  unit: string
  company: string
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: null,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// pre sample
// productSchema.pre('save', async function (done) {
// })

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs)
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema)
export { Product }
