import Papa from 'papaparse';
import { Car } from '../types';

export const parseCarwowCsv = (csvData: string): Promise<Car[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cars: Car[] = results.data.map((row: any, index: number) => {
          if (!row.REG) {
            console.warn(`Row ${index + 2} is missing REG:`, row);
          }
          return {
            id: row.REG || '',
            salesType: row.SALES_TYPE || '',
            listingId: row.LISTING_ID || '',
            listingUrl: row.LISTING_URL || '',
            reg: row.REG || '',
            dateApprovedByCarwow: row.DATE_APPROVED_BY_CARWOW || '',
            make: row.MAKE || '',
            model: row.MODEL || '',
            mileage: row.MILEAGE ? parseInt(row.MILEAGE.replace(/,/g, '')) : 0,
            carAgeYears: row.CAR_AGE_YEARS ? parseInt(row.CAR_AGE_YEARS) : 0,
            firstRegistered: row.FIRST_REGISTERED || '',
            carYear: row.CAR_YEAR ? parseInt(row.CAR_YEAR) : 0,
            capClean: row.CAP_CLEAN ? parseFloat(row.CAP_CLEAN.replace(/,/g, '')) : 0,
            reserveOrBuyNowPrice: row.RESERVE_OR_BUY_NOW_PRICE ? parseFloat(row.RESERVE_OR_BUY_NOW_PRICE.replace(/,/g, '')) : 0,
            previousOwnersCount: row.PREVIOUS_OWNERS_COUNT ? parseInt(row.PREVIOUS_OWNERS_COUNT) : 0,
            conditionGrade: row.CONDITION_GRADE ? parseInt(row.CONDITION_GRADE) : 0,
            serviceHistory: row.SERVICE_HISTORY || '',
            engine: row.ENGINE || '',
            fuelType: row.FUEL_TYPE || '',
            bodycolour: row.BODYCOLOUR || '',
            transmission: row.TRANSMISSION || '',
            sellerNotes: row.SELLER_NOTES || '',
            listingRegion: row.LISTING_REGION || '',
            listingCity: row.LISTING_CITY || '',
            vehicleType: row.VEHICLE_TYPE || '',
            vatApplicable: row.VAT_APPLICABLE || '',
            imported: row.IMPORTED || '',
            status: 'new', // Default status for newly imported cars
          };
        });
        resolve(cars);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const generateSimplifiedCsv = (cars: Car[]): string => {
  const headers = ['VRM', 'MILEAGE', 'SPEC', 'NOTES'];
  const csvContent = [
    headers.join(','),
    ...cars.map(car => [
      car.id || '',
      car.mileage || '',
      '',
      ''
    ].join(','))
  ].join('\n').trim(); // Use trim() to remove any trailing newline
  return csvContent;
};

export const parseFinalCsv = (csvData: string): Promise<Partial<Car>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toUpperCase(),
      complete: (results) => {
        const finalData = results.data.reduce((acc: Partial<Car>[], row: any, index: number) => {
          if (row.VRM && row.MILEAGE) {
            acc.push({
              id: row.VRM.trim(),
              mileage: parseInt(row.MILEAGE) || 0,
              spec: (row.SPEC || '').trim(),
              notes: (row.NOTES || '').trim(),
              retailValuation: row['RETAIL VALUATION'] ? parseFloat(row['RETAIL VALUATION']) : undefined,
              autoTraderRetailRating: row['AUTO TRADER RETAIL RATING'] ? parseInt(row['AUTO TRADER RETAIL RATING']) : undefined,
              daysToSell: row['DAYS TO SELL'] ? parseInt(row['DAYS TO SELL']) : undefined,
            });
          } else {
            console.warn(`Skipping row ${index + 2} due to missing VRM or MILEAGE:`, row);
          }
          return acc;
        }, []);
        resolve(finalData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const combineCarData = (carwowData: Car[], finalData: Partial<Car>[]): Promise<Car[]> => {
  return new Promise((resolve) => {
    const combined = carwowData.map(carwowCar => {
      const finalCar = finalData.find(finalCar => finalCar.id === carwowCar.id);
      if (finalCar) {
        return {
          ...carwowCar,
          ...finalCar,
          mileage: finalCar.mileage || carwowCar.mileage,
          retailValuation: finalCar.retailValuation,
          autoTraderRetailRating: finalCar.autoTraderRetailRating,
          daysToSell: finalCar.daysToSell,
        };
      }
      return carwowCar;
    });
    resolve(combined);
  });
};