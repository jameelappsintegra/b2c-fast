import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container, Form } from 'react-bootstrap';
import SectionHero from 'components/common/sectionHero';
import SectionHelpContacts from 'components/templates/sectionHelpContacts';
import EditableForm from 'components/common/form/editableForm';
import AppButton from 'components/common/appButton';
import Section from 'components/common/section';
import CardOrder from '../partials/cardOrder';
import CarForm from 'components/pages/productListing/partialForms/car';
import PreferencesForm from '../../../components/pages/checkout/partials/preferences';
import CardBooking from '../partials/cardBooking';
import notification, { NOTIFICATION_TYPE } from 'libs/utils/notification';
import { MESSAGES } from 'libs/utils/messages';
import Title from 'components/common/section/title';
import Card from 'components/common/card';
import Loader from 'components/common/loader';
import { scrollToTop } from 'libs/utils/global';
import LoginForm from 'components/pages/login/loginForm';
import { checkFormKeysValidStatus } from 'libs/utils/formValidations';
import { CREATE_ORDER, SET_ACTIVE_STEP } from '/store/actions/types';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { b2cPolicies, loginRequest } from '/config/authConfig';
import { commonFetch } from '/store/actions/thunk';
import { CHECK_CUSTOMER, CREATE_ORDER_ENDPOINT, UPDATE_ORDER_ENDPOINT } from '/config/config';
import getFormData from '/components/pages/checkout/partials/formData';
import { ORDER_STATUS_DRAFT } from 'libs/utils/constants';

const Checkout = (props) => {
  const { nextTab, minutes, setMinutes, step3 } = props;
  console.warn(step3);
  const [personalDetails, setPersonalDetails] = useState<any>();
  const [addressDetails, setAddressDetails] = useState<any>();
  const [preferences, setPreferences] = useState<any>({
    whatsapp: false,
    email: false,
    phone: false,
    post: false,
    exclusiveOffers: false,
    latestNewsAndDeals: false,
    loyalityProgram: false,
  });
  const [myCarDetails, setMyCarDetails] = useState({
    makeCode: '',
    modelCode: '',
    modelYear: '',
    code: '',
  });
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [required, setRequired] = useState<boolean>();
  const [touched, setTouched] = useState<boolean>(false);
  const [checkoutLogin, setCheckoutLogin] = useState<boolean>(false);
  const [guestLogin, setGuestLogin] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const dispatch = useDispatch();
  let isUserLoggedIn = false;

  const activeStep = useSelector((state: any) => state?.storeReducer?.activeStep);

  useEffect(() => {
    if (ordersContent && checkoutLogin) {
      const cartItems: any[] = JSON.parse(localStorage.getItem('cartItems'))
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      const ordersDraftedDb = ordersContent?.find((res: any) => res?.status === ORDER_STATUS_DRAFT);
      if (ordersDraftedDb) {
        const orderModel = {
          id: ordersDraftedDb.id,
          items: cartItems,
        };
        dispatch(
          commonFetch({
            URL: UPDATE_ORDER_ENDPOINT(orderModel.id),
            type: CREATE_ORDER,
            method: 'PUT',
            data: orderModel,
          }),
        );
      } else if (cartItems.length) {
        const customerPhoneNumber = checkCustomer?.customerInformation?.telephones?.[0]?.telephone || '';
        const createOrderModel = {
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
          items: cartItems,
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
        localStorage.removeItem('cartItems');
        dispatch(
          commonFetch({
            URL: CREATE_ORDER_ENDPOINT(),
            type: CREATE_ORDER,
            method: 'POST',
            data: createOrderModel,
          }),
        );
      }
    }
  }, [ordersContent]);
  const handleLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then((res) => {
        setCheckoutLogin(true);
        // console.log('signin', res);
        handleUserDataLayerAnalytics();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRegister = () => {
    // console.log('handleRegister..', b2cPolicies);
    instance
      .loginPopup(b2cPolicies.authorities.signUp)
      .then((res) => {
        console.log('register', res);
        handleUserDataLayerAnalytics();
      })
      .catch((err) => {});
  };
  const handleGuest = () => {
    console.log('setGuestLogin');
    setGuestLogin(true);
  };
  const loginCard = (
    <LoginForm title="Register for a new account" buttonText="Register" onclick={handleRegister} />
  );
  const registerCard = <LoginForm title="Already a customer" buttonText="Login" onclick={handleLogin} />;
  const guestCard = (
    <LoginForm title="Continue as Guest" buttonText="Continue as Guest" onclick={handleGuest} />
  );

  const storedPersonalDetails = useSelector(
    (state: any) => state?.checkoutJourneyR?.personalDetails?.personalDetails || {},
  );
  const storedAddressDetails = useSelector(
    (state: any) => state?.checkoutJourneyR?.addressDetails?.addressDetails || {},
  );
  const storedPreferencesDetails = useSelector(
    (state: any) => state?.checkoutJourneyR?.preferencesDetails?.preferencesDetails || {},
  );
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const getSlotContent = useSelector((state: any) => state?.storeReducer?.getSlotContent);

  useEffect(() => {
    pushToDataLayerAnalytics();
  }, []);

  const handleUserDataLayerAnalytics = () => {
    window?.['dataLayer'].push({
      event: 'checkoutOption',
      ecommerce: {
        checkout_option: {
          actionField: {
            step: '2',
            option: 'User',
          },
        },
      },
    });
  };

  const pushToDataLayerAnalytics = () => {
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

  const redirectToJourneyStepper = (step = 4) => {
    dispatch({ type: SET_ACTIVE_STEP, payload: step });
  };

  const getAccountDetails = async () => {
    if (
      Object.entries(storedPersonalDetails).length > 0 &&
      Object.entries(storedAddressDetails).length > 0 &&
      Object.entries(storedPreferencesDetails).length > 0
    ) {
      setPersonalDetails({
        formValid: checkFormKeysValidStatus(storedPersonalDetails),
        formData: storedPersonalDetails,
      });
      setAddressDetails({
        formValid: checkFormKeysValidStatus(storedAddressDetails),
        formData: storedAddressDetails,
      });
      setPreferences({
        whatsapp: storedPreferencesDetails.whatsapp ? storedPreferencesDetails.whatsapp : false,
        email: storedPreferencesDetails.email ? storedPreferencesDetails.email : false,
        phone: storedPreferencesDetails.phone ? storedPreferencesDetails.phone : false,
        post: storedPreferencesDetails.post ? storedPreferencesDetails.post : false,
        exclusiveOffers: storedPreferencesDetails.exclusiveOffers
          ? storedPreferencesDetails.exclusiveOffers
          : false,
        latestNewsAndDeals: storedPreferencesDetails.latestNewsAndDeals
          ? storedPreferencesDetails.latestNewsAndDeals
          : false,
        loyalityProgram: storedPreferencesDetails.loyalityProgram
          ? storedPreferencesDetails.loyalityProgram
          : false,
      });
    } else if (isUserLoggedIn) {
      try {
        setIsLoading(true);
        const noTransform: boolean = true;
        const resp: any = {};
        const custInfo: any = resp?.data[0] || {};
        if (Object.entries(custInfo)?.length > 0) {
          const userData: any = getFormData(custInfo);
          setPersonalDetails(userData?.personalDetails);
          setAddressDetails(userData?.billingAddress);
          setPreferences(userData?.preferences);
        }
      } catch (error) {
        notification(NOTIFICATION_TYPE.error, MESSAGES.defaultError);
      } finally {
        setIsLoading(false);
      }
    } else {
      const userData: any = checkCustomer?.customerInformation
        ? getFormData(checkCustomer?.customerInformation)
        : getFormData();

      setPersonalDetails(userData?.personalDetails);
      setAddressDetails(userData?.billingAddress);
      setPreferences(userData?.preferences);
      setMyCarDetails({ ...userData?.myCarDetails });
    }
  };

  useEffect(() => {
    getAccountDetails();
    scrollToTop();
    if (checkCustomer) {
      isUserLoggedIn = true;
    } else {
      isUserLoggedIn = false;
    }
  }, [checkCustomer]);

  const handlePersonalChange = (changedObj: any) => {
    setPersonalDetails(changedObj);
  };

  const handleAddressChange = (changedObj: any) => {
    setAddressDetails(changedObj);
  };

  const handlePreferenceChange = (preferences: any) => {
    setPreferences(preferences);
  };

  const checkValidity = () =>
    personalDetails?.formValid &&
    addressDetails?.formValid &&
    // (preferences?.sms || preferences?.email) &&
    !required
      ? true
      : false;

  const continueToPayment = () => {
    redirectToJourneyStepper();

    // getGlobalEventTrigger(CLASSIFICATION_INTENT);
    const validity: boolean = checkValidity();
    if (validity) {
      const perDetails: any = {};
      Object.values(personalDetails?.formData).forEach((ele: any) => {
        perDetails[ele?.formControl?.name] = ele?.formControl?.value;
      });
      const addrDetails = {};

      Object.values(addressDetails?.formData).forEach((ele: any) => {
        addrDetails[ele?.formControl?.name] = ele?.formControl?.value;
      });

      const updatePersonaDetails = {
        customerInformation: {
          title: perDetails['title'],
          customerFirstName: perDetails['firstName'],
          customerLastName: perDetails['lastName'],
          addresses: [
            {
              poBoxCity: addrDetails['area'],
              streetName: addrDetails['street'],
              building: addrDetails['buildingName'],
              // country: 'AE',
              // region: 'DB1',
              city: addrDetails['emirates'],

              firstName: perDetails['firstName'],
              lastName: perDetails['lastName'],
              // "district": "Westwood",
              // "postalCode": "5667",
              // "poBox": "677",
              streetAddress: addrDetails['street'],
              houseNumber: addrDetails['flatOrHouseNumber'],
              location: addrDetails['landMark'],
              // "phoneNumber": "",
              addressType: 'BILLING',
              isDefault: true,
            },
          ],
          telephones: [
            {
              country: perDetails?.['countryCode'] || '',
              telephone: perDetails?.['phoneNumber'] || '',
              phoneType: 'PRIMARYMOBILE',
            },
          ],
          mycar: [
            {
              makeCode: myCarDetails?.makeCode,
              modelCode: myCarDetails?.modelCode,
              modelYear: myCarDetails?.modelYear,
              code: myCarDetails?.code,
            },
          ],
          communicationPreferences: {
            ...preferences,
          },
          emails: [
            {
              emailId: perDetails['email'],
              emailType: 'PRIMARY',
            },
          ],
        },
      };

      dispatch(
        commonFetch({
          URL: `${CHECK_CUSTOMER}/${checkCustomer?.id}`,
          type: 'CHECK_CUSTOMER',
          method: 'PUT',
          data: updatePersonaDetails,
        }),
      );
      nextTab();
    } else {
      notification(NOTIFICATION_TYPE.error, 'Please fill all mandatory fields');
    }
  };
  return (
    <React.Fragment>
      {isLoading && <Loader color={'var(--color-white)'} loading={isLoading} />}
      <Head>
        <title>Checkout - Al-Futtaim</title>
      </Head>
      <SectionHero className="heroCheckout checkoutEnhance" title={step3?.name}>
        <div className="card-group">
          <CardOrder
            header={{
              children: <span>{step3?.Miscellaneous_Text?.order}</span>,
              styles: {
                color: 'var(--color-white)',
                backgroundColor: 'var(--color-azure)',
              },
            }}
            footerText={step3?.Miscellaneous_Text?.total_inc_vat}
          />
          <CardBooking
            cardbookingTitle={step3?.Miscellaneous_Text}
            getSlotContent={getSlotContent}
            minutes={minutes}
            setMinutes={setMinutes}
          />
        </div>
      </SectionHero>
      <Section
        className="sectionCheckout"
        titleProps={{
          text: !checkCustomer ? 'Complete transaction as a guest' : '',
        }}
      >
        {!isAuthenticated && (
          <Container>
            <div className="sectionCheckout__loginRegister">
              <Row>
                <Col md={6}>{loginCard}</Col>
                <Col md={6}>{registerCard}</Col>
                <Col md={12}>{guestCard}</Col>
              </Row>
            </div>
          </Container>
        )}
        {isAuthenticated || guestLogin ? (
          <section className="sectionCheckout__grey">
            <Container>
              <Row className="sectionCheckout__personalDetailsRow">
                <Col>
                  <Title text={step3?.Miscellaneous_Text?.personal_details} />
                  <Card>
                    <Form.Row>
                      <Col md={12} lg={12}>
                        <EditableForm
                          onChange={handlePersonalChange}
                          formJson={personalDetails?.formData}
                          editable={true}
                          formType="horizontal"
                        />
                      </Col>
                    </Form.Row>
                  </Card>
                </Col>
              </Row>
              <Row className="sectionCheckout__addressRow">
                <Col>
                  <Title text={step3?.Miscellaneous_Text?.add_address} />
                  <Card>
                    <Form.Row>
                      <Col md={12} lg={12}>
                        <EditableForm
                          onChange={handleAddressChange}
                          formJson={addressDetails?.formData}
                          editable={true}
                          formType="horizontal"
                        />
                      </Col>
                    </Form.Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title text={step3?.Miscellaneous_Text?.mycar} />
                  <CarForm
                    initialFilters={{
                      ...myCarDetails,
                    }}
                    hideBtn={true}
                    required={required && touched}
                    setRequired={(required: boolean) => {
                      setRequired(required);
                      setTouched(true);
                    }}
                    onDataFill={(reqBody: any) => {
                      setMyCarDetails({ ...reqBody });
                    }}
                  />
                </Col>
              </Row>
              <PreferencesForm
                {...preferences}
                updatePreference={handlePreferenceChange}
                required={
                  preferences?.whatsapp || preferences?.email || preferences?.phone || preferences?.post
                }
              />
              <div className="sectionCheckout__buttonOuter">
                <AppButton
                  variant="filled"
                  isCentered
                  isLarge
                  type="submit"
                  shape="rounded"
                  text="Continue to payment"
                  onClick={continueToPayment}
                  // onClick={(e?: React.MouseEvent<HTMLElement>) => {
                  //   e?.preventDefault();
                  //   nextTab();
                  // }}
                />
              </div>
            </Container>
          </section>
        ) : null}
      </Section>
      <SectionHelpContacts />
    </React.Fragment>
  );
};

export default Checkout;
