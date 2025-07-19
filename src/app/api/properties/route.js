// src/app/api/properties/route.js
import { connectToDB } from '@/lib/mongodb'
import Property      from '@/models/Property'
import fs            from 'fs'
import path          from 'path'

// disable Next’s default parser
export const config = { api: { bodyParser: false } }

export async function GET() {
  await connectToDB()
  const props = await Property.find().sort({ createdAt: -1 })
  return new Response(JSON.stringify(props), { status: 200 })
}

export async function POST(request) {
  // 1. parse the multipart form
  const formData = await request.formData()
  const title       = formData.get('title')
  const description = formData.get('description')
  const price       = parseFloat(formData.get('price'))
  const lat         = parseFloat(formData.get('lat'))
  const lng         = parseFloat(formData.get('lng'))
  const files       = formData.getAll('images')  // array of File

  // 2. ensure uploads dir exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.promises.mkdir(uploadDir, { recursive: true })

  // 3. write each File blob to disk, collect its public URL
  const imageUrls = []
  for (const file of files) {
    // file.name is the original filename
    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)
    const filename    = `${Date.now()}-${file.name}`
    const filepath    = path.join(uploadDir, filename)
    await fs.promises.writeFile(filepath, buffer)
    imageUrls.push(`/uploads/${filename}`)
  }

  // 4. save to MongoDB
  await connectToDB()
  const prop = await Property.create({
    title,
    description,
    price,
    location: { lat, lng },
    images: imageUrls
  })

  return new Response(JSON.stringify(prop), { status: 201 })
}
