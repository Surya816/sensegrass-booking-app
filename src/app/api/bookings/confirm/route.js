import { connectToDB } from '@/lib/mongodb';
import Booking         from '@/models/Booking';
import crypto          from 'crypto';

export async function POST(req) {
  const { bookingId, paymentId, orderId, signature } = await req.json();

  if (!process.env.RAZORPAY_KEY_SECRET) {
    await connectToDB();
    await Booking.findByIdAndUpdate(bookingId, {
      paid:               true,
      razorpayPaymentId: paymentId || 'stub'
    });
    return new Response('OK', { status: 200 });
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (expected !== signature) {
    return new Response('Invalid signature', { status: 400 });
  }

  await connectToDB();
  await Booking.findByIdAndUpdate(bookingId, {
    paid:               true,
    razorpayPaymentId:  paymentId
  });

  return new Response('OK', { status: 200 });
}
