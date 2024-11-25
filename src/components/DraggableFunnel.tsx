import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Car, Column, BiddingParameters } from '../types';
import ErrorBoundary from './ErrorBoundary';
import { useCarData } from '../context/CarDataContext';
import ParameterSettings from './ParameterSettings';
import BidFunnel from './BidFunnel';
import VehicleList from './VehicleList';
import LoadingIndicator from './LoadingIndicator';

interface DraggableFunnelProps {
  updateCarWonPrice: (carId: string, wonPrice: number) => void;
  updateColumns: (newColumns: Column[]) => void;
  parameters: BiddingParameters;
  onParametersChange: (newParameters: BiddingParameters) => void;
}

const DraggableFunnel: React.FC<DraggableFunnelProps> = ({ 
  updateCarWonPrice,
  updateColumns,
  parameters,
  onParametersChange
}) => {
  const { cars, setCars } = useCarData();
  const [isLoading, setIsLoading] = useState(false);

  const isCarQualified = useCallback((car: Car) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - (car.carYear || currentYear);
    const price = parseFloat(car.reserveOrBuyNowPrice) || 0;
    return (
      price <= parameters.maxPrice &&
      age <= parameters.maxAge &&
      (car.mileage || 0) <= parameters.maxMileage &&
      (car.autoTraderRetailRating || 0) >= parameters.minRetailRating &&
      (car.daysToSell || 0) <= parameters.maxDaysToSell &&
      (car.previousOwnersCount || 0) <= parameters.maxPreviousOwners &&
      parameters.serviceHistory.includes(car.serviceHistory || '')
    );
  }, [parameters]);

  const { qualifiedCars, bidCars, noBidCars, wonCars, lostCars } = useMemo(() => {
    setIsLoading(true);
    const qualified: Car[] = [];
    const bid: Car[] = [];
    const noBid: Car[] = [];
    const won: Car[] = [];
    const lost: Car[] = [];

    cars.forEach(car => {
      switch (car.status) {
        case 'bid':
          bid.push(car);
          break;
        case 'noBid':
          noBid.push(car);
          break;
        case 'won':
          won.push(car);
          break;
        case 'lost':
          lost.push(car);
          break;
        default:
          if (isCarQualified(car)) {
            qualified.push(car);
          }
      }
    });

    setIsLoading(false);
    return { qualifiedCars: qualified, bidCars: bid, noBidCars: noBid, wonCars: won, lostCars: lost };
  }, [cars, isCarQualified]);

  useEffect(() => {
    const updatedCars = cars.map(car => {
      if (car.status === 'bid' || car.status === 'noBid' || car.status === 'won' || car.status === 'lost') {
        return car;
      }
      const newStatus = isCarQualified(car) ? 'qualified' : 'hidden';
      return { ...car, status: newStatus };
    });
    
    if (JSON.stringify(updatedCars) !== JSON.stringify(cars)) {
      setCars(updatedCars);
    }
  }, [parameters, isCarQualified, setCars, cars]);

  const handleParametersChange = useCallback((newParameters: BiddingParameters) => {
    onParametersChange(newParameters);
  }, [onParametersChange]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as 'qualified' | 'bid' | 'noBid' | 'won' | 'lost';

    setCars(prevCars => prevCars.map(car => 
      car.id === draggableId ? { ...car, status: newStatus } : car
    ));

    const newColumns: Column[] = [
      { id: 'qualified', title: 'Qualified', carIds: qualifiedCars.map(car => car.id) },
      { id: 'bid', title: 'Bid', carIds: bidCars.map(car => car.id) },
      { id: 'noBid', title: 'No Bid', carIds: noBidCars.map(car => car.id) },
      { id: 'won', title: 'Won', carIds: wonCars.map(car => car.id) },
      { id: 'lost', title: 'Lost', carIds: lostCars.map(car => car.id) },
    ];

    updateColumns(newColumns);
  }, [qualifiedCars, bidCars, noBidCars, wonCars, lostCars, setCars, updateColumns]);

  const handleBidPlaced = useCallback((carId: string) => {
    setCars(prevCars => prevCars.map(car => 
      car.id === carId ? { ...car, status: 'bid' } : car
    ));
  }, [setCars]);

  const handleMarkAsNoBid = useCallback((carId: string) => {
    setCars(prevCars => prevCars.map(car => 
      car.id === carId ? { ...car, status: 'noBid' } : car
    ));
  }, [setCars]);

  const handleMarkAsWon = useCallback((carId: string, wonAmount: number) => {
    setCars(prevCars => prevCars.map(car => 
      car.id === carId ? { ...car, status: 'won', wonPrice: wonAmount } : car
    ));
    updateCarWonPrice(carId, wonAmount);
  }, [setCars, updateCarWonPrice]);

  const handleMarkAsLost = useCallback((carId: string) => {
    setCars(prevCars => prevCars.map(car => 
      car.id === carId ? { ...car, status: 'lost' } : car
    ));
  }, [setCars]);

  const handleMarkAllAsLost = useCallback(() => {
    setCars(prevCars => prevCars.map(car => 
      car.status === 'bid' ? { ...car, status: 'lost' } : car
    ));
  }, [setCars]);

  return (
    <ErrorBoundary>
      <ParameterSettings onParametersChange={handleParametersChange} initialParameters={parameters} />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <BidFunnel
            qualifiedCars={qualifiedCars}
            bidCars={bidCars}
            noBidCars={noBidCars}
            wonCars={wonCars}
            lostCars={lostCars}
            onDragEnd={onDragEnd}
            onBidPlaced={handleBidPlaced}
            onMarkAsNoBid={handleMarkAsNoBid}
            onMarkAsWon={handleMarkAsWon}
            onMarkAsLost={handleMarkAsLost}
            onMarkAllAsLost={handleMarkAllAsLost}
          />
          <VehicleList cars={[...qualifiedCars, ...bidCars, ...noBidCars, ...wonCars, ...lostCars]} />
        </DragDropContext>
      )}
    </ErrorBoundary>
  );
};

export default React.memo(DraggableFunnel);