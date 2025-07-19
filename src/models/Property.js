import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  price:        { type: Number, required: true },
  location: {
    // simple lat/lng pair
    lat:      { type: Number, required: true },
    lng:      { type: Number, required: true }
  },
  images:       { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Property ||
       mongoose.model('Property', PropertySchema);
