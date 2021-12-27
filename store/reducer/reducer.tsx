import { storeLocalData } from 'libs/utils/localStorage';
import { IBookingDetailsProps } from 'pages/checkoutJourney/booking/interfaces';
import * as actionTypes from '../actions/types';
const initialState = {
  headerFooterContent: {},
  locationContent: {},
  vehicleCareContent: {},
  blogContent: null,
  offersSectionContent: null,
  offersSectionFilteredContent: null,
  categoryContentType: {},
  locationDetailsContent: {},
  popularProductsContent: {},
  bookingDetails: {} as IBookingDetailsProps,
  activeStep: 1,
  weekSlots: [],
  bookingData: {},
  bookingControls: {},
  orderDetails: {},
  personalDetails: {},
  addressDetails: {},
  preferencesDetails: {},
  itemsCount: 0,
  cartItems: {},
  bookingTimeSlotsOnly: [],
  bookingLocations: [],
  paymentType: '',
  isCheckoutValid: false,
  productDetailsContent: {},
  faqsContent: {},
  ordersContent: [],
  paymenRequestContent: {},
  offerDetailsContent: {},
  brandDetailsContent: {},
  slotLocationContent: {},
  stockQuantityContent: {},
  productServiceTime: {},
  serviceSlotContent: {},
  getSlotContent: {},
  getbaySubslotContent: {},
  getBaySubslotContent: {},
  getOrder: {},
  getServiceLocation: {},
  productStock: {},
  chekoutJourneyContent: {},
}; // Initial state of the Store

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.HEADER_FOOTER_CONTENT:
      return {
        ...state,
        headerFooterContent: {
          ...action.payload,
        },
      };
    case actionTypes.LOCATION_CONTENT:
      return {
        ...state,
        locationContent: {
          ...action.payload,
        },
      };
    case actionTypes.VEHICLE_CARE_CONTENT:
      return {
        ...state,
        vehicleCareContent: {
          ...action.payload,
        },
      };
    case actionTypes.BLOG_CONTENT:
      return {
        ...state,
        blogContent: {
          ...action.payload,
        },
      };
    case actionTypes.TERMS_CONDITIONS:
      return {
        ...state,
        termsConditionContent: {
          ...action.payload,
        },
      };
    case actionTypes.PRIVACY_POLICY:
      return {
        ...state,
        privacyPolicyContent: {
          ...action.payload,
        },
      };
    case actionTypes.HERO_PANEL_CONTENT:
      return {
        ...state,
        heroPanelContent: {
          ...action.payload,
        },
      };
    case actionTypes.OFFERS_SECTION_CONTENT:
      return {
        ...state,
        offersSectionContent: {
          ...action.payload,
        },
      };
    case actionTypes.LOCATION_DETAILS_CONTENT:
      return {
        ...state,
        locationDetailsContent: {
          ...action.payload,
        },
      };
    case actionTypes.OFFERS_SECTION_FILTERED_CONTENT:
      return {
        ...state,
        offersSectionFilteredContent: {
          ...action.payload,
        },
      };
    case actionTypes.POPULAR_PRODUCTS_CONTENT:
      return {
        ...state,
        popularProductsContent: [...action.payload],
      };
    case actionTypes.PRODUCT_DETAILS_CONTENT:
      return {
        ...state,
        productDetailsContent: {
          ...action.payload,
        },
      };
    case actionTypes.FAQS_CONTENT:
      return {
        ...state,
        faqsContent: {
          ...action.payload,
        },
      };
    case actionTypes.ORDERS_CONTENT:
      return {
        ...state,
        ordersContent: [...action.payload],
      };
    case actionTypes.CATEGORY_CONTENT_TYPE:
      return {
        ...state,
        categoryContentType: {
          ...action.payload,
        },
      };
    case actionTypes.SET_COMPARABLE_ITEMS:
      return {
        ...state,
        ISetCompareItemsProps: {
          ...action.payload,
        },
      };
    case actionTypes.REMOVE_COMPARABLE_ITEMS:
      return {
        ...state,
        ISetCompareItemsProps: {
          ...action.payload,
        },
      };
    case actionTypes.CHECKOUT_JOURNEY:
      return {
        ...state,
        bookingDetails: {
          ...action.payload,
        },
        personalDetails: {
          ...action.payload,
        },
        addressDetails: {
          ...action.payload,
        },
        preferencesDetails: {
          ...action.payload,
        },
        bookingControls: {
          ...action.payload,
        },
        cartitems: {
          ...action.payload,
        },
        itemsCount: action?.payload?.itemsCount,
        paymentType: '',
        activeStep: 1,
      };
    case actionTypes.SET_ACTIVE_STEP:
      // console.log(action.payload, 'action payload');
      storeLocalData('afg-activeStep', JSON.stringify(action.payload));
      return { ...state, activeStep: action.payload };
    case actionTypes.SET_BOOKING_DETAILS:
      // storeLocalData('afg-bookingDetails', JSON.stringify(action.payload));
      if (Object.entries(action.payload)?.length) {
        return {
          ...state,
          bookingDetails: { ...state.bookingDetails, ...action.payload },
        };
      }
      return {
        ...state,
        bookingDetails: action.payload,
      };

    case actionTypes.CHECK_CUSTOMER:
      return {
        ...state,
        checkCustomer: action.payload,
      };
    case actionTypes.PAYMENT_REQUEST_CONTENT:
      return {
        ...state,
        paymenRequestContent: {
          ...action.payload,
        },
      };
    case actionTypes.OFFER_DETAILS_CONTENT:
      return {
        ...state,
        offerDetailsContent: {
          ...action.payload,
        },
      };
    case actionTypes.BRAND_DETAILS_CONTENT:
      return {
        ...state,
        brandDetailsContent: {
          ...action.payload,
        },
      };
    case actionTypes.SLOT_LOCATION_CONTENT:
      return {
        ...state,
        slotLocationContent: {
          ...action.payload,
        },
      };
    case actionTypes.STOCK_QUANTITY_CONTENT:
      return {
        ...state,
        stockQuantityContent: {
          ...action.payload,
        },
      };
    case actionTypes.PRODUCT_SERVICE_TIME:
      return {
        ...state,
        productServiceTime: {
          ...action.payload,
        },
      };
    case actionTypes.PRODUCT_STOCK:
      return {
        ...state,
        productStock: {
          ...action.payload,
        },
      };
    case actionTypes.SERVICE_SLOT_CONTENT:
      return {
        ...state,
        serviceSlotContent: {
          ...action.payload,
        },
      };
    case actionTypes.GETSLOT_CONTENT:
      return {
        ...state,
        getSlotContent: {
          ...action.payload,
        },
      };
    case actionTypes.GETBAYSUBSLOT_CONTENT: {
      return {
        ...state,
        getbaySubslotContent: {
          ...action.payload,
        },
      };
    }
    case actionTypes.GETBAY_SUBSLOT_ID: {
      return {
        ...state,
        getBaySubslotId: {
          ...action.payload,
        },
      };
    }
    case actionTypes.CREATE_ORDER: {
      return {
        ...state,
        getOrder: {
          ...action.payload,
        },
      };
    }
    case actionTypes.CHECK_LOCATION: {
      return {
        ...state,
        getServiceLocation: {
          ...action.payload,
        },
      };
    }
    case actionTypes.CHECKOUT_JOURNEY_CONTENT: {
      return {
        ...state,
        chekoutJourneyContent: {
          ...action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
