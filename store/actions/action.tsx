import {
  CATEGORY_CONTENT_TYPE,
  HEADER_FOOTER_CONTENT,
  ISetCompareItemsProps,
  REMOVE_COMPARABLE_ITEMS,
  SET_COMPARABLE_ITEMS,
  VEHICLE_CARE_CONTENT,
  CHECK_CUSTOMER,
} from './types';

export function headerFooter(data: any) {
  return {
    type: HEADER_FOOTER_CONTENT,
    payload: data,
  };
}

export function vehicleCare(data: any) {
  return {
    type: VEHICLE_CARE_CONTENT,
    payload: data,
  };
}
export function categoryContent(data: any) {
  return {
    type: CATEGORY_CONTENT_TYPE,
    payload: data,
  };
}

export const setCompareItems = (payload: ISetCompareItemsProps) => ({
  payload,
  type: SET_COMPARABLE_ITEMS,
});

export const removeCompareItems = (payload: ISetCompareItemsProps) => ({
  payload,
  type: REMOVE_COMPARABLE_ITEMS,
});
export function checkCustomer(data) {
  return {
    type: CHECK_CUSTOMER,
    payload: data,
  };
}
