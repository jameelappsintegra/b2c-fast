import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FeatureWidget from '/components/common/featureWidget';
import Section from '/components/common/section';
import SectionHero from '/components/common/sectionHero';
import SectionOffersCarousel from '/components/templates/sectionOffersCarousel';
import { OFFERS_ENDPOINT, ORDERS_ENDPOINT, UPDATE_ORDER_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import { CREATE_ORDER, OFFERS_SECTION_CONTENT, ORDERS_CONTENT } from '/store/actions/types';
import {
  checkQuantityStock,
  normalizeOffersData,
  notification,
  NOTIFICATION_TYPE,
  quantityCheck,
} from '/utilities/utils';
import FormCustom from 'components/common/form';
import ReactPlaceholder from 'react-placeholder/lib';
import ResponsiveBasketTable from './responsiveBasketTable';
import { RectShape } from 'react-placeholder/lib/placeholders';
import { DEFAULT_CURRENCY, ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import { getCurrencyFormatttedPrice } from 'libs/utils/global';
import AppButton from '/components/common/appButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { useIsAuthenticated } from '@azure/msal-react';
import Link from 'next/link';

const Basket = (props) => {
  const { nextTab, step1 } = props;
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useDispatch();
  const [basketItems, setBasketItems] = useState<any>([]);
  const [basketLoaded, setBasketLoaded] = useState<boolean>(false);
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const offersSectionContent = useSelector((state: any) => state?.storeReducer?.offersSectionContent);
  const [offersSection, setOffersSection] = useState<any>({} as any);
  const isUserLoggedIn = checkCustomer?.customerInformation ? true : false;
  const [quantity, setQuantity] = useState(null);
  const cartTotal = basketItems?.reduce((acc, item: any) => +item.quantity * item.price + acc, 0) || 0.0;
  const getOrder = useSelector((state: any) => state?.storeReducer?.getOrder);

  const basketPlaceholder = (
    <Row>
      <Col>
        <RectShape color="var(--color-light-grey)" style={{ width: '100%', height: '16rem' }} />
      </Col>
    </Row>
  );

  const handleRemoveItem = async (product: any) => {
    // console.log(`handleRemoveItem ${product?.productId}`);

    if (!isAuthenticated) {
      let cartItems: any = localStorage.getItem('cartItems');
      cartItems = cartItems ? JSON.parse(cartItems) : {};
      // console.log(cartItems, 'cartItems');
      let filteredProduct = cartItems?.filter((item) => {
        return item?.productId !== product?.productId;
      });
      filteredProduct = filteredProduct ?? JSON.stringify(filteredProduct);
      // console.log('Obj', filteredProduct);
      localStorage.setItem('cartItems', JSON.stringify(filteredProduct));
      setBasketItems(filteredProduct);
    } else {
      // console.log(`RemoveItem ${JSON.stringify(product)}`);
      const draftOrderContentFromDB = ordersContent?.find((res: any) => res.status === ORDER_STATUS_DRAFT);

      if (
        draftOrderContentFromDB &&
        Object.keys(draftOrderContentFromDB).length !== 0 &&
        Object.getPrototypeOf(draftOrderContentFromDB) === Object.prototype
      ) {
        // console.log(`product id ${product?.productId}`);
        draftOrderContentFromDB.items.forEach((element) => {
          if (element.productId === product?.productId) {
            // console.log('removed');
            draftOrderContentFromDB.items.splice(draftOrderContentFromDB.items.indexOf(product), 1);
          }
        });

        const orderToUpdateInDB = {
          id: draftOrderContentFromDB.id,
          items: draftOrderContentFromDB.items,
        };

        dispatch(
          commonFetch({
            URL: UPDATE_ORDER_ENDPOINT(orderToUpdateInDB.id),
            type: CREATE_ORDER,
            method: 'PUT',
            data: orderToUpdateInDB,
          }),
        );

        const basketResult = basketItems?.map((item, itemIndex) => {
          if (itemIndex === draftOrderContentFromDB.items.indexOf(product)) {
            basketItems.splice(basketItems.indexOf(item), 1);
            return item;
          }
          return item;
        });
        setBasketItems(draftOrderContentFromDB.items);
      }
    }
    notification(
      NOTIFICATION_TYPE.info,
      `${product?.productName || product?.names?.[0]?.value} is removed from your Basket`,
    );
    pushToDataLayerAnalytics(product);
  };

  const pushToDataLayerAnalytics = (item) => {
    // console.warn(item, 'remove item');
    window?.['dataLayer'].push({
      event: 'removeFromCart',
      ecommerce: {
        currencyCode: 'AED',
        add: {
          products: [
            {
              name: item?.names[0]?.value, // Name of the car
              id: item?.productId, // Model Code of Vehicle. NOT full Variant code/sku
              brand: 'NA', // Brand of the car
              category: 'NA', // Vehicle category SUV/Hatchback/Sedan
              variant: 'NA', // Specific Sales SKU _ Model/Trim/Grade/Derivative etc. Variant Code
              price: item?.price, // Displayed price of model/variant in above Currency
              quantity: item?.quantity, // Pass dynamic value
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

  useEffect(() => {
    setBasketLoaded(true);
    if (!isAuthenticated) {
      let productFromPDPPage = localStorage.getItem('cartItems');
      // console.log(`Nasr ${JSON.stringify(productFromPDPPage)}`);
      productFromPDPPage = productFromPDPPage ? JSON.parse(productFromPDPPage) : [];
      setBasketItems(productFromPDPPage);
    } else {
      setBasketLoaded(false);
      // console.log('Nasr isAuthenticated', isAuthenticated);
      const draftOrderContentFromDB = ordersContent?.find((res: any) => res.status === ORDER_STATUS_DRAFT);
      // console.log('Nasr ordersDrafted?.items', draftOrderContentFromDB?.items);
      setBasketItems(draftOrderContentFromDB?.items);
      setBasketLoaded(true);
    }
  }, [quantity, ordersContent]);

  useEffect(() => {
    if (checkCustomer) {
      dispatch(
        commonFetch({
          URL: ORDERS_ENDPOINT(checkCustomer?.customerInformation?.customerCode),
          type: ORDERS_CONTENT,
          method: 'GET',
        }),
      );
    }

    dispatch(
      commonFetch({
        URL: OFFERS_ENDPOINT,
        type: OFFERS_SECTION_CONTENT,
        method: 'GET',
      }),
    );

    if (offersSectionContent) {
      const data = normalizeOffersData(offersSectionContent);
      setOffersSection(data ?? {});
    }
  }, [getOrder]);

  const handleProductQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number, item: any) => {
    const newQntyVlu = parseInt(e?.target?.value, 0);
    // console.log('handleProductQuantity', newQntyVlu);

    if (e.target.value.length < 1 || e.target.value === '0') {
      notification(NOTIFICATION_TYPE.warning, 'Minimum quantity allowed 1');
      return;
    }

    if (newQntyVlu > quantityCheck(quantity) || e.target.value.length > 2) {
      notification(NOTIFICATION_TYPE.warning, `Max quantity allowed is ${quantityCheck(quantity)}`);
      return;
    }

    if (!isAuthenticated) {
      // console.log(basketItems, 'basketItems ----');
      const basketResult = basketItems?.map((item, itemIndex) => {
        if (itemIndex === index) {
          item.quantity = newQntyVlu;
          return item;
        }
        return item;
      });
      setBasketItems(basketResult);
      localStorage.setItem('cartItems', JSON.stringify(basketResult));
    } else {
      // console.log(item, 'item');
      const draftOrderContentFromDB = ordersContent?.find((res: any) => res.status === ORDER_STATUS_DRAFT);

      if (
        draftOrderContentFromDB &&
        Object.keys(draftOrderContentFromDB).length !== 0 &&
        Object.getPrototypeOf(draftOrderContentFromDB) === Object.prototype
      ) {
        // console.log(`product id ${item.productId}`);
        draftOrderContentFromDB.items.forEach((element) => {
          if (element.productId === item.productId && newQntyVlu < quantity) {
            console.log(`update quantity = ${newQntyVlu}`);
            element.quantity = newQntyVlu;
            element.total = newQntyVlu * item.price;
          }
        });

        const orderToUpdateInDB = {
          id: draftOrderContentFromDB.id,
          items: draftOrderContentFromDB.items,
        };

        dispatch(
          commonFetch({
            URL: UPDATE_ORDER_ENDPOINT(orderToUpdateInDB.id),
            type: CREATE_ORDER,
            method: 'PUT',
            data: orderToUpdateInDB,
          }),
        );

        const basketResult = basketItems?.map((item, itemIndex) => {
          if (itemIndex === index) {
            item.quantity = newQntyVlu;
            return item;
          }
          return item;
        });
        setBasketItems(basketResult);
      }
    }
  };

  const getStockQuantity: any = (itemId: any) => {
    if (!isAuthenticated) {
      (async () => {
        // if user is not logedin
        // console.log(`itemId ${itemId}`);
        const cartItems = JSON.parse(localStorage.getItem('cartItems'));
        // console.log(`checkItem ${JSON.stringify(cartItems)}`);
        const product = cartItems?.filter((item) => item.productId === itemId);
        // console.warn(`filter product ${JSON.stringify(product)}`);
        await checkQuantityStock(itemId).then((res) => {
          // console.log(`test Stock 1 ${res} quantity ${product[0]?.quantity}`);
          setQuantity(quantityCheck(res));
        });
        // console.warn(`setQuantity Quantity ${quantity}`);
      })();
    } else {
      const draftOrderContentFromDB = ordersContent?.find((res: any) => res.status === ORDER_STATUS_DRAFT);
      const product = draftOrderContentFromDB?.items
        .filter((item) => item.productId === itemId)
        .map((pId) => ({ id: pId.productId, quantity: pId.quantity }));
      if (product && product.length > 0) {
        // console.log(`isLogedin ${JSON.stringify(product.length)}`);
        checkQuantityStock(product[0].id).then((res) => {
          // console.log(`test Stock 1 ${res} quantity ${product[0].quantity}`);
          setQuantity(quantityCheck(res));
        });
      }
    }

    return quantity;
  };

  return (
    <>
      <Head>
        <title>Basket - Al-Futtaim</title>
      </Head>
      <SectionHero
        className="heroBasket"
        title={step1?.name}
        preTitle={{
          children: (
            <Link href="/account/details">
              {!isUserLoggedIn
                ? `${step1?.Miscellaneous_Text.customerlogin}`
                : `${checkCustomer?.customerInformation?.customerFirstName} ${checkCustomer?.customerInformation?.customerLastName}`}
            </Link>
          ),
          styles: { color: 'var(--color-azure)' },
        }}
      >
        <div className="heroBasket__basketCardItems d-md-none">
          <ResponsiveBasketTable
            items={basketItems ?? basketItems}
            handleRemoveItem={handleRemoveItem}
            handleProductQuantity={handleProductQuantity}
          />
        </div>
        <FormCustom>
          <ReactPlaceholder showLoadingAnimation ready={basketLoaded} customPlaceholder={basketPlaceholder}>
            <div className="scrollableTable d-md-block d-none">
              <Table className="customTable--large" striped>
                <thead>
                  <tr>
                    <th>{step1?.Miscellaneous_Text.item}</th>
                    <th className="minWidthPrice">{step1?.Miscellaneous_Text.quantity}</th>
                    <th className="minWidthPrice">{step1?.Miscellaneous_Text.unit_price}</th>
                    <th className="minWidthPrice">{step1?.Miscellaneous_Text.unit_discount}</th>
                    <th className="minWidthPrice">{step1?.Miscellaneous_Text.price}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {basketLoaded && basketItems && basketItems?.length > 0 ? (
                    basketItems.map((item: any, index: number) => (
                      <tr key={item.productId}>
                        <td>
                          <strong>{item.names?.[0]?.value}</strong>
                        </td>
                        <td className="maxQtyWidth">
                          <input
                            className="form-control"
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            value={item.quantity}
                            max={getStockQuantity(item.productId)}
                            onChange={(e) => {
                              handleProductQuantity(e, index, item);
                            }}
                          />
                        </td>
                        <td className="priceColumn">
                          {getCurrencyFormatttedPrice(item.price, item.currency)}
                        </td>
                        <td className="priceColumn">
                          {getCurrencyFormatttedPrice(item.discount, item.currency)}
                        </td>

                        <td className="priceColumn">
                          {getCurrencyFormatttedPrice(item.price * item.quantity, item.currency)}
                        </td>
                        <td>
                          <a
                            href="#"
                            onClick={(e) => {
                              if (e) {
                                e.preventDefault();
                                handleRemoveItem(item);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>{step1?.Miscellaneous_Text.no_items}</td>
                    </tr>
                  )}
                </tbody>
                {basketLoaded && basketItems && basketItems?.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={4}> {step1?.Miscellaneous_Text.total_including_vat}</td>
                      <td className="priceColumn">
                        {getCurrencyFormatttedPrice(cartTotal ? cartTotal : 0.0, DEFAULT_CURRENCY)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </Table>
            </div>
          </ReactPlaceholder>
          <div className="heroBasket__promoActionsOuter">
            <div>
              <a href="/">{step1?.Miscellaneous_Text.continueshopping}</a>
              <AppButton
                variant="filled"
                type="submit"
                shape="rounded"
                text={step1?.Miscellaneous_Text.choose_your_booking_slot}
                disabled={!basketItems?.length}
                onClick={(e?: React.MouseEvent<HTMLElement>) => {
                  e?.preventDefault();
                  nextTab();
                }}
              />
            </div>
          </div>
        </FormCustom>
      </SectionHero>

      {offersSection && offersSection?.offers?.length > 0 && (
        <SectionOffersCarousel
          isDark={false}
          styles={{ backgroundColor: 'var(--color-white)' }}
          data={offersSection?.offers}
          titleProps={{
            text: 'Offers for you',
          }}
        />
      )}
    </>
  );
};
export default Basket;
