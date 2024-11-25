exports.handler = async function(event, context) {
  console.log('Function invoked');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { registration } = JSON.parse(event.body);

    if (!registration) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Registration number is required.' })
      };
    }

    // Mock database of vehicles and their valuations
    const mockDatabase = [
      { id: 'WR67VBV', retailValuation: 22500, make: 'Volkswagen', model: 'Golf' },
      { id: 'YH22VFD', retailValuation: 25000, make: 'BMW', model: '3 Series' },
      { id: 'AB12CDE', retailValuation: 15000, make: 'Audi', model: 'A4' },
      { id: 'KU18FWD', retailValuation: 18000, make: 'Mercedes', model: 'C-Class' }
    ];

    const car = mockDatabase.find(car => car.id.toUpperCase() === registration.toUpperCase());

    if (car) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          retailValuation: car.retailValuation,
          make: car.make,
          model: car.model
        }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Vehicle not found or valuation not available.' }),
    };
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'An error occurred while processing the request.' }),
    };
  }
};