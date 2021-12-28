import { toast } from 'react-toastify';
import { b2cTypes, PRODUCT_STOCK_ENDPOINT } from '/config/config';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export const NOTIFICATION_TYPE = {
  success: 'success',
  error: 'error',
  warning: 'warn',
  info: 'info',
};

export const notification = (type: string, message: string, delay: number = 3000) => {
  switch (type) {
    case NOTIFICATION_TYPE.success:
      return toast.success(message, {
        onOpen: () => {
          setTimeout(() => {
            toast.dismiss();
          }, delay);
        },
      });
    case NOTIFICATION_TYPE.info:
      return toast.info(message, {
        onOpen: () => {
          setTimeout(() => {
            toast.dismiss();
          }, delay);
        },
      });
    case NOTIFICATION_TYPE.warning:
      return toast.warning(message, {
        onOpen: () => {
          setTimeout(() => {
            toast.dismiss();
          }, delay);
        },
      });
    case NOTIFICATION_TYPE.error:
      return toast.error(message, {
        onOpen: () => {
          setTimeout(() => {
            toast.dismiss();
          }, delay);
        },
      });
    default:
      return toast('Done!');
  }
};

export const normalizeHeroPanelData = (data: any) => {
  return (data?.categories?.tabsList ?? []).map((obj: any, index: number) => ({
    id: obj.id,
    tabName: obj.title,
    body: {
      headline: (obj?.heading ?? '')?.replace(/&amp;/g, '&'),
      secondaryHeadline: (obj?.subheading ?? '')?.replace(/&amp;/g, '&'),
      description: (obj?.shortdesc ?? '')?.replace(/&amp;/g, '&'),
      formTitle: 'Search'?.replace(/&amp;/g, '&'),
      link:
        obj?.cta_button === 'show' && obj?.cta_label && index === 2
          ? { label: obj?.cta_label, url: null /* obj?.cta_link */ }
          : '',
      backgroundImage: {
        url:
          obj?.background_image?.renditionList?.filter((obj) => obj.name === 'default')?.[0]?.resourceUri ??
          '',
      },
    },
  }));
};

export const offersCatTypeLookup = {
  ['car-servicing']: 'servicing',
  ['Tyres']: 'Tyres',
  ['Batteries']: 'Batteries',
  ['Air_Conditioning']: 'Air_Conditioning',
  ['car_care']: 'car_care',
};

export const normalizeOffersData = (data: any) => {
  return {
    title: data.Offers.parentName,
    offers: (data?.Offers?.OffersList ?? []).map((obj: any) => ({
      title: obj.title,
      description: obj.description,
      link: { url: obj.path, title: obj.title },
      image: { url: obj.path, title: obj.title },
      categoryNames: (obj?.category ?? '').split(','),
      thumbnails: obj?.thumbnail?.renditionList ?? '',
    })),
  };
};

export const normalizeSiteSearchResults = (data: any) => {
  const dataToReturn = {
    topCategoriesSection: {
      categories: (data ?? [])
        .map((item: any) => ({
          catalogue_thumbnail: {
            altText: '',
            renditionList: [
              {
                name: 'default',
                resourceUri: item?.catalogue_thumbnail?.renditionList
                  .find((img) => img.name === 'default')
                  ?.resourceUri?.startsWith('https://')
                  ? item?.catalogue_thumbnail?.renditionList.find((img) => img.name === 'default')
                      ?.resourceUri
                  : `https://aedevdxamb01.corp.al-futtaim.com:443
                      ${
                        item?.catalogue_thumbnail?.renditionList.find((img) => img.name === 'default')
                          ?.resourceUri
                      }` ?? '',
              },
            ],
          },
          url: `/${item?.name}`,
          catalogue_price_label: `Starting from ${item?.currency} ${item?.startingPrice}`,
          catalogue_desc: item?.catalogue_desc ?? '',
          title: item?.title,
          count: item?.count,
        }))
        .filter((obj) => obj?.count > 0),
    },
  };
  // console.log('data & dataToReturn', data, dataToReturn); // ahsan
  return dataToReturn;
};

export const popularProductsFieldsLookup = {
  ['car-servicing']:
    'id|type|attributes.ff_name.values.EN as name|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_image.values.EN as image',
  ['Tyres']:
    'id|type|attributes.ff_name.values.EN as name|attributes.ff_noise.values.EN as noise|attributes.ff_fuel_efficiency.values.EN as efficiency|attributes.ff_sap_rim.values.EN as rim|attributes.ff_sap_width.values.EN as width|attributes.ff_sap_profile.values.EN as profile|attributes.ff_sap_speed_rating.values.EN as speedRating|attributes.ff_sap_dot.values.EN as sapDot|attributes.ff_sap_pattern.values.EN as sapPattern|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_images.values.EN as image|quantity',
  ['Batteries']:
    'id|type|attributes.ff_name.values.EN as name|attributes.ff_warranty.values.EN as warranty|attributes.ff_cca.values.EN as cca|attributes.ff_voltage.values.EN as voltage|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_images.values.EN as image',
  ['Air_Conditioning']: 'id|image|type|attributes.ff_name.values.EN as name',
  ['car_care']:
    'id|type|attributes.ff_name.values.EN as name|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_image.values.EN as image',
};

export const popularProductsFieldsLookupByPimCode = {
  ['ff_Servicing']:
    'id|type|attributes.ff_name.values.EN as name|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_image.values.EN as image|quantity',
  ['ff_Tyre']:
    'id|type|attributes.ff_name.values.EN as name|attributes.ff_noise.values.EN as noise|attributes.ff_fuel_efficiency.values.EN as efficiency|attributes.ff_sap_rim.values.EN as rim|attributes.ff_sap_width.values.EN as width|attributes.ff_sap_profile.values.EN as profile|attributes.ff_sap_speed_rating.values.EN as speedRating|attributes.ff_sap_dot.values.EN as sapDot|attributes.ff_sap_pattern.values.EN as sapPattern|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_images.values.EN as image|quantity',
  ['ff_Battery']:
    'id|type|attributes.ff_name.values.EN as name|attributes.ff_warranty.values.EN as warranty|attributes.ff_cca.values.EN as cca|attributes.ff_voltage.values.EN as voltage|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_images.values.EN as image|quantity',
  ['ff_Accessories']:
    'id|type|attributes.ff_name.values.EN as name|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_image.values.EN as image|quantity',
};

export const fieldsLookupByPimFamilyCodeClpPage = {
  ['b2c_Servicing']:
    'id|type|attributes.ff_name.values.EN as name|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_image.values.EN as image|quantity',
  ['b2c_Tyre']:
    'id|type|attributes.ff_name.values.EN as name|attributes.ff_noise.values.EN as noise|attributes.ff_fuel_efficiency.values.EN as efficiency|attributes.ff_sap_rim.values.EN as rim|attributes.ff_sap_width.values.EN as width|attributes.ff_sap_profile.values.EN as profile|attributes.ff_sap_speed_rating.values.EN as speedRating|attributes.ff_sap_dot.values.EN as sapDot|attributes.ff_sap_pattern.values.EN as sapPattern|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_images.values.EN as image|quantity',
  ['b2c_Battery']:
    'id|type|attributes.ff_name.values.EN as name|attributes.ff_warranty.values.EN as warranty|attributes.ff_cca.values.EN as cca|attributes.ff_voltage.values.EN as voltage|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_images.values.EN as image|quantity',
  ['b2c_Accessories']:
    'id|type|attributes.ff_name.values.EN as name|retailPrice|specialPrice|minPrice|currencyCode|attributes.brandLabel.values.EN as brandLabel|attributes.brandImage.values.EN as brandImage|attributes.ff_images.values.EN as image|quantity',
};

export const normalizePopularProductsData = (data: any) => {
  const dataToReturn = {
    heading: data?.title ?? 'Most popular products',
    searchHeading: data?.title ?? 'Search products',
    products: (Array.isArray(data?.products) ?? data?.products
      ? data?.products
      : Array.isArray(data) ?? data
      ? data
      : []
    ).map((item: any, index: number) => {
      return {
        ...item,
        availableFittingDate: '',
      };
    }),
  };
  // console.log('data & dataToReturn', data, dataToReturn); // ahsan
  return dataToReturn;
};

export const normalizeProductDetailsData = (data: any) => {
  const dataToReturn = {
    ...data,
  };
  // console.log('data & dataToReturn', data, dataToReturn); // ahsan
  return dataToReturn;
};

export const normalizeFAQsData = (data: any) => {
  const dataToReturn = { faqs: data ? data?.faq : {} };
  // console.log('data & dataToReturn', data, dataToReturn); // ahsan
  return dataToReturn;
};

export const normalizeOrdersData = (data: any) => {
  const dataToReturn = Array.isArray(data) ? data : [];
  // console.log('data & dataToReturn', data, dataToReturn); // ahsan
  return dataToReturn;
};

export const capitalizeFirstLetter = (str: string = ''): string => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};

export const getQuantityOptions: any = (quantity: any = 10): any[] => {
  return Array.from({ length: quantity || 1 }, (_, i) => {
    const value = (i + 1).toString();
    return { value, name: value };
  });
};

export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

export const calculateTAX = (totalPrice) => {
  return parseFloat((0.005 * totalPrice).toFixed(2));
};

export const calculateVAT = (totalPrice) => {
  return parseFloat((totalPrice + 0.05 * totalPrice).toFixed(2));
};

export const checkQuantityStock = async (productId: string) => {
  const response = await fetch(PRODUCT_STOCK_ENDPOINT(productId));
  const data = await response.json();
  // console.log(`checkQuantityStock res ${JSON.stringify(data)}`);
  return data[0]?.quantity;
};

export const quantityCheck = (quantity: number) => {
  return quantity < 10 ? quantity : 10;
  // 12 < 10 != 10
};

export const imgRefactorURI = (img: string): string => {
  // console.warn(img, 'image2342');
  // const HOST_URL = 'http://aedevb2c.corp.al-futtaim.com/bff/dxbase';
  const HOST_URL = 'https://aedevdxamb01.corp.al-futtaim.com';
  if (img?.startsWith('/wps/wcm')) return HOST_URL + img;
  // else return HOST_URL + '/' + img.split('/').slice(3).join('/');
  return img;
};

export const afterPageViewDL = (res, router) => {
  window?.['dataLayer'].push({
    event: 'afterPageview',
    brand: 'Fastfit', // Fastfit _ dynamic value has to be capture
    environment: `${res?.environment}`, // live or staging
    language: `${router.locale}`, // ar,en
    region: 'UAE', // KSA
    login: `${res?.login}`, // Boolean (true if logged in, false if not)
    userId: `${res?.uniqueId}`, // Capture User ID from cookie
    alfuttaimId: 'xxxxx', // Pass unique customer id if user is logged in
  });
};
