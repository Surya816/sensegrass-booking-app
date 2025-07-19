import { connectToDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import fs from 'fs';
import path from 'path';

export const config = { api: { bodyParser: false } };

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const prop = await Property.findById(id);
  return new Response(JSON.stringify(prop), { status: 200 });
}

export async function PUT(req, { params }) {
  const { id } = params;
  const formData = await req.formData();

  const title       = formData.get('title');
  const description = formData.get('description');
  const price       = parseFloat(formData.get('price'));
  const lat         = parseFloat(formData.get('lat'));
  const lng         = parseFloat(formData.get('lng'));
  const files       = formData.getAll('images');
  const removedRaw  = formData.get('removedImages') || '[]';

  let removedImages = [];
  try {
    removedImages = JSON.parse(removedRaw);
  } catch (e) {
    console.warn('Invalid removedImages JSON:', removedRaw);
  }

  // Ensure uploads dir exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const newImageUrls = [];
  for (const file of files) {
    if (file && file.name) {
      const buffer   = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filepath, buffer);
      newImageUrls.push(`/uploads/${filename}`);
    }
  }

  await connectToDB();
  const existing = await Property.findById(id);

  const updatedImages = [
    ...(existing.images || []).filter(url => !removedImages.includes(url)),
    ...newImageUrls,
  ];

  // (Optional) Delete removed image files from disk
  for (const url of removedImages) {
    const filePath = path.join(process.cwd(), 'public', url);
    try {
      await fs.promises.unlink(filePath);
    } catch (e) {
      console.warn('Failed to delete image:', filePath);
    }
  }

  const updated = await Property.findByIdAndUpdate(
    id,
    {
      title,
      description,
      price,
      location: { lat, lng },
      images: updatedImages,
    },
    { new: true }
  );

  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req, context) {
  const { id } = context.params; // ✅ proper access without 'await'
  await connectToDB();
  await Property.findByIdAndDelete(id);
  return new Response(null, { status: 204 });
}
