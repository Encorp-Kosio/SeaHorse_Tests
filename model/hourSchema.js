import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the inner data structure for each hourly entry
const perHourDataSchema = new Schema({
    eur: { type: Number, required: true },
    bgn: { type: Number, required: true },
    volume: { type: Number, required: true }
  });

// Define the structure for each hourlyData entry
export const HourlyDataSchema = new Schema({
    data: { type: perHourDataSchema, required: true },
    time: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/ },  // Matches time format HH:MM:SS
    _id: { type: Schema.Types.ObjectId, required: true }  // MongoDB ObjectId for each hourly data point
});

const hourSchema = mongoose.model('hours', HourlyDataSchema);
export default hourSchema;
