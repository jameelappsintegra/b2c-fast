import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import SectionHelpContacts from 'components/templates/sectionHelpContacts';
import SectionHero from '/components/common/sectionHero';
import FormCustom from 'components/common/form';
import { AppButton } from 'components/common/appButton';
import Card from 'components/common/card';
import Placeholder from '/components/common/placeholder';
import SlotsPlaceholder from './placeholders/slots';
import BookingSlot from '/components/templates/bookingSlot';
import { ORDERS_ENDPOINT, SLOT_LOCATION_ENDPOINT } from '/config/config';
import { ORDERS_CONTENT, SLOT_LOCATION_CONTENT } from '/store/actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { commonFetch } from '/store/actions/thunk';
import { useIsAuthenticated } from '@azure/msal-react';
import { ORDER_STATUS_DRAFT } from 'libs/utils/constants';

const bookingSlot = (props) => {
  const {
    nextTab,
    showSlot,
    setShowSlot,
    locValue,
    setLocValue,
    selectedButton,
    setSelectedButton,
    buttonSelected,
    setButtonSelected,
    slotValue,
    setSlotValue,
    bookSlotFlag,
    setBookSlotFlag,
    minutes,
    setMinutes,
    step2,
  } = props;
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();

  const [isSlotLoaded, setIsSlotLoaded] = useState<boolean>(true);
  const [bookingSection, setBookingSection] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [slots, setSlots] = useState([]);
  const getSlotContent = useSelector((state: any) => state?.storeReducer?.getSlotContent);
  const slotLocationContent = useSelector((state: any) => state?.storeReducer?.slotLocationContent);
  const [draftOrders, setDraftOrders] = useState<any>([]);
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const [scroller, setScroller] = useState<any>(null);

  useEffect(() => {
    setSlots(slotLocationContent);
    setScroller(document && document.getElementById('scrollSlot'));
  }, [slotLocationContent]);

  function getCartItems() {
    let cartItems;
    if (!isAuthenticated) {
      cartItems = localStorage.getItem('cartItems');
      cartItems = cartItems ? JSON.parse(cartItems) : [];
    } else {
      cartItems = ordersContent?.find((res: any) => res.status === ORDER_STATUS_DRAFT)?.items;
    }
    console.log(cartItems);
    return cartItems;
  }

  const showBookSlot = (e) => {
    e.preventDefault();
    // console.log('show slots');
    scroller.scrollIntoView();
    setShowSlot(true);

    window?.['dataLayer'].push({
      event: 'checkout',
      ecommerce: {
        checkout: {
          actionField: {
            step: '1',
          },
          products: getCartItems()?.map((item) => ({
            name: item?.names[0]?.value, // Name or ID is required.
            id: item?.productId,
            price: item?.price,
            brand: 'NA',
            category: 'NA',
            variant: item?.productId,
            quantity: item?.quantity,
            product_coupon: 'NA',
            product_listPrice: 'NA',
            product_discountAmount: 'NA',
            product_discountPercentage: 'NA',
            product_cartValue: 'NA',
            product_OEM: 'NA',
            product_stockStatus: 'NA',
            product_bundleIndicator: 'NA',
          })),
        },
      },
    });
  };
  useEffect(() => {
    let pIds;
    if (!isAuthenticated) {
      const { ids } = { ids: getCartItems().length && getCartItems()?.map((a: any) => a?.productId) };
      pIds = ids?.length && ids?.join();
    } else {
      if (ordersContent) {
        const { ids } = {
          ids: ordersContent?.[0]?.items?.length && ordersContent?.[0]?.items?.map((a: any) => a?.productId),
        };
        pIds = ids?.length && ids?.join();
      }
    }
    getSlotLocation(pIds);
  }, []);

  useEffect(() => {
    if (checkCustomer?.id) {
      dispatch(
        commonFetch({
          URL: ORDERS_ENDPOINT(checkCustomer?.customerInformation?.customerCode),
          type: ORDERS_CONTENT,
          method: 'GET',
        }),
      );
    } else {
      let productFromPDPPage = localStorage.getItem('cartItems');
      productFromPDPPage = productFromPDPPage ? JSON.parse(productFromPDPPage) : [];
      setDraftOrders(productFromPDPPage);
    }
  }, [checkCustomer]);

  useEffect(() => {
    if (ordersContent.length > 0 && ordersContent) {
      const ordersContentResult = ordersContent.map((ele) => ele.items?.[0]);
      setDraftOrders(ordersContentResult);
    }
  }, [ordersContent]);

  const getSlotLocation = (pIds) => {
    dispatch(
      commonFetch({
        URL: SLOT_LOCATION_ENDPOINT(pIds),
        type: SLOT_LOCATION_CONTENT,
        method: 'GET',
      }),
    );
  };

  const getLocationId = (e: any) => {
    setLoading(true);
    console.log(e?.target?.value, 'e');
    setLocValue(e?.target?.value);
  };

  const getFilterLocation = (location): [{ name: string; value: string }] =>
    // @ts-ignore
    Object.values(location)?.reduce((pre: any, curr: any) => {
      if (!curr.available) {
        pre.push({ name: curr.keyValue, value: curr.key });
      }
      return pre;
    }, []);

  const getFilterLocationValue = (location): [{ name: string; value: string }] =>
    // @ts-ignore
    Object.values(location)?.reduce((pre: any, curr: any) => {
      if (!curr.available) {
        curr.push({ name: curr.keyValue, value: curr.key });
      }
      return curr;
    }, []);

  useEffect(() => {
    getFilterLocation(slotLocationContent);
  }, [slotLocationContent]);

  return (
    <>
      <Head>
        <title>Booking - Al-Futtaim</title>
      </Head>
      <SectionHero className="heroBooking bookingEnhance" title={step2?.name ? step2?.name : ''}>
        <FormCustom>
          <Row className="justify-content-md-center">
            <Col sm={12} md={6}>
              <Card
                header={{
                  children: <span>{step2?.Miscellaneous_Text.location}</span>,
                  styles: {
                    color: 'var(--color-white)',
                    backgroundColor: 'var(--color-azure)',
                  },
                }}
              >
                <Form.Group>
                  <Form.Label>{step2?.Miscellaneous_Text.nearest_autoservice_centre}</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    onChange={(e) => {
                      getLocationId(e);
                    }}
                  >
                    <option>Choose</option>
                    {slots &&
                      Object.values(slotLocationContent).map((item: any, key: any) => (
                        <option
                          disabled={!item.available ? true : false}
                          selected={locValue === item?.key ? item?.key : ''}
                          value={item?.key}
                          key={key}
                        >
                          {item.keyValue}
                        </option>
                      ))}
                  </Form.Control>
                  <Form.Text>
                    Only those locations are selectable where all your items in the basket are available.
                  </Form.Text>
                </Form.Group>
              </Card>
            </Col>
          </Row>
          <Row>
            <AppButton
              onClick={(event) => {
                showBookSlot(event);
              }}
              isLarge
              isCentered={true}
              text={step2?.Miscellaneous_Text.show_available_slots}
              variant="filled"
              shape="rounded"
              disabled={locValue === 'Choose' || locValue === undefined}
            />
          </Row>
        </FormCustom>
      </SectionHero>
      <div id="scrollSlot">
        {showSlot && (
          <BookingSlot
            minutes={minutes}
            setMinutes={setMinutes}
            nextTab={nextTab}
            locValue={locValue}
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
            buttonSelected={buttonSelected}
            setButtonSelected={setButtonSelected}
            slotValue={slotValue}
            setSlotValue={setSlotValue}
            bookSlotFlag={bookSlotFlag}
            setBookSlotFlag={setBookSlotFlag}
            loading={loading}
            setLoading={setLoading}
            step2={step2}
          />
        )}
        <Placeholder togglePlaceholder={isSlotLoaded} placeholderBody={SlotsPlaceholder()}>
          {bookingSection}
        </Placeholder>
      </div>
      <SectionHelpContacts step2={step2} />
    </>
  );
};

export default bookingSlot;
