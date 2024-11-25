import axios from 'axios';
import { Car } from '../types';

const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_SHEETS_URL_HERE';

export const fetchCarsData = async (): Promise<Car[]> => {
  try {
    const response = await axios.get(GOOGLE_SHEETS_URL);
    // Parse the CSV data from the response
    // You'll need to implement the parsing logic based on your CSV structure
    // For now, we'll return a mock data
    return mockCarsData;
  } catch (error) {
    console.error('Error fetching car data:', error);
    return [];
  }
};

// Mock data for development
const mockCarsData: Car[] = [
  { id: '1', make: 'Toyota', model: 'Camry', year: 2018, price: 20000, mileage: 50000, condition: 4, color: 'Silver' },
  { id: '2', make: 'Honda', model: 'Civic', year: 2019, price: 18000, mileage: 35000, condition: 4.5, color: 'Blue' },
  { id: '3', make: 'Ford', model: 'Mustang', year: 2017, price: 25000, mileage: 40000, condition: 3.5, color: 'Red' },
  { id: '4', make: 'Chevrolet', model: 'Malibu', year: 2020, price: 22000, mileage: 20000, condition: 5, color: 'White' },
  { id: '5', make: 'BMW', model: '3 Series', year: 2016, price: 19000, mileage: 60000, condition: 3, color: 'Black' },
];