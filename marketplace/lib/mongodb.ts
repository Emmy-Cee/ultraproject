import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not defined')
}

interface MongoCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongo: MongoCache | undefined
}

let cached = globalThis.mongo

if (!cached) {
  cached = { conn: null, promise: null }
  globalThis.mongo = cached
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongooseInstance) => {
      return mongooseInstance
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
