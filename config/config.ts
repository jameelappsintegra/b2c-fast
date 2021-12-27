import Cookies from 'js-cookie';

export const b2cTypes = {
  servicing: 'b2c_Servicing',
  tyres: 'b2c_Tyre',
  batteries: 'b2c_Battery',
  // air_conditioning: 'b2c_AirConditioning',
  accessories: 'b2c_Accessories',
};

export const categoryTypesToB2cTypes = {
  ['car-servicing']: b2cTypes.servicing,
  ['Tyres']: b2cTypes.tyres,
  ['Batteries']: b2cTypes.batteries,
  ['Air_Conditioning']: b2cTypes.servicing,
  ['car_care']: b2cTypes.accessories,
};

export const b2cTypesToCategoryTypes = {
  [b2cTypes.servicing]: 'car-servicing',
  [b2cTypes.tyres]: 'Tyres',
  [b2cTypes.batteries]: 'Batteries',
  // [b2cTypes.air_conditioning]: 'Air_Conditioning',
  [b2cTypes.accessories]: 'car_care',
};

export const BASE_URL = '';
export const END_POINT_BFF_KEY = 'bff';
export const END_POINT_MIDDLE_KEY = 'dx';
export const END_POINT_BASE_MIDDLE_KEY = 'dxshort';
export const END_POINT = `${BASE_URL}/${END_POINT_BFF_KEY}/${END_POINT_MIDDLE_KEY}`;
export const END_POINT_CMS = `${BASE_URL}/${END_POINT_BFF_KEY}/${END_POINT_BASE_MIDDLE_KEY}`;
export const BASE_CMS_ENDPOINT = Cookies.get('NEXT_PUBLIC_CMS_API_ENDPOINT');

export const TEST_ENDPOINT = `${END_POINT_CMS}/api/menu/Menu_Vehiclecare&spath=/aftersales_en/home/sharedcontent/Footer/vehicle_care&servicespath=/aftersales_en/home&offerspath=AfterSales_en/Home/Offers`;
export const HERO_PANEL_ENDPOINT = `${END_POINT}/hero_banner_categories&spath=AfterSales_en/Home/Hero_Panel_Category`;
export const HEADER_FOOTER_ENDPOINT = `${END_POINT}/Primary&spath=AfterSales_en/Home&addPath=/aftersales_en/home/sharedcontent/Additional_Links&socialPath=/aftersales_en/home/sharedcontent/Social_Links&vpath=/aftersales_en/home/sharedcontent/Video&valuePath=/aftersales_en/home/sharedcontent/Our_Promise`;
export const HOME_ENDPOINT = `${END_POINT}/Primary&spath=AfterSales_en/Home&addPath=/aftersales_en/home/sharedcontent/Additional_Links&socialPath=/aftersales_en/home/sharedcontent/Social_Links&vpath=/aftersales_en/home/sharedcontent/Video&valuePath=/aftersales_en/home/sharedcontent/Our_Promise`;
export const VEHICLE_CARE_ENDPOINT = `${END_POINT_CMS}/api/menu/Menu_Vehiclecare&spath=/aftersales_en/home/sharedcontent/Footer/vehicle_care&servicespath=/aftersales_en/home&offerspath=AfterSales_en/Home/Offers`;
export const VEHILECARE_ENDPOINT = `${END_POINT_CMS}/api/menu/Menu_Vehiclecare&spath=/aftersales_en/home/sharedcontent/Footer/vehicle_care&servicespath=/aftersales_en/home&offerspath=AfterSales_en/Home/Offers`;
export const OFFERS_ENDPOINT = `${END_POINT}/Offers&spath=AfterSales_en/Home/Offers&categories=`;
export const OFFERS_FILTERED_ENDPOINT = (categoryName: string = '') =>
  `${END_POINT}/Offers&spath=AfterSales_en/Home/Offers&categories=/aftersales_shared/Offers/${categoryName}`;
export const POPULAR_PRODUCTS_ENDPOINT = (
  b2cType: string = '',
  fields: string = '',
  pimCode: string = '',
  pimFamilyCode: string = '',
  filters: any = {},
) => {
  return `${BASE_URL}/${END_POINT_BFF_KEY}/product?q=type=${pimFamilyCode.replace(
    'ff',
    'b2c',
  )}|categories.${pimCode}.level=PARENT&fields=${fields}&sort=attributes.ff_popular=1`;
};
export const PRODUCT_DETAILS_ENDPOINT = (productName: string = '', b2cType: string = '', id: string = '') => {
  return `${BASE_URL}/${END_POINT_BFF_KEY}/product/${id}?q=${b2cType}`;
};
export const FAQS_ENDPOINT = (categoryType: string = '', subTypePimCode: string = '') => {
  return `${BASE_URL}/${END_POINT_BFF_KEY}/${END_POINT_MIDDLE_KEY}/pdp&faqpath=/aftersales_en/home/${categoryType}/categories/&vpath=/aftersales_en/home/${categoryType}/categories/&pimcode=${subTypePimCode}`;
};
export const CREATE_ORDER_ENDPOINT = () => `${BASE_URL}/${END_POINT_BFF_KEY}/order`;
export const UPDATE_ORDER_ENDPOINT = (id: any) => `${BASE_URL}/${END_POINT_BFF_KEY}/order/${id}`;
export const ORDERS_ENDPOINT = (customerId: string = '') => {
  return `${BASE_URL}/${END_POINT_BFF_KEY}/order?q=customerId=${customerId}&sort=createdAt=-1`;
};
export const CANCEL_ORDER_ENDPOINT = (id: string) => `${BASE_URL}/${END_POINT_BFF_KEY}/order/${id}`;
export const PROPERTIES_ENDPOINT = `${END_POINT}/properties`;
export const LOCATION_ENDPOINT = `${END_POINT}/Locations&spath=/aftersales_en/home/sharedcontent/Footer/Locations`;

export const CATEGORY_LANDING_ENDPOINT = `${END_POINT}/clp&spath=/aftersales_en/home/servicing&servicepath=/aftersales_en/home/servicing/services&keypath=/aftersales_en/home/servicing/key_feature_tiles`;
export const SUBSCRIPTION_ENDPOINT = `${BASE_URL}/${END_POINT_BFF_KEY}/leads`;

export const LOCATION_DETAILS_ENDPOINT = (locationName: any = '') =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/dxbase/wps/wcm/connect/aftersales/AfterSales_en/home/sharedcontent/Footer/Locations/${locationName}?&WCM_Page.ResetAll=TRUE&SRV=Page&subtype=json&presentationtemplate=AfterSales_Shared/LocationsDetail`;
export const CHECK_CUSTOMER = `${BASE_URL}/${END_POINT_BFF_KEY}/customer`;
export const CHECK_CUSTOMER_CHECK = `${BASE_URL}/${END_POINT_BFF_KEY}/customer/check`;
export const CHECK_CUSTOMER_GUEST = `${BASE_URL}/${END_POINT_BFF_KEY}/validate-otp`;
export const BLOG_CONTENT_ENDPOINT = (blogName: any = '') =>
  `${END_POINT_CMS}/home/sharedcontent/Footer/vehicle_care/looking_after_your_vehicle/${blogName}?WCM_Page.ResetAll=TRUE&SRV=Page&subtype=json&presentationtemplate=AfterSales_Shared%2Fcontentdetail`;
export const PAYMENT_REQUEST_ENDPOINT = `${BASE_URL}/${END_POINT_BFF_KEY}/payment-requests`;

export const OFFER_DETAILS_ENDPOINT = (offersName: any = '') =>
  `${END_POINT_CMS}/bff/dxshort/home/Offers/${offersName}?&WCM_Page.ResetAll=TRUE&SRV=Page&subtype=json&presentationtemplate=AfterSales_Shared/OfferDetail`;
export const GUEST_SEND_OTP = `${BASE_URL}/${END_POINT_BFF_KEY}/send-otp`;
export const PRIVACY_POLICY_ENDPOINT = `${END_POINT_CMS}/home/sharedcontent/Additional_Links/Privacy_Policy/?subtype=json`;
export const TERMS_CONDITIONS_ENDPOINT = `${END_POINT_CMS}/home/sharedcontent/Additional_Links/terms/?subtype=json`;

export const SLOT_LOCATION_ENDPOINT = (productIds) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/location?productIds=${productIds}`;

export const STOCK_QUANTITY_ENDPOINT = (id: any) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/product?q=id=${id}&fields=id|quantity`;

export const PRODUCT_SERVICE_ENDPOINT = (id: any) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/product/?q=id=${id}&type=b2c_Servicing&fields=attributes.ff_sap_service_time.values.EN as service_time|id|quantity`;
export const PRODUCT_STOCK_ENDPOINT = (id: any) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/product?q=id=${id}&fields=id|quantity`;
export const GET_BOOKING_SLOTS_ENDPOINT = (locationCode: any, tabNumber: any) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/slots/getBookingSlots/${locationCode}/${tabNumber}`;
export const GET_BEST_SUB_SLOT_ENDPOINT = (id: any, capacityRequired: any) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/slots/getBestSubSlot/${id}/${capacityRequired}`;
export const GET_LOCATION_BAY_SUB_SLOT_ENDPOINT = (id: any) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/slots/getLocationBaySubSlot/${id}`;
export const UPDATE_BOOKING_SLOTS_ENDPOINT = (id: any) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/slots/updateBookingSlots/${id}`;

export const POPULAR_PRODUCT_BYCAR = `${BASE_URL}/${END_POINT_BFF_KEY}/product/searchv2`;
export const POPULAR_PRODUCT_BYSIZE = `${BASE_URL}/${END_POINT_BFF_KEY}/findTyre?id=`;
export const POPULAR_PRODUCT_BYWIDTH = `${BASE_URL}/${END_POINT_BFF_KEY}/findTyre/listWidth`;

export const SLOT_AVAILBLITY_ENDPOINT = `${BASE_URL}/${END_POINT_BFF_KEY}/order/verify`;
export const GET_LOCATION_ENDPOINT = (locationId: String) =>
  `${BASE_URL}/${END_POINT_BFF_KEY}/list-of-values?unique=YES&fields=keyValue&q=type=B2C|keyGroup=LOCATION|key=${locationId}`;

export const CHECKOUT_JOURNEY_ENDPOINT = `${BASE_URL}/${END_POINT_BFF_KEY}/dx/checkout&spath=AfterSales_en/Home/shopping_cart/checkout`;
