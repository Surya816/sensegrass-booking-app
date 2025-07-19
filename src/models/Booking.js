// src/models/Booking.js
import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  user:               { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  property:           { type: mongoose.Types.ObjectId, ref: 'Property', required: true },
  fromDate:           { type: Date, required: true },
  toDate:             { type: Date, required: true },
  amount:             { type: Number, required: true },        // in paise
  paid:               { type: Boolean, default: false },
  razorpayOrderId:    { type: String, required: true },
  razorpayPaymentId:  { type: String },
}, { timestamps: true })

export default mongoose.models.Booking ||
       mongoose.model('Booking', BookingSchema)
