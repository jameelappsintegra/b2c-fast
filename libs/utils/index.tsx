/**
 * Finds if the object is present in the provided array
 * @param obj object to find
 * @param arr array into object is to be searched
 */
export const containsObject = (obj: any, arr: any) => {
  let i;
  // tslint:disable-next-line: no-increment-decrement
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === obj) {
      return true;
    }
  }

  return false;
};

/**
 * Finds if the object is present in the provided array based on provided key
 * @param obj object to find
 * @param arr array into object is to be searched
 * @param key key to be matched against
 */
export const objectExists = (obj: any, arr: any, key: string) => {
  const found = arr.find((item: any) => item[key] === obj[key]);

  return !!found;
};

/**
 * Finds if the object is present in the provided array based on provided key
 * @param obj object to find
 * @param arr array into object is to be searched
 * @param key key to be matched against
 */
export const findIndexInArray = (obj: any, arr: any, key: string) => {
  const index = arr.findIndex((item: any) => item[key] === obj[key]);

  return index || null;
};

/**
 * Returns object based on the key and value match in array of object
 * @param value where value will match that object will be returned
 * @param arr array into object is to be searched
 * @param key key to be matched against
 */
export const findObjectInArray = (arr: any, key: string, value: any) => {
  const obj = (arr || []).find((obj: any) => obj[key]?.toLowerCase() === value?.toLowerCase());
  return obj ? obj : {};
};
