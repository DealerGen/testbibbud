exports.handler = async function(event, context) {
  console.log('Function invoked');
  console.log('Event:', JSON.stringify(event));
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Parsing request body');
    const { regNumber, costs } = JSON.parse(event.body);
    console.log('Received data:', { regNumber, costs });
    
    // Mock car data (replace this with actual data fetching logic)
    const cars = [
      { id: 'ABC123', make: 'Toyota', model: 'Camry', carYear: 2020, retailValuation: 25000 },
      { id: 'XYZ789', make: 'Honda', model: 'Civic', carYear: 2019, retailValuation: 20000 },
    ];

    console.log('Searching for car');
    const car = cars.find(c => c.id.toLowerCase() === regNumber.toLowerCase());

    if (!car) {
      console.log('Car not found');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Car not found' }),
      };
    }

    console.log('Calculating max bid');
    const maxBid = calculateMaxBid(car, costs);

    console.log('Sending response');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        maxBid,
        carInfo: {
          regNumber: car.id,
          make: car.make,
          model: car.model,
          year: car.carYear,
          retailPrice: car.retailValuation
        }
      }),
    };
  } catch (error) {
    console.error('Error in function:', error);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: 'Failed to calculate max bid', details: error.message }) 
    };
  }
};

function calculateMaxBid(car, costs) {
  const retailPrice = car.retailValuation || 0;
  const carwowFee = getCarwowFee(retailPrice);
  const totalCosts = carwowFee + costs.delivery + costs.mot + costs.service + 
                     costs.cosmetic + costs.warrantyAndValet;
  const requiredGrossProfit = costs.desiredNetProfit * 1.2; // Account for VAT (20%)
  const maxBid = retailPrice - requiredGrossProfit - totalCosts;
  return Math.max(maxBid, 0); // Ensure the bid is not negative
}

function getCarwowFee(price) {
  if (price <= 2499) return 199;
  if (price <= 4999) return 249;
  if (price <= 7499) return 269;
  if (price <= 9999) return 299;
  if (price <= 14999) return 319;
  if (price <= 19999) return 339;
  if (price <= 29999) return 389;
  if (price <= 39999) return 449;
  if (price <= 49999) return 499;
  if (price <= 59999) return 599;
  if (price <= 69999) return 699;
  if (price <= 79999) return 799;
  if (price <= 89999) return 899;
  if (price <= 99999) return 929;
  return 999;
}