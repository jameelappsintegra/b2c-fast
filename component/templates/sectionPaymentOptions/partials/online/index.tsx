import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Card from 'components/common/card';
import { ORDERS_CONTENT, PAYMENT_REQUEST_CONTENT } from '/store/actions/types';
import AppButton from '/components/common/appButton';
import { commonFetch } from '/store/actions/thunk';
import { ORDERS_ENDPOINT, PAYMENT_REQUEST_ENDPOINT, SLOT_AVAILBLITY_ENDPOINT } from '/config/config';
import Cookies from 'js-cookie';
import { compareValues } from 'libs/utils/global';
import { ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import { notification, NOTIFICATION_TYPE } from '/utilities/utils';

const Online = () => {
  const dispatch = useDispatch();
  const [basketItems, setBasketItems] = useState([]);
  const [draftedOrderId, setDraftedOrderId] = useState<any>('');
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const getOrder = useSelector((state: any) => state?.storeReducer?.getOrder);
  const payType = useSelector((state: any) => state?.checkoutJourneyR?.paymentType || '');
  const formInput: any = useRef(null);
  const paymentResp = useSelector((state: any) => state?.storeReducer?.paymenRequestContent || '');
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const getSlotContent = useSelector((state: any) => state?.storeReducer?.getSlotContent);
  const [orderId, setOrderId] = useState('');
  const bestSubSlot =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('BestSubSlot') !== null
        ? JSON.parse(sessionStorage.getItem('BestSubSlot') || '')
        : {}
      : null;
  const bestSubSlotData = Object.keys(getSlotContent).length > 0 ? getSlotContent : bestSubSlot;
  const basketCartItems =
    typeof window !== 'undefined'
      ? localStorage.getItem('cartItems') !== null
        ? JSON.parse(localStorage.getItem('cartItems') || '')
        : []
      : null;
  const ordersContentDraft =
    ordersContent &&
    ordersContent
      ?.filter((res: any) => res?.status === ORDER_STATUS_DRAFT)
      ?.sort(compareValues('id', 'desc'));
  const ordersDrafted = ordersContentDraft.length ? ordersContentDraft[0] : getOrder;

  const cartTotal: string = (
    ordersDrafted?.items?.reduce((acc, item: any) => +item?.quantity * +item?.price + acc, 0) || 0.0
  ).toFixed(2);

  const payOnlineHandler = async (e) => {
    if (!paymentResp?.Registration?.PaymentPortal) {
      paymentBeforeDataLayer();
      e.preventDefault();
    }
    const axios = require('axios');
    const verifyData = { slotId: bestSubSlotData?.id, products: basketCartItems };
    const verifyConfig = {
      method: 'post',
      url: SLOT_AVAILBLITY_ENDPOINT,
      headers: {
        Accept: 'application/json',
      },
      data: verifyData,
    };

    axios(verifyConfig)
      .then(
        () =>
          dispatch(
            commonFetch({
              URL: PAYMENT_REQUEST_ENDPOINT,
              type: PAYMENT_REQUEST_CONTENT,
              method: 'POST',
              redirect: 'follow',
              data: paymentData,
              headers: {
                Accept: 'application/json',
              },
            }),
          ),
        paymentCompletedDataLayer(),
      )
      // tslint:disable-next-line: ter-prefer-arrow-callback
      .catch(function (error) {
        console.log(error);
        if (error?.data?.isNotverified) {
          let errorToastMsg;
          if (typeof error?.data?.isNotverified === 'string') {
            errorToastMsg = error?.data?.isNotverified;
          } else {
            const productErrors: string[] = [];
            for (const productId in error?.data?.isNotverified) {
              productErrors.push(
                `${
                  verifyData?.products.find((e) => e.productId === productId).productName
                }: ${error?.data?.isNotverified[productId].join()}`,
              );
            }
            errorToastMsg = productErrors.join();
          }
          notification(NOTIFICATION_TYPE.warning, errorToastMsg);
        }
      });
  };
  const baseURL =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : Cookies.get('NEXT_PUBLIC_BASE_URL');

  const paymentData = {
    returnPath: `${baseURL}/checkoutJourney?step=4&`,
    branchId: bestSubSlotData?.locationCode, // Location id
    customerId: checkCustomer?.customerInformation?.customerCode || '',
    referenceDocumentType: 'FFB2C_DBM_ORDER',
    referenceDocumentNumber: `FF${orderId}`, // order number
    items: [
      {
        itemNumber: '0010',
        description: 'RESERVATION',
        currency: 'AED',
        outstandingAmount: cartTotal,
        amount: cartTotal,
      },
    ],
    notes: 'RESERVATION',
    modeOfPayment: 'WEB',
    firstName: checkCustomer?.customerInformation?.customerFirstName || '',
    lastName: checkCustomer?.customerInformation?.customerLastName || '',
    emailId: checkCustomer?.customerInformation?.emails[0]?.emailId || '',
    mobileNumber: checkCustomer?.customerInformation.telephones[0]?.telephone || '',
    addressLine1: checkCustomer?.customerInformation?.addresses[0]?.streetAddress || '',
    addressLine2: checkCustomer?.customerInformation?.addresses[0]?.streetName || '',
    city: checkCustomer?.customerInformation?.addresses[0]?.city || '',
  };

  useEffect(() => {
    if (paymentResp?.Registration?.PaymentPortal) {
      formInput?.current?.submit();
    }
  }, [paymentResp]);

  useEffect(() => {
    if (checkCustomer?.id) {
      dispatch(
        commonFetch({
          URL: ORDERS_ENDPOINT(checkCustomer?.customerInformation?.customerCode),
          type: ORDERS_CONTENT,
          method: 'GET',
        }),
      );
    }
  }, [checkCustomer?.id]);
  useEffect(() => {
    const orderId = localStorage.getItem('orderId');
    console.log(orderId, 'orderId inlloca');
    setOrderId(orderId);
  }, []);

  const paymentBeforeDataLayer = () => {
    window?.['dataLayer'].push({
      event: 'checkout',
      ecommerce: {
        checkout: {
          actionField: {
            step: '3',
          },
        },
      },
    });
  };
  const paymentCompletedDataLayer = () => {
    window?.['dataLayer'].push({
      event: 'checkoutOption',
      ecommerce: {
        checkout_option: {
          actionField: {
            step: '3',
            option: 'Deposit', // Full Payment
          },
        },
      },
    });
  };
  return (
    <>
      <Card>
        <div className="online">
          <Row>
            <Col>
              <form
                ref={formInput}
                method="post"
                action={paymentResp?.Registration?.PaymentPortal}
                onSubmit={(event) => {
                  payOnlineHandler(event);
                }}
              >
                <input type="Hidden" name="TransactionID" value={paymentResp?.Registration?.TransactionID} />
                <input type="hidden" name="PayButtonColor" value="#009fe3" />
                <input type="hidden" name="PayButtonTextColor" value="#fff" />
                <input type="hidden" name="ResetButtonColor" value="" />
                <input type="hidden" name="ResetButtonTextColor" value="#009fe3" />
                <input type="hidden" name="BackgroundColor" value="#ffffff" />
                <input type="hidden" name="HeadingFont" value="" />
                <input type="hidden" name="ShowMerchantLogo" value="true" />
                <input type="hidden" name="LabelFont" value="Roboto" />
                <input type="hidden" name="LabelColor" value="#000" />
                <input type="hidden" name="HeadingColor" value="#000" />
                <input type="hidden" name="ErrorMessageFont" value="" />
                <input type="hidden" name="ErrorMessageColor" value="#f00" />
                <input type="hidden" name="HeadingBackgroundColor" value="" />
                <input type="hidden" name="DropdownBackgroundColor" value="#FFF" />
                <input type="hidden" name="DropDownActiveBackgroundColor" value="#009fe3" />
                <input type="hidden" name="ActiveFieldFocusColor" value="#000" />
                <AppButton isCentered text="Pay online" shape="rounded" variant="filled" />
              </form>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
};

export default Online;
