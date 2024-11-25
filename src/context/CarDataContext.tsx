import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Car } from '../types';

interface CarDataContextType {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  getCarById: (id: string) => Car | undefined;
  getCarsByMake: (make: string) => Car[];
  getCarsByYear: (year: number) => Car[];
  getCarsByPriceRange: (min: number, max: number) => Car[];
  updateCar: (id: string, updates: Partial<Car>) => void;
}

const CarDataContext = createContext<CarDataContextType | undefined>(undefined);

export const useCarData = () => {
  const context = useContext(CarDataContext);
  if (!context) {
    throw new Error('useCarData must be used within a CarDataProvider');
  }
  return context;
};

export const CarDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);

  const getCarById = (id: string) => cars.find(car => car.id === id);

  const getCarsByMake = (make: string) => cars.filter(car => car.make === make);

  const getCarsByYear = (year: number) => cars.filter(car => car.year === year);

  const getCarsByPriceRange = (min: number, max: number) => 
    cars.filter(car => car.price >= min && car.price <= max);

  const updateCar = (id: string, updates: Partial<Car>) => {
    setCars(prevCars => prevCars.map(car => 
      car.id === id ? { ...car, ...updates } : car
    ));
  };

  return (
    <CarDataContext.Provider value={{
      cars,
      setCars,
      getCarById,
      getCarsByMake,
      getCarsByYear,
      getCarsByPriceRange,
      updateCar
    }}>
      {children}
    </CarDataContext.Provider>
  );
};