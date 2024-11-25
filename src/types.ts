export interface Car {
  id: string;
  salesType: string;
  listingId: string;
  listingUrl: string;
  reg: string;
  dateApprovedByCarwow: string;
  make: string;
  model: string;
  mileage: number;
  carAgeYears: number;
  firstRegistered: string;
  carYear: number;
  capClean: string;
  reserveOrBuyNowPrice: string;
  previousOwnersCount: number;
  conditionGrade: number;
  serviceHistory: string;
  engine: string;
  fuelType: string;
  bodycolour: string;
  transmission: string;
  sellerNotes: string;
  listingRegion: string;
  listingCity: string;
  vehicleType: string;
  vatApplicable: string;
  imported: string;
  status?: string;
  description?: string;
  retailValuation?: number;
  autoTraderRetailRating?: number;
  daysToSell?: number;
  liveMarketCondition?: number;
  site?: string;
  notes?: string;
  spec?: string;
}

export interface Column {
  id: string;
  title: string;
  carIds: string[];
}

export interface DragResult {
  destination: {
    droppableId: string;
    index: number;
  } | null;
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
}

export interface BiddingParameters {
  maxPrice: number;
  maxAge: number;
  maxMileage: number;
  minRetailRating: number;
  maxDaysToSell: number;
  maxPreviousOwners: number;
  serviceHistory: string[];
}

export const serviceHistoryOptions = [
  'full_mixed',
  'full_main_dealer',
  'part',
  'none',
  'full_independent',
  'not_due'
];

export interface UserSubscription {
  status: string;
  tier: string;
  currentPeriodEnd: Date | null;
}

export interface User {
  id: string;
  email: string;
  subscription: UserSubscription;
}