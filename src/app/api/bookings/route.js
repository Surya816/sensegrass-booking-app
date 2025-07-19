// src/app/api/bookings/route.js

import { connectToDB }            from '@/lib/mongodb';
import Booking                    from '@/models/Booking';
import Property                   from '@/models/Property';
import Razorpay                   from 'razorpay';
import { getServerSession }       from 'next-auth/next';
import { authOptions }            from '../auth/[...nextauth]/route';

export async function GET(request) {
  // 1️⃣ Authenticate user
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  await connectToDB();

  // 2️⃣ Check if admin wants to fetch all bookings
  const url = new URL(request.url);
  const all = url.searchParams.get('all') === 'true';

  let list;
  if (all) {
    // only admins
    if (session.user.role !== 'admin') {
      return new Response('Forbidden', { status: 403 });
    }
    list = await Booking.find()
      .populate('user',    'name email')
      .populate('property','title price')
      .sort({ createdAt: -1 });
  } else {
    // normal users only see their own
    list = await Booking.find({ user: session.user.id })
      .populate('property','title price')
      .sort({ createdAt: -1 });
  }

  return new Response(JSON.stringify(list), { status: 200 });
}

export async function POST(request) {
  // 1️⃣ Authenticate user
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2️⃣ Parse booking details
  const { propertyId, fromDate, toDate } = await request.json();

  await connectToDB();
  const prop = await Property.findById(propertyId);
  if (!prop) {
    return new Response('Property not found', { status: 404 });
  }

  // 3️⃣ Calculate amount (in paise)
  const start = new Date(fromDate);
  const end   = new Date(toDate);
  const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const amount = prop.price * days * 100;

  // 4️⃣ Create Razorpay order (or stub)
  let orderId;
  let keyId = '';
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    keyId = process.env.RAZORPAY_KEY_ID;
    const rz = new Razorpay({
      key_id:     keyId,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const order = await rz.orders.create({ amount, currency: 'INR' });
    orderId = order.id;
  } else {
    // stub for dev / no-razorpay
    orderId = `stub_order_${Date.now()}`;
  }

  // 5️⃣ Save booking
  const booking = await Booking.create({
    user:            session.user.id,
    property:        propertyId,
    fromDate:        start,
    toDate:          end,
    amount,
    razorpayOrderId: orderId,
    paid:            !keyId
  });

  // 6️⃣ Return order details to client
  return new Response(
    JSON.stringify({
      bookingId: booking._id,
      orderId,
      keyId,
      amount
    }),
    { status: 201 }
  );
}
