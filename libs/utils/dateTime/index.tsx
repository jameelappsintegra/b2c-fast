import moment from 'moment';

export const DATE_TIME_FORMATS = {
  fullDate: 'YYYY-MM-DD',
  dayOfMonth: 'Do', // 1st, 2nd, 3rd,...
  dayOfMonthWithoutImmediateZero: 'D', // 1, 2, 3,...
  dayOfMonthWithImmediateZero: 'DD', // 01, 02, 03,...
  monthName: 'MMMM', // January, February, March
  monthNameShort: 'MMM', // Jan, Feb, Mar
  hours: 'HH', // 12, 13, 14
  minute: 'mm', // 12, 23, 59
  fullYear: 'YYYY', // 2021
};

/**
 * Returns formatted datetime
 * @param date date object
 * @param format date format
 */
export const getFormattedDateTime = (date: Date | string, format: string): string => {
  return moment(date).format(format);
};

/**
 * Returns unix number of datetime
 * @param date timestamp
 * @returns unix formatted number
 */
export const getDateTimeUnix = (date: string): number => {
  return moment(date).unix();
};
