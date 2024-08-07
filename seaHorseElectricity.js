const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;


const endpointUrl = 'https://seahorse-app-ehbvv.ondigitalocean.app/prices';

async function fetchPrices() {
  try {
    const response = await fetch(endpointUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data
    }
    catch (error) {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching the prices:', error);
  }
}

async function findDayByDate(targetDate){
    const data = await fetchPrices();

    if (!data || !Array.isArray(data)) {
        console.error('Invalid data');
        return null;
    }

    return data.find(item => item.date === targetDate);
}

async function getDailyHighestPrice(targetDate){
    let day = findDayByDate(targetDate);
    let hour = day.hourlyData;
    hour.forEach(hour => {
        console.log(hour.data);
    })
    return 0;
}

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
    res.json(matchedItem);
  } else {
    res.status(404).json({ error: 'No item found for the specified date' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Main function to execute the logic
async function main() {
  const targetDate = '02.01.2024'; // Replace with the desired date

  const matchedItem = await getDailyHighestPrice(targetDate);

  if (matchedItem) {
    console.log('Matched item found:', matchedItem);
    // You can further process the matched item here
  } else {
    console.log('No item found for the specified date.');
  }
}

// Execute the main function
main();


/*
        responseJSON.forEach(day =>{
            expect(day).toMatchObject(dayStruct);
            expect(day.hourlyData).toHaveLength(24);
            // iterate through each hour of the date and validate the structure of the object
            let hour = day.hourlyData;
            hour.forEach(hour => {
                expect(hour).toMatchObject(hourlyDataStruct);
            })
        });  
        
        */