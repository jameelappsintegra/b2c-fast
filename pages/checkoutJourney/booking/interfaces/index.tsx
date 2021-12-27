export interface IBayLoadingProps {
  startDate: string;
  endDate: string;
  bayId: string;
  slotId: string;
  totalServiceTime: string;
}
export interface IBookingLocationProps {
  id: number;
  externalCode: string;
  name: string;
  brandId: number;
  city: string;
  district: string;
  postalCode: string;
  streetName: string;
  buildingNumber: string;
  location: string;
  isActive: boolean;
  description: string;
  gpsCoordinate: string;
  value?: string;
}
export interface IWeekDataProps {
  week: IWeekObjProps;
  weekDays: IWeekDay[];
  onClick?: (slot: ISlotProps) => void;
}
export interface IWeekObjProps {
  startDate: string;
  endDate: string;
  weekLabel: string;
  weekNo: number;
}
export interface ITimeSlotsOnlyProps {
  startTime: string;
  endTime: string;
  externalCode: number;
  sequence: number;
}

export interface IDateObj {
  day: string;
  year: string;
  month: string;
  date: string;
}
export interface IBookingDetailsProps {
  startTime?: string;
  endTime?: string;
  logistics?: string;
  location?: IBookingLocationProps;
  date?: string;
  selectedSlot?: ISlotProps;
  selectedSlotHash?: ISlotHashProps;
  defaultTab?: number;
}
export interface IWeekDay {
  dateObj: IDateObj;
  slots: ISlotProps[];
}

export interface ISlotProps {
  bayId: number;
  bayNo: string;
  date: string;
  endTime: string;
  isLast: number;
  maxOverFlowTime: string;
  sequence: number;
  slotId: number;
  startTime: string;
  status: string;
  used: string;
  slotHash?: string;
  startDate?: string;
  endDate?: string;
  fullDate?: string;
  recentSlotHash?: string;
  locationCode?: string;
  bayNumber?: number;
}
export interface ISlotHashProps {
  weekIndex: number;
  weekDayIndex: number;
  slotIndex: number;
}

export default () => {
  return 'show page';
};
