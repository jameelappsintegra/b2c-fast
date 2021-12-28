import { getSessionData, storeSessionData } from './sessionStorage';

const SESSION_STORAGE_KEYS = {
  vehicleForm: 'vehicleForm',
  userVehicleData: 'userVehicleData',
};

export const setVehicleForm = (value: any) => {
  storeSessionData(SESSION_STORAGE_KEYS.vehicleForm, JSON.stringify(value));
};

export const getVehicleForm = () => {
  const vehicleForm: any = getSessionData(SESSION_STORAGE_KEYS.vehicleForm);
  return JSON.parse(vehicleForm);
};

export const setUserVehicleData = (value: any) => {
  storeSessionData(SESSION_STORAGE_KEYS.userVehicleData, JSON.stringify(value));
};

export const getUserVehicleData = () => {
  // const userVehicleData: any = getSessionData(SESSION_STORAGE_KEYS.userVehicleData);
  const userVehicleData: any = [{}];
  // return JSON.parse(userVehicleData);
  return userVehicleData;
};
