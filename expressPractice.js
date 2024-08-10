import express from 'express';
import fetch from 'node-fetch';
import daySchema from './model/daySchema.js';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint URL from where data will be fetched
const endpointUrl = 'https://seahorse-app-ehbvv.ondigitalocean.app/prices';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/seaHorseDB', {
  useNewUrlParser: true
});

// Function to fetch the data from the external API
async function fetchPrices() {
  try {
    const response = await fetch(endpointUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Return the fetched data

  } catch (error) {
    console.error('Error fetching the prices:', error);
    return null; // Return null in case of error
  }
}

// Function to find the matched item based on the target date
async function findItemByDate(data, targetDate) {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data');
    return null;
  }

  return data.find(item => item.date === targetDate);
}

// Route to get item by date
app.get('/item-by-date', async (req, res) => {
  const targetDate = req.query.date; // Get the date from query parameters

  if (!targetDate) {
    return res.status(400).json({ error: 'Date query parameter is required' });
  }

  // Fetch the data from the external API
  const data = await fetchPrices();

  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }

  // Find the item with the target date
  const matchedItem = await findItemByDate(data, targetDate);

  if (matchedItem) {
    let newDayObject = new daySchema(matchedItem);
    newDayObject.save()
      .then(doc => console.log('Document saved:', doc))
      .catch(err => console.error('Error saving document:', err));
    res.json(matchedItem);
  } else {
    res.status(404).json({ error: 'No item found for the specified date' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
