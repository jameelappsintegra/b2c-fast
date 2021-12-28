export const STORAGE_ENGINES = {
  SESSION: 'session',
  LOCAL: 'local',
  REDUX: 'redux',
};

export const ROUTES = {
  login: '/login',
  siteSearch: '/siteSearch', // E08 Sketch
  productSearch: '/productSearch', // E09 Sketch
  productSearchResult: '/productSearchResult',
  productDetails: '/productDetail', // E10 Sketch
  productComparisonDetail: '/productComparisonDetail',
  checkoutJourney: '/checkoutJourney',
  account: '/account',
  accountOrders: '/account/orders',
  accountOutstanding: '/account/outstanding',
  accountServiceHistory: '/account/servicehistory',
  accountContract: '/account/contract',
  accountTracking: '/account/tracking',
  accountDetails: '/account/details',
};

export const stepsList = [
  {
    id: 1,
    title: 'Step 1 Basket',
    url: '/',
  },
  {
    id: 2,
    title: 'Step 2 Booking',
    url: '/',
  },
  {
    id: 3,
    title: 'Step 3 Checkout',
    url: '/',
  },
  {
    id: 4,
    title: 'Step 4 Payment',
    url: '/',
  },
  {
    id: 5,
    title: 'Step 5 Confirm order',
    url: '/',
  },
];

export const accountHeaderItemsList = [
  {
    id: 1,
    title: 'Orders',
    path: ROUTES.accountOrders,
  },
  // {
  //   id: 2,
  //   title: 'Outstanding Work',
  //   path: ROUTES.accountOutstanding,
  // },
  // {
  //   id: 3,
  //   title: 'Vehicle Service History',
  //   path: ROUTES.accountServiceHistory,
  // },
  // {
  //   id: 4,
  //   title: 'Contract and plans',
  //   path: ROUTES.accountContract,
  // },
  // {
  //   id: 5,
  //   title: 'Job tracking',
  //   path: ROUTES.accountTracking,
  // },
  {
    id: 6,
    title: 'My details',
    path: ROUTES.accountDetails,
  },
];

const CATEGORY_URL_PREFIX = '/category';
export const GOOGLE_API_KEY = 'AIzaSyBfiUhBQsJ5ZhKUiGWOyQ7z5uiAtXK9cAA';
const PLACEHOLDER_COUNT = 3;
