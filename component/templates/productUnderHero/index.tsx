import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import AppButton from 'components/common/appButton';
import FormCustom from 'components/common/form';
import FormGroup from 'components/common/form/formGroup';
import {
  getQuantityOptions,
  scrollToTop,
  getQueryStringParams,
  defaultImageThumbSrc,
} from 'libs/utils/global';
import { CATEGORY_TYPE_SERVICE, ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import Loader from 'components/common/loader';
import {
  b2cTypes,
  CREATE_ORDER_ENDPOINT,
  PRODUCT_SERVICE_ENDPOINT,
  PRODUCT_STOCK_ENDPOINT,
  UPDATE_ORDER_ENDPOINT,
} from '/config/config';
import { useRouter } from 'next/router';
import { ROUTES } from '/utilities/constants';
import { commonFetch } from '/store/actions/thunk';
import { CREATE_ORDER, PRODUCT_SERVICE_TIME, PRODUCT_STOCK } from '/store/actions/types';
import { useIsAuthenticated } from '@azure/msal-react';
import { checkQuantityStock, imgRefactorURI, quantityCheck } from '/utilities/utils';

const ProductUnderHero = (props: any) => {
  const { product } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();
  const productServiceTime = useSelector((state: any) => state?.storeReducer?.productServiceTime);
  const productStock = useSelector((state: any) => state?.storeReducer?.productStock);
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const queryParams = getQueryStringParams(window.location.search);
  const productType = queryParams?.type;
  const [productQty, setProductQty] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);

  useEffect(() => {
    if (product) {
      window?.['dataLayer'].push({
        event: 'productDetails',
        ecommerce: {
          detail: {
            products: [
              {
                name: `${product?.name?.EN}`, // Name of the car
                id: `${product?.id}`, // Model Code of Vehicle. NOT full Variant code/sku
                brand: `${product?.attributes?.ff_sap_brand_name?.value}`, // Brand of the car
                category: `${product?.type}`, // Vehicle category SUV/Hatchback/Sedan
                list: 'NA', // Category Featured _ Ex: Price|Offer|Body Type
                position: 'NA', // Pass dynamic value
                item_type: 'NA', // Vehicle or Marine
                item_class: 'NA', // Primary for the primary selcetion and Ancillary for adons to the primary selction
                'item_new used': 'NA', // New or Used
                'vehicle_model class': 'NA', // Sedan/Hatchback or SUV
                'vehicle_model code': 'NA', // Model Code of Vehicle
                'vehicle_model name': 'NA', // Name of the car
                vehicle_detail: 'NA', // Car spec/detail
              },
            ],
          },
        },
      });
      console.log(product, 'product');
      dispatch(
        commonFetch({
          URL: PRODUCT_SERVICE_ENDPOINT(
            product?.attributes?.associated_servicing_id?.value || product?.id || '',
          ),
          type: PRODUCT_SERVICE_TIME,
          method: 'GET',
        }),
      );
      dispatch(
        commonFetch({
          URL: PRODUCT_STOCK_ENDPOINT(product?.id),
          type: PRODUCT_STOCK,
          method: 'GET',
        }),
      );
    }
    scrollToTop();
  }, [product]);

  const handleProductCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductQty(parseInt(e.currentTarget.value, 0));
  };

  /**
   * Primary attributes displayed under product title
   * @param attributes
   */
  const getPrimaryAttributes = (product: any) => {
    const { attributes } = product;
    let output = '';

    if (product.type === b2cTypes.tyres) {
      output = `${attributes?.ff_sap_width?.value ?? ''}/${parseInt(
        attributes?.ff_sap_profile?.value ?? '',
        0,
      )}/${attributes?.ff_sap_rim?.value ?? ''}/${attributes?.ff_sap_speed_rating?.value ?? ''}`;
    } else if (product.type === b2cTypes.batteries) {
      output = `${attributes?.ff_cca?.value ?? ''}/${attributes?.ff_voltage?.value ?? ''}`;
    } else if (product.type === b2cTypes.accessories) {
      output = attributes?.ff_warranty?.value ? `Warranty ${attributes?.ff_warranty?.value}` : '';
    }

    return <span>{output}</span>;
  };

  /**
   * Attributes displayed on badges next to thumb
   * @param attributes
   */
  const getBadgeAttributes = (product: any) => {
    const { attributes } = product;
    const badgeAttributes: any = [];

    if (product.type === b2cTypes.tyres) {
      badgeAttributes.push(
        {
          label: 'Fuel Efficiency',
          value: attributes?.ff_fuel_efficiency?.value,
        },
        {
          label: 'Noise',
          value: attributes?.ff_noise?.value,
        },
      );
    } else if (product.type === b2cTypes.batteries) {
      badgeAttributes.push({
        label: 'Warranty',
        value: attributes?.ff_warranty?.value,
      });
    } else if (product.type === b2cTypes.accessories) {
      badgeAttributes.push({
        label: 'Warranty',
        value: attributes?.ff_warranty?.value,
      });
    }

    return (
      badgeAttributes?.length > 0 &&
      badgeAttributes.map((attribute, index) => {
        return (
          attribute.value !== '0' && (
            <li key={index}>
              <span className="productBadge">{attribute.value}</span>
              <p>{attribute.label}</p>
            </li>
          )
        );
      })
    );
  };

  const getStockQuantity: any = (itemId: any) => {
    if (productStock && productStock[0].id === itemId) {
      console.log(`productStock ${JSON.stringify(productStock)}`);
      return quantityCheck(productStock[0].quantity);
    }
  };

  const addTOBasket = (e) => {
    e.preventDefault();
    if (!product || !productServiceTime) {
      throw Error('product data or service time is invalid');
    }

    const productPrice = parseFloat(product?.minPrice);
    const productTAX = productPrice;
    const totalIncludeTAX = productPrice;
    const orderItem = {
      productId: product.id,
      names: Object.keys(product.name).map((language) => ({ language, value: product.name[language] })),
      price: productPrice,
      currency: product.currencyCode,
      serviceTime: productServiceTime[0].service_time,
      quantity: productQty,
      unitOfMeasure: 'BOX',
      discount: parseFloat((product.retailPrice - product.minPrice).toFixed(2)),
      tax: productTAX,
      total: totalIncludeTAX,
      attributes: {},
    };

    if (!isAuthenticated) {
      // is gust
      (async () => {
        const cartItems: any[] = JSON.parse(localStorage.getItem('cartItems'))
          ? JSON.parse(localStorage.getItem('cartItems'))
          : [];

        const itemExists = cartItems.findIndex((items) => items.productId === product.id);
        console.log(`is gust itemExists ${JSON.stringify(itemExists)}`);

        if (!cartItems.length || itemExists === -1) {
          console.log(`is gust cartItems ${cartItems.length}`);
          cartItems.push(orderItem);
        }

        if (itemExists > -1) {
          const currentProdQnty = parseInt(cartItems[itemExists].quantity, 0);
          const checkQntyLimt = currentProdQnty + productQty;
          console.log(`old ${currentProdQnty} well add ${productQty} new total ----- ${checkQntyLimt}`);
          const checkQuntyStock = await checkQuantityStock(cartItems[itemExists].productId);
          console.log(`is gust newQunty ${checkQntyLimt}`);

          if (checkQntyLimt < checkQuntyStock) {
            console.log('is gust SAP quantity', checkQuntyStock);
            cartItems[itemExists].quantity = quantityCheck(checkQntyLimt);
          } else {
            console.log('is gust add max SAP quantity', checkQuntyStock);
            // add max SAP quantity
            cartItems[itemExists].quantity = quantityCheck(checkQuntyStock);
          }
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      })();
    } else {
      const draftOrderContentFromDB = ordersContent?.find((res: any) => res.status === ORDER_STATUS_DRAFT);
      if (
        draftOrderContentFromDB &&
        Object.keys(draftOrderContentFromDB).length !== 0 &&
        Object.getPrototypeOf(draftOrderContentFromDB) === Object.prototype
      ) {
        draftOrderContentFromDB.items.forEach((element) => {
          if (element.productId === orderItem.productId) {
            let newQuantity = orderItem.quantity;
            const thisProduct: any = Object.values(productStock).find((p: any) => p.id === element.productId);
            if (thisProduct) {
              const newTotalQuatity = element.quantity + newQuantity;
              if (thisProduct.quantity >= newTotalQuatity && newTotalQuatity < 11) {
                newQuantity += element.quantity;
              }
            }
            element.quantity = quantityCheck(newQuantity);
          }
        });

        const orderToUpdateInDB = {
          id: draftOrderContentFromDB.id,
          items: draftOrderContentFromDB.items,
        };

        console.log(`orderToUpdateInDB = ${orderToUpdateInDB.id}`);

        if (!orderToUpdateInDB.items.filter((el) => el.productId === orderItem.productId).length) {
          orderToUpdateInDB.items.push(orderItem);
        }

        dispatch(
          commonFetch({
            URL: UPDATE_ORDER_ENDPOINT(orderToUpdateInDB.id),
            type: CREATE_ORDER,
            method: 'PUT',
            data: orderToUpdateInDB,
          }),
        );
      } else {
        console.log(`new order ${JSON.stringify(orderItem.productId)}`);
        if (!checkCustomer || !checkCustomer.customerInformation) {
          throw Error('Customer Information is invalid');
        }

        console.log(`checkCustomer ${JSON.stringify(checkCustomer)}`);
        const customerPhoneNumber = checkCustomer.customerInformation.telephones
          ? checkCustomer.customerInformation.telephones[0]?.telephone
          : '';

        const orderModel = {
          customerId: checkCustomer.customerInformation.customerCode,
          notify: 'YES',
          notifyChannel: 'EMAIL',
          phoneNumber: customerPhoneNumber,
          emailId: checkCustomer.customerInformation.emails
            ? checkCustomer.customerInformation.emails[0]?.emailId
            : '',
          attributes: {
            locationName: '',
            modelLine: 'TY',
          },
          items: [orderItem],
          appointment: {},
          address: [
            {
              customerFirstName: checkCustomer.customerInformation.customerFirstName,
              customerLastName: checkCustomer.customerInformation.customerLastName,
              postalCode: 'NA',
              city: checkCustomer.customerInformation.addresses
                ? checkCustomer.customerInformation.addresses[0]?.city
                : '',
              country: 'NA',
              countryCode: 'NA',
              state: 'NA',
              streetAddress: checkCustomer.customerInformation.addresses
                ? checkCustomer.customerInformation.addresses[0]?.streetAddress
                : 'NA',
              addressType: 'SHIPPING',
              phoneNumber: customerPhoneNumber,
            },
          ],
          status: 'Draft',
          description: 'Order Drafted',
        };
        console.log(`new order Model with customerId ${JSON.stringify(orderModel.customerId)}`);

        dispatch(
          commonFetch({
            URL: CREATE_ORDER_ENDPOINT(),
            type: CREATE_ORDER,
            method: 'POST',
            data: orderModel,
          }),
        );
      }
    }
    pushToDataLayerAnalytics(product, orderItem);
    router.push({
      pathname: ROUTES.checkoutJourney,
      query: 'step=1',
    });
  };

  const pushToDataLayerAnalytics = (item, orderItem) => {
    window?.['dataLayer'].push({
      event: 'addToCart',
      ecommerce: {
        currencyCode: 'AED',
        add: {
          products: [
            {
              name: `${item?.name?.EN}`, // Name of the car
              id: `${item?.id}`, // Model Code of Vehicle. NOT full Variant code/sku
              brand: `${item?.attributes?.ff_sap_brand_name?.value}`, // Brand of the car
              category: `${item?.type}`, // Vehicle category SUV/Hatchback/Sedan
              variant: 'NA', // Specific Sales SKU _ Model/Trim/Grade/Derivative etc. Variant Code
              price: `${orderItem.total * orderItem.quantity}`, // Displayed price of model/variant in above Currency
              quantity: `${orderItem.quantity}`, // Pass dynamic value
              item_type: 'NA', // Vehicle or Marine
              item_SKU: 'NA', // Specific Sales SKU _ Model/Trim/Grade/Derivative etc. Variant Code
              item_class: 'NA', // Primary for the primary selcetion and Ancillary for adons to the primary selction
              'item_new used': 'NA', // New or Used
              'vehicle_model class': 'NA', // Sedan/Hatchback or SUV
              'vehicle_model code': 'NA', // Model Code of Vehicle
              'vehicle_model name': 'NA', // Name of the car
              vehicle_detail: 'NA', // Car spec/detail
              vehicle_trim: 'NA', // Car spec/detail
              vehicle_grade: 'NA', // Car spec/detail
              vehicle_engine: 'NA', // Car spec/detail
              vehicle_transmission: 'NA', // Car spec/detail
              'vehicle_drive train': 'NA', // Car spec/detail
              vehicle_fuel: 'NA', // Car spec/detail
              vehicle_age: 'NA', // For USED vehicle sales, the age in years for the car 1,2,3…
              // with 1 representing 1 year or less. Set to 0 for new vehicles
              vehicle_colour: 'NA', // Car spec/detail
              'vehicle_interior colour': 'NA', // Car spec/detail
              'vehicle_interior fabric': 'NA', // Car spec/detail
            },
          ],
        },
      },
    });
  };

  return (
    <Row className="productUnderHero">
      {isLoading && <Loader color={'var(--color-white)'} loading={isLoading} />}
      <Col sm={12} md={4}>
        <div className="productUnderHero__leftPanel">
          <img
            className="brandLogo"
            src={imgRefactorURI(product?.attributes?.brandImage?.value)}
            alt={'Brand Logo'}
            onError={defaultImageThumbSrc}
          />
          <ul className="badgeList">{getBadgeAttributes(product)}</ul>
          <div className="productThumb">
            <img
              src={imgRefactorURI(product?.attributes?.ff_images?.value)}
              alt="Product Thumb"
              onError={defaultImageThumbSrc}
            />
          </div>
        </div>
      </Col>
      <Col sm={12} md={8}>
        <div className="productUnderHero__rightPanel">
          <div className="productUnderHero__specsReviews">
            <span>{getPrimaryAttributes(product)}</span>
          </div>
          {product?.attributes?.ff_short_description && (
            <p className="productUnderHero__smallDescription">
              {product.attributes.ff_short_description.value}
            </p>
          )}
          <FormCustom>
            <div
              className={`productUnderHero__bodyBottom ${
                productType === CATEGORY_TYPE_SERVICE ? 'productUnderHero__bodyBottom--flip' : ''
              }`}
            >
              {productType !== CATEGORY_TYPE_SERVICE && productStock[0]?.quantity > 0 ? (
                <FormGroup
                  id="quantity"
                  fieldLabel="Quantity"
                  formControl={{
                    type: 'select',
                    noChoose: true,
                    value: productQty.toString(),
                    options: getQuantityOptions(getStockQuantity(product?.productId)),
                    onChange: handleProductCount,
                  }}
                />
              ) : null}
              <div className="productUnderHero__pricesOuter">
                {product?.minPrice !== product?.retailPrice && (
                  <p className="m-0">
                    {'Old price was '}
                    <span className="strikeThrough bold pl-2"> {product?.retailPrice} </span>
                  </p>
                )}
                {product?.minPrice && (
                  <label>
                    {product?.priceTitle ?? 'Fully Fitted Price'}
                    <span className="productUnderHero__mainPrice">{product?.minPrice}</span>
                    inc VAT
                  </label>
                )}
              </div>

              <AppButton
                variant="filled"
                type="submit"
                shape="rounded"
                disabled={productStock?.[0]?.quantity > 0 ? false : true}
                onClick={(e?: React.MouseEvent<HTMLElement>) => {
                  if (e) {
                    addTOBasket(e);
                  }
                }}
                text={productStock?.[0]?.quantity > 0 ? 'Buy Now' : 'Out of stock'}
              />
            </div>
          </FormCustom>
        </div>
      </Col>
    </Row>
  );
};

export default ProductUnderHero;
