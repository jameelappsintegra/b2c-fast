const AZURE_LOGIN_URL =
  'https://alfuttaimgroupb2cdev.b2clogin.com/alfuttaimgroupb2cdev.onmicrosoft.com/B2C_1A_AFG_signinRopc/oauth2/v2.0/token';
const AZURE_PASSWORD_RESET_URL =
  'https://alfuttaimgroupb2cdev.b2clogin.com/alfuttaimgroupb2cdev.onmicrosoft.com/B2C_1A_AFG_PasswordReset';
const DEV_B2C = 'https://aeqab2c.corp.al-futtaim.com';
const BASE_URL = '/bff';
// const BASE_URL = `${DEV_B2C}/bff`;
// console.log(process.env.BASE);
// const BASE_URL = (process.env.BASE as string) + BASE_ROUTE;
// console.log(BASE_URL);
const AUTH_LOCAL_DATA = 'X_AUTH_DATA';
const LOGO_URL = 'https://autob2cdevstr.blob.core.windows.net/images/logo.png';
const GOOGLE_API_KEY = 'AIzaSyBfiUhBQsJ5ZhKUiGWOyQ7z5uiAtXK9cAA';

// These url are used as prefix in corresponding pages
const CATEGORY_URL_PREFIX = '/category';
const PARODUCT_URL_PREFIX = '/products';
const PRODUCT_DETAIL_URL_PREFIX = '/productDetail';
const BLOG_URL_PREFIX = '/blog';

const CUSTOMER_ID = 'cust123';
const NOT_AVAILABLE = 'Not Available';

/**
 * API success message status code
 */
const SUCCESS_STATUS = 'S';

/**
 * API error message status code
 */
const SUCCESS_ERROR = 'E';

const ORG_ID = '2195';
const LOB_ID = 'AUTO';
const CATEGORY_TYPE_SERVICE = 'service';
const CATEGORY_TYPE_PRODUCT = 'product';
const ORDER_STATUS_PENDING = 'Pending';

const ORDER_STATUS_ORDER_CREATED = 'C';
const ORDER_STATUS_ORDER_UPDATED = 'U';
const ORDER_STATUS_DRAFT = 'Draft';
const ORDER_STATUS_FAILED = 'Failed';

const ORDER_STATUS_CONFIRMED = 'Order Confirmed';
const ORDER_STATUS_CANCEL = 'R';
const ORDER_STATUS_IN_PROGRESS = 'Order in Progress';
const ORDER_STATUS_WAINTINGFORSERVICE = 'Waiting for Service';
const ORDER_STATUS_WORKINPROGRESS = 'Work in Progress';
const ORDER_STATUS_READYFORCOLLECTION = 'Ready for Collection';
const ORDER_STATUS_INVOICED = 'Invoiced';
const ORDER_STATUS_CLOSED = 'Closed';

const SUB_CATEGORY_TYPE_TYRE = 'tyre';
const SUB_CATEGORY_TYPE_BATTERY = 'battery';
const CHECKBOX_SMS_LABEL = 'SMS';
const CHECKBOX_EMAIL_LABEL = 'Email';
const PAYMENT_TYPE_ONLINE = 'online';
const PAYMENT_TYPE_GARAGE = 'payAtGarage';
const DEFAULT_CURRENCY = 'AED';

/**
 * Name/key for phone number input field
 */
const INPUT_PHONE_NUMBER = 'phoneNumBer';

/**
 * HTTP STATUS COES
 */
const UN_AUTHORIZED = 401;
const UN_PROCESSABLE_ENTITY = 422;
const CONFLICT = 409;
/**
 * Default no of placeholder count displayed for product comparison
 */
const PLACEHOLDER_COUNT = 3;
const NOTIFICATION_VISIBILITY_TIME = 5000;
const TITLE_OPTIONS = [
  {
    name: 'Mr.',
    value: 'MR',
  },
  {
    name: 'Mrs.',
    value: 'MRS',
  },
  {
    name: 'Ms.',
    value: 'MS',
  },
];

/**
 * This options list is mapped against Emirates and State dropdowns
 */
const EMIRATES_OPTIONS = [
  {
    name: 'Abu Dhabi City',
    value: 'AD1',
  },
  {
    name: 'Al Ain City',
    value: 'AD2',
  },
  {
    name: 'Liwa Area',
    value: 'AD3',
  },
  {
    name: 'Al Ruwais Area',
    value: 'AD4',
  },
  {
    name: 'ABD General HQ',
    value: 'AD5',
  },
  {
    name: 'Habshan Area',
    value: 'AD6',
  },
  {
    name: 'Ajman',
    value: 'AJM',
  },
  {
    name: 'Dubai City',
    value: 'DB1',
  },
  {
    name: 'Jebel Ali',
    value: 'DB2',
  },
  {
    name: 'Hatta',
    value: 'DB3',
  },
  {
    name: 'Free Zone',
    value: 'FRZ',
  },
  {
    name: 'Fujeirah',
    value: 'FUJ',
  },
  {
    name: 'Gated Freezone',
    value: 'GFZ',
  },
  {
    name: 'Khor Fakkan',
    value: 'KFK',
  },

  {
    name: 'Ras Al Khaimah',
    value: 'RAK',
  },
  {
    name: 'Sharjah City',
    value: 'SH1',
  },
  {
    name: 'Dhaid',
    value: 'SH2',
  },
  {
    name: 'Umm Al Quwain',
    value: 'UAQ',
  },
];

/* Viewport Breakpoints */
const VIEWPORT_BREAKPOINTS = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1500,
};

export {
  ORG_ID,
  LOB_ID,
  DEV_B2C,
  LOGO_URL,
  BASE_URL,
  CUSTOMER_ID,
  NOT_AVAILABLE,
  SUCCESS_STATUS,
  AZURE_LOGIN_URL,
  AUTH_LOCAL_DATA,
  ORDER_STATUS_PENDING,
  CATEGORY_TYPE_SERVICE,
  ORDER_STATUS_CLOSED,
  ORDER_STATUS_INVOICED,
  ORDER_STATUS_FAILED,
  CATEGORY_TYPE_PRODUCT,
  CATEGORY_URL_PREFIX,
  PARODUCT_URL_PREFIX,
  AZURE_PASSWORD_RESET_URL,
  PRODUCT_DETAIL_URL_PREFIX,
  SUB_CATEGORY_TYPE_TYRE,
  SUB_CATEGORY_TYPE_BATTERY,
  PLACEHOLDER_COUNT,
  NOTIFICATION_VISIBILITY_TIME,
  TITLE_OPTIONS,
  EMIRATES_OPTIONS,
  VIEWPORT_BREAKPOINTS,
  CHECKBOX_SMS_LABEL,
  CHECKBOX_EMAIL_LABEL,
  PAYMENT_TYPE_ONLINE,
  PAYMENT_TYPE_GARAGE,
  DEFAULT_CURRENCY,
  UN_AUTHORIZED,
  UN_PROCESSABLE_ENTITY,
  ORDER_STATUS_ORDER_CREATED,
  CONFLICT,
  SUCCESS_ERROR,
  BLOG_URL_PREFIX,
  GOOGLE_API_KEY,
  INPUT_PHONE_NUMBER,
  ORDER_STATUS_DRAFT,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_CANCEL,
  ORDER_STATUS_IN_PROGRESS,
  ORDER_STATUS_WAINTINGFORSERVICE,
  ORDER_STATUS_WORKINPROGRESS,
  ORDER_STATUS_READYFORCOLLECTION,
  ORDER_STATUS_ORDER_UPDATED,
};
