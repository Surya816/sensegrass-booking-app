import { connectToDB } from '@/lib/mongodb';
import Property        from '@/models/Property';

export async function GET(req, { params }) {
  const { id } = await params;
  await connectToDB();
  const prop = await Property.findById(id);
  return new Response(JSON.stringify(prop), { status: 200 });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const updates  = await req.json();
  await connectToDB();
  const prop = await Property.findByIdAndUpdate(id, updates, { new: true });
  return new Response(JSON.stringify(prop), { status: 200 });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await connectToDB();
  await Property.findByIdAndDelete(id);
  return new Response(null, { status: 204 });
}
