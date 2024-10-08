import express from 'express';
import fetch from 'node-fetch';
import daySchema from './model/daySchema.js';
import hourSchema from './model/hourSchema.js';
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
function getSpecificDate(data, targetDate) {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data');
    return null;
  }

  return data.find(item => item.date === targetDate);
}


//Functions for finding lowest and highest price hour for a given day
function getLowestPriceforADay(day) {
  let lowest_priceHour = day.hourlyData[0];
  let hours = day.hourlyData;
  hours.forEach(hour => {
    if(hour.data.eur < lowest_priceHour.data.eur)
      lowest_priceHour = hour;
  })
  return lowest_priceHour;
}

function getHighestPriceforADay(day) {
  let highest_price_hour = day.hourlyData[0];
  let hours = day.hourlyData;
  hours.forEach(hour => {
    if(hour.data.eur > highest_price_hour.data.eur)
      highest_price_hour = hour;
  })
  return highest_price_hour;
}
//

//functions for finding the lowest and highest price hour in all given days
function getLowestPriceAllTime(data) {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data');
    return null;
  }
  let lowest_price_hour_all_time = data[0].hourlyData[0];
  data.forEach(day => {
    let current_day_lowest_price = getLowestPriceforADay(day)
    if( current_day_lowest_price.data.eur < lowest_price_hour_all_time.data.eur)
      lowest_price_hour_all_time = current_day_lowest_price; 
  })
  return lowest_price_hour_all_time;
}

function getHighestPriceAllTime(data) {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data');
    return null;
  }
  let highest_price_hour_all_time = data[0].hourlyData[0];
  data.forEach(day => {
    let current_day_highest_price = getHighestPriceforADay(day)
    if( current_day_highest_price.data.eur > highest_price_hour_all_time.data.eur)
      highest_price_hour_all_time = current_day_highest_price; 
  })
  return highest_price_hour_all_time;
}
//

app.get('/price/lowest', async (req, res) => {
  const data = await fetchPrices();
  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
  const lowest_price = getLowestPriceAllTime(data);
  if (lowest_price) {
    let newHour = new hourSchema(lowest_price);
    newHour.save()
      .then(doc => console.log('Document saved:', doc))
      .catch(err => console.error('Error saving document:', err));
    res.json(lowest_price);
  } else {
    res.status(404).json({ error: 'Error processing request' });
  }
})

app.get('/price/highest', async (req, res) => {
  const data = await fetchPrices();
  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
  const highest_price_hour = getHighestPriceAllTime(data);
  if (highest_price_hour) {
    let newHour = new hourSchema(highest_price_hour);
    newHour.save()
      .then(doc => console.log('Document saved:', doc))
      .catch(err => console.error('Error saving document:', err));
    res.json(highest_price_hour);
  } else {
    res.status(404).json({ error: 'Error processing request' });
  }
})

// Get a specific date
app.get('/date', async (req, res) => {
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
  const matchedDate = await getSpecificDate(data, targetDate);

  if (matchedDate) {
    let newDayObject = new daySchema(matchedDate);
    newDayObject.save()
      .then(doc => console.log('Document saved:', doc))
      .catch(err => console.error('Error saving document:', err));
    res.json(matchedDate);
  } else {
    res.status(404).json({ error: 'No item found for the specified date' });
  }
});

app.get('/date/price/lowest', async (req, res) => {
  const targetDate = req.query.date; // Get the date from query parameters

  if (!targetDate) {
    return res.status(400).json({ error: 'Date query parameter is required' });
  }

  // Fetch the data from the external API
  const data = await fetchPrices();

  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }

  const matchedDate = await getSpecificDate(data, targetDate);
  const lowest_price_hour = getLowestPriceforADay(matchedDate);

  if (matchedDate) {
    let newDayObject = new hourSchema(lowest_price_hour);
    newDayObject.save()
      .then(doc => console.log('Document saved:', doc))
      .catch(err => console.error('Error saving document:', err));
    res.json(lowest_price_hour);
  } else {
    res.status(404).json({ error: 'No item found for the specified date' });
  }
});

app.get('/date/price/highest', async (req, res) => {
  const targetDate = req.query.date; // Get the date from query parameters

  if (!targetDate) {
    return res.status(400).json({ error: 'Date query parameter is required' });
  }

  // Fetch the data from the external API
  const data = await fetchPrices();

  if (!data) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }

  const matchedDate = await getSpecificDate(data, targetDate);
  const highest_price_hour = getHighestPriceforADay(matchedDate);

  if (matchedDate) {
    let newDayObject = new hourSchema(highest_price_hour);
    newDayObject.save()
      .then(doc => console.log('Document saved:', doc))
      .catch(err => console.error('Error saving document:', err));
    res.json(highest_price_hour);
  } else {
    res.status(404).json({ error: 'No item found for the specified date' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
