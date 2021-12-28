import { BrowserRouter as Router } from 'react-router-dom';
import TagManager from 'react-gtm-module';
import IBilingual from 'components/common/models/bilingual';
import defaultThumb from '../../../images/placeholder.jpg';
import {
  NOT_AVAILABLE,
  AUTH_LOCAL_DATA,
  SUB_CATEGORY_TYPE_TYRE,
  SUB_CATEGORY_TYPE_BATTERY,
  PRODUCT_DETAIL_URL_PREFIX,
} from '../constants';
import { getLocalData } from '../../../libs/utils/localStorage';
import { getUserVehicleData } from '../../../libs/utils/storage';
import { IClassificationTypeProps } from '../../../libs/utils/gtm';
import { useRouter } from 'next/router';

const ENG_CODE = 'EN';
const AR_CODE = 'AR';
type ILanguageTypes = typeof ENG_CODE | typeof AR_CODE;
export let globalLanguage: ILanguageTypes = ENG_CODE;
export const PRICE_TYPE_RETAIL: string = 'retail';
export const PRICE_TYPE_SPECIAL: string = 'special';

export const SLOT_STATUS_AVAILABLE: string = 'Available';
export const SLOT_STATUS_UNAVAILABLE: string = 'Un-Available';
export const SLOT_STATUS_BOOKED: string = 'Booked';
export const SLOT_STATUS_SELECTED: string = 'Selected';
export interface IFormattedPriceProps {
  formattedPrice: string;
  price: number;
}

export const viewportWidth = 1536; /*window.innerWidth*/
export interface IInventoryProps {
  quantity: number;
  unitOfMeasure: string;
}

let category: string = '';

/**
 * Retruns product price based on product type i.e. retail/special
 * @param price product price array of objects
 * @param type price type in lowercase i.e. retail/special
 */
export const getProductPrice = (priceArr: any[], type: string): IFormattedPriceProps => {
  let price: number = 0;
  let found: any | undefined;
  let formattedPrice: string = '';

  if (priceArr.length) {
    found = priceArr.find((item) => item.priceType?.toLowerCase() === type);
  }
  if (found) {
    price = found.price;
    formattedPrice = getCurrencyFormatttedPrice(price, found.currencyCode ? found.currencyCode : '');
  }
  return {
    formattedPrice,
    price,
  };
};

/**
 * Retruns product inventory and unit of measure
 * Index 0 is hard coded for the time being
 * @param price product price array of objects
 * @param type price type in lowercase i.e. retail/special
 */
export const getProductInventory = (inventoryArr: IInventoryProps[]): IInventoryProps => {
  let inventory = {
    quantity: 0,
    unitOfMeasure: '',
  };
  if (inventoryArr.length) {
    inventory = {
      quantity: inventoryArr[0].quantity,
      unitOfMeasure: inventoryArr[0].unitOfMeasure,
    };
  }
  return inventory;
};

/**
 * Currency formatter
 * @param currencyValue
 * @param currencyCode
 */
export const getCurrencyFormatttedPrice = (currencyValue: any = 0, currencyCode: string = ''): string => {
  return `${currencyCode} ${parseFloat(currencyValue)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
};

export const getBilingualValue = (arr: IBilingual[] = []): string | '' => {
  let val: IBilingual | undefined = {} as IBilingual;
  if (arr.length) {
    val = arr.find(
      (item) =>
        (typeof item?.language === 'object' && item?.language?.code === globalLanguage) ||
        (typeof item.language === 'string' && item.language === globalLanguage),
    );
  }
  return val?.value ? val.value : NOT_AVAILABLE;
};

/**
 * Returns product quantity/stepper options
 * @param quantity
 */
export const getQuantityOptions = (quantity: number = 10): any[] => {
  let count = 1;
  const options: any = [];
  while (count <= quantity) {
    options.push({
      name: count.toString(),
      value: count.toString(),
    });
    // tslint:disable-next-line: no-increment-decrement
    count++;
  }

  return options;
};

export const useQuery = () => new URLSearchParams(window.location.search);

/**
 * NOTE: _isEqual takes old and new category objects and recursively compares
 * keys. If a key is present in old object and not in new object, false is
 * returned.
 */
export const _isEqual = (oldObject: any, newObject: any): boolean => {
  if (oldObject && newObject) {
    for (const key in oldObject) {
      if (key in newObject) {
        if (key !== 'subCategories') {
          if (Array.isArray(oldObject[key]) && Array.isArray(newObject[key])) {
            // tslint:disable-next-line: no-increment-decrement
            for (let i = 0; i < oldObject[key].length; i++) {
              if (!_isEqual(oldObject[key][i], newObject[key][i])) {
                return false;
              }
            }
          } else if (typeof oldObject[key] === 'object' && typeof newObject[key] === 'object') {
            _isEqual(oldObject[key], newObject[key]);
          } else if (oldObject[key] !== newObject[key]) {
            return false;
          }
        }
      } else return false;
    }
  }
  return true;
};

/**
 * Page scroll to 0. Function body implemented in useEffect hook already
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'auto' });
};

/**
 * Remove property from an object
 * @param obj
 * @param prop property to be removed
 */
export const removePropFromObj = (obj: any, prop: string) => {
  if (obj.hasOwnProperty(prop)) delete obj[prop];
  return obj;
};

/**
 * Returns Customer name(Full/First) from localStorage
 */
export const getCustomerName = (isFirstName = false) => {
  let name: string = '';

  let loggedInUserData: any = getLocalData(AUTH_LOCAL_DATA);

  if (loggedInUserData) {
    loggedInUserData = JSON.parse(loggedInUserData);
    if (isFirstName) {
      name = `${loggedInUserData.customerFirstName}`;
    } else {
      name = `${loggedInUserData.customerFirstName}` + ` ${loggedInUserData.customerLastName}`;
    }
  }
  return name;
};

/**
 * Returns URL search params in the form of object
 * @param query URLSearchParams
 */
export const getQueryStringParams = (query: any = '') => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params: any, param: any) => {
        // tslint:disable-next-line: ter-indent
        const [key, value] = param.split('=');
        // tslint:disable-next-line: ter-indent
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        // tslint:disable-next-line: ter-indent
        return params;
        // tslint:disable-next-line: ter-indent
      }, {})
    : {};
};

export const pathTodefaultImageThumb = '/images/placeholder.jpg';

/**
 * Fallback image. Default image to be displayed if image path is broken
 * @param event
 */
export const defaultImageThumb = (event: any) => {
  return (event.target.src = defaultThumb);
};

/**
 * Fallback image. Default image src to be displayed if image path is broken
 * @param event
 */
export const defaultImageThumbSrc = (event: any) => {
  return (event.target.src = defaultThumb?.src ? defaultThumb?.src : defaultThumb);
};

/**
 * Toggle bilingual in whole app
 *
 */
export const toggleBilingual = (e: React.MouseEvent<HTMLElement>, router: any): void => {
  e.preventDefault();
  // globalLanguage = globalLanguage === ENG_CODE ? (globalLanguage = AR_CODE) : (globalLanguage = ENG_CODE);
  router.locale === 'ar'
    ? (window.location.href = `/${ENG_CODE}${router.asPath}`)
    : (window.location.href = `/${AR_CODE}${router.asPath}`);
};

/**
 * Capitalize first letter
 *
 */
export const capitalizeFirstLetter = (str: string = ''): string => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};

/**
 * @param key sorted by `key`
 * @param order ascending order by default
 * @returns array is sorted by `key`, in ascending or descending order
 */
export const compareValues = (key: string, order = 'asc') => {
  return function innerSort(a: any, b: any) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === 'string' ? a[key]?.toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key]?.toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
};

/**
 * Extract message from messages array provided by api response
 * @param key sorted by `key`
 * @returns message as string
 */
export const getRespMessage = (messages: any[]): string => {
  let message = '';
  if (typeof messages === 'object') {
    message = messages[0]?.message;
  }
  return message;
};

/**
 * Returns product quantity/stepper options
 * @param quantity
 */

/**
 * Return Category fromo the URL
 * @param URL
 */
export const getCategoryFromURL = () => {
  if (window.location.pathname.split('/')[1] !== PRODUCT_DETAIL_URL_PREFIX.replace('/', '')) {
    category = window.location.pathname;
  }

  return category;
};

/**
 * Converts a string into Title Case which can be used as a Heading (removing all special characters like &, -, _, etc.)
 * @param str
 * @author "Ahsan Akhtar"
 */
export const toTitleHeadCase = (str: string = ''): string => {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|\/|\-|\_)\w/g, (match) => {
      return match.toUpperCase();
    })
    ?.split('_')
    ?.join(' ')
    ?.split('-')
    ?.join(' ')
    ?.replace(/&amp;/gi, '&');
};

export const camelToTitleCase = (str: string = '') => {
  return (
    str
      ?.replace(/([A-Z])/g, (match) => ` ${match}`)
      ?.replace(/^./, (match) => match.toUpperCase())
      ?.trim() ??
    str ??
    ''
  );
};

export const getProductVariant = (attributes: any[], type: string) => {
  let variant: string = '';
  if (type === SUB_CATEGORY_TYPE_BATTERY) {
    const cca: any = attributes.find(({ code }) => code === 'ff_cca') || ({} as any);
    const voltage: any = attributes.find(({ code }) => code === 'ff_voltage') || ({} as any);

    const ccaValue: string = getBilingualValue(cca.values || []);
    const voltageValue: string = getBilingualValue(voltage.values || []);

    variant = variant.concat(voltageValue, '/', ccaValue);
  } else if (type === SUB_CATEGORY_TYPE_TYRE) {
    const width: any = attributes.find(({ code }) => code === 'ff_sap_width') || ({} as any);
    const profile: any = attributes.find(({ code }) => code === 'ff_sap_profile') || ({} as any);
    const rim: any = attributes.find(({ code }) => code === 'ff_sap_rim') || ({} as any);
    const speedRating: any = attributes.find(({ code }) => code === 'ff_sap_speed_rating') || ({} as any);

    const widthValue: string = getBilingualValue(width.values || []);
    const profileValue: string = getBilingualValue(profile.values || []);
    const rimValue: string = getBilingualValue(rim.values || []);
    const speedRatingValue: string = getBilingualValue(speedRating.values || []);

    variant = variant.concat(widthValue, '/', profileValue, '/', rimValue, '/', speedRatingValue);
  }

  return variant;
};

/**
 * Dimensions should be set on every hit sent to Google Analytics
 * @param classification
 */
export const getGlobalEventTrigger = (classification: IClassificationTypeProps) => {
  let loggedUserData: any = getLocalData(AUTH_LOCAL_DATA);
  loggedUserData = JSON.parse(loggedUserData);
  const isUserLoggedIn = loggedUserData?.isLoggedIn || false;

  const carFormSelectedData: any = getUserVehicleData();
  const timeStamp: string = Date().toLocaleString();

  TagManager.dataLayer({
    dataLayer: {
      event: 'global',
      page_details: {
        classification,
        sessionId: '',
        timestamp: timeStamp,
        environment: 'live',
        language: 'en',
      },
      user_details: {
        login: isUserLoggedIn,
        userId: loggedUserData?.customerId || '',
        AlfuttaimId: loggedUserData?.customerCode || '',
      },
      vehicle_details: {
        make: carFormSelectedData?.make?.label || '',
        model: carFormSelectedData?.model?.label || '',
        year: carFormSelectedData?.year?.label || '',
        variant: carFormSelectedData?.variant?.label || '',
      },
    },
  });
};

// It will be remove once it all set in Strapi Temporary used this approach
// ============================== Start =======================================
/**
 * Return Category fromo the URL
 * @param attributes
 * @param type
 */

// ============================== End =======================================

/**
 *
 * @param discountedAmount
 * @param totalAmount
 */
export const getDiscountPercentage = (discountedAmount: number, totalAmount: number) => {
  let discountPercentage: string = '';
  discountPercentage = ((discountedAmount / totalAmount) * 100).toFixed(2);
  return discountPercentage;
};
