import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the inner data structure for each hourly entry
const perHourDataSchema = new Schema({
  eur: { type: Number, required: true },
  bgn: { type: Number, required: true },
  volume: { type: Number, required: true }
});

// Define the structure for each hourlyData entry
const HourlyDataSchema = new Schema({
  data: { type: perHourDataSchema, required: true },
  time: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/ },  // Matches time format HH:MM:SS
  _id: { type: Schema.Types.ObjectId, required: true }  // MongoDB ObjectId for each hourly data point
});

// Define the main document schema
export const MainSchema = new Schema({
  _id: {type: String, required: true},
  date: { type: String, required: true, match: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.202[0-4]$/ },  // Matches date format DD.MM.YYYY within 2020-2024
  hourlyData: { type: [HourlyDataSchema], required: true },
  __v: { type: Number }  // Version key
});

// Create a model from the schema
const daySchema = mongoose.model('days', MainSchema);
export default daySchema;
