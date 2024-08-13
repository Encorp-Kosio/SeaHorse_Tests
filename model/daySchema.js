import mongoose from 'mongoose';
import { HourlyDataSchema } from './hourSchema.js';
const Schema = mongoose.Schema;

// Define the main document schema
export const DaySchema = new Schema({
  _id: {type: String, required: true},
  date: { type: String, required: true, match: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.202[0-4]$/ },  // Matches date format DD.MM.YYYY within 2020-2024
  hourlyData: { type: [HourlyDataSchema], required: true },
  __v: { type: Number }  // Version key
});

// Create a model from the schema
const daySchema = mongoose.model('days', DaySchema);
export default daySchema;
