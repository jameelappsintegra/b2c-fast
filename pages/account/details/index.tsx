import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container, Form } from 'react-bootstrap';
import SectionHero from '/components/common/sectionHero';
import EditableForm from 'components/common/form/editableForm';
import AppButton from 'components/common/appButton';
import Section from 'components/common/section';
import CarForm from 'components/pages/productListing/partialForms/car';
import PreferencesForm from '../../../components/pages/checkout/partials/preferences';
import notification, { NOTIFICATION_TYPE } from 'libs/utils/notification';
import { MESSAGES } from 'libs/utils/messages';
import Title from 'components/common/section/title';
import Card from 'components/common/card';
import Loader from 'components/common/loader';
import { scrollToTop, getGlobalEventTrigger } from 'libs/utils/global';
import LoginForm from 'components/pages/login/loginForm';
import { checkFormKeysValidStatus } from 'libs/utils/formValidations';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { b2cPolicies, loginRequest } from '/config/authConfig';
import { commonFetch } from '/store/actions/thunk';
import { CHECKOUT_JOURNEY_ENDPOINT, CHECK_CUSTOMER, CHECK_CUSTOMER_GUEST } from '/config/config';
import { useRouter } from 'next/router';
import { ROUTES } from '/utilities/constants';
import { SET_ACTIVE_STEP } from '/store/actions/types';
import getFormData, {
  IPersonalDetailsFormData,
  IBillingAddressFormData,
  IPreferences,
  IUserDataProps,
} from '../../../components/pages/checkout/partials/formData';

const Details = () => {
  const [personalDetails, setPersonalDetails] = useState<any>();
  const [addressDetails, setAddressDetails] = useState<any>();
  const chekoutJourneyContent = useSelector((state: any) => state?.storeReducer?.chekoutJourneyContent);

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [required, setRequired] = useState<boolean>();
  const [touched, setTouched] = useState<boolean>(false);
  const [guestLogin, setGuestLogin] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const dispatch = useDispatch();
  let isUserLoggedIn = false;

  const activeStep = useSelector((state: any) => state?.storeReducer?.activeStep);

  const handleLogin = () => {
    console.log('handleLogin', loginRequest);
    instance
      .loginPopup(loginRequest)
      .then((res) => {
        isUserLoggedIn = true;
        console.log('signin', res);
      })
      .catch((err) => {});
  };
  const handleRegister = () => {
    console.log('handleRegister..', b2cPolicies);
    instance
      .loginPopup(b2cPolicies.authorities.signUp)
      .then((res) => {
        isUserLoggedIn = true;
        console.log('register', res);
        // addToast(`You are successfully logged in`, {
        //   appearance: 'success',
        //   autoDismiss: true,
        // });
      })
      .catch((err) => {});
  };
  const handleGuest = () => {
    setGuestLogin(true);
  };
  const loginCard = (
    <LoginForm title="Register for a new account" buttonText="Register" onclick={handleRegister} />
  );
  const registerCard = <LoginForm title="Already a customer" buttonText="Login" onclick={handleLogin} />;
  const guestCard = (
    <LoginForm title="Continue as Guest" buttonText="Continue as Guest" onclick={handleGuest} />
  );
  const tabsArr = [
    {
      title: 'Login',
      key: 'login',
      children: loginCard,
    },
  ];

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

  useEffect(() => {
    pushToDataLayerAnalytics();
  }, []);
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
  useEffect(() => {
    // console.log('checkCustomer', checkCustomer);
  }, [checkCustomer]);
  /**
   * Redirect to specific checkout journey route/page on exception,
   * Display toast message if availble
   * @param error object should contain messages(array) and state keys
   */
  const checkoutJourneyErrorHandler = (error: any) => {
    if (error && error.hasOwnProperty('messages')) {
      if (error.messages[0]?.message) {
        notification(NOTIFICATION_TYPE.error, error.messages[0]?.message);
      }
    }
    if (error && error.hasOwnProperty('state')) {
      setTimeout(() => redirectToJourneyStepper(error.state), 1000);
      /**
       * Redirect to specific checkout journey route/page on exception,
       * Display toast message if availble
       * @param error object should contain messages(array) and state keys
       */
      const checkoutJourneyErrorHandler = (error: any) => {
        if (error && error.hasOwnProperty('messages')) {
          if (error.messages[0]?.message) {
            notification(NOTIFICATION_TYPE.error, error.messages[0]?.message);
          }
        }
        if (error && error.hasOwnProperty('state')) {
          setTimeout(() => redirectToJourneyStepper(error.state), 1000);
        }
      };
    }
  };
  /**
   * Redirect to checkout journey stepper
   * @param step current step. Default = 1 i.e. Basket
   */
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
          const userData: any = getFormData(custInfo, chekoutJourneyContent?.Step3?.Miscellaneous_Text);
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
        ? getFormData(checkCustomer?.customerInformation, chekoutJourneyContent?.Step3?.Miscellaneous_Text)
        : getFormData();
      console.log('userData', userData);

      setPersonalDetails(userData?.personalDetails);
      setAddressDetails(userData?.billingAddress);
      setPreferences(userData?.preferences);
      setMyCarDetails({ ...userData?.myCarDetails });
    }
  };

  useEffect(() => {
    getAccountDetails();
    scrollToTop();
  }, [checkCustomer]);

  const handlePersonalChange = (changedObj: any) => {
    setPersonalDetails(changedObj);
  };

  const handleAddressChange = (changedObj: any) => {
    setAddressDetails(changedObj);
  };

  const handlePreferenceChange = (preferences: any) => {
    setPreferences(preferences);
    window?.['dataLayer'].push({
      event: 'accountEvent',
      event_category: 'Communication Preference',
      event_action: 'Email',
      event_label: 'Yes',
    });
  };
  const checkValidity = () =>
    personalDetails?.formValid &&
    addressDetails?.formValid &&
    // (preferences?.sms || preferences?.email) &&
    !required
      ? true
      : false;
  const updateDetail = () => {
    redirectToJourneyStepper();
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
          // emails: [
          //   {
          //     emailId: perDetails['email'],
          //     emailType: 'PRIMARY',
          //   },
          // ],
        },
      };
      console.log('updatePersonaDetails', updatePersonaDetails);

      dispatch(
        commonFetch({
          URL: `${CHECK_CUSTOMER}/${checkCustomer?.id}`,
          type: 'CHECK_CUSTOMER',
          method: 'PUT',
          data: updatePersonaDetails,
        }),
      );
      notification(NOTIFICATION_TYPE.success, MESSAGES.defaultSuccess);
    } else {
      notification(NOTIFICATION_TYPE.error, 'Please fill all mandatory fields');
    }
  };
  useEffect(() => {
    dispatch(
      commonFetch({
        URL: CHECKOUT_JOURNEY_ENDPOINT,
        type: 'CHECKOUT_JOURNEY_CONTENT',
        method: 'GET',
      }),
    );
  }, []);
  console.warn(chekoutJourneyContent, 'chekoutJourneyContent');
  return (
    <React.Fragment>
      {isLoading && <Loader color={'var(--color-white)'} loading={isLoading} />}
      <Head>
        <title>My details - Al-Futtaim</title>
      </Head>
      <SectionHero className="heroDetails" title="My Details" preTitle={{ children: '' }}></SectionHero>

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
                <Title text={chekoutJourneyContent?.Step3?.Miscellaneous_Text?.personal_details} />
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
                <Title text={chekoutJourneyContent?.Step3?.Miscellaneous_Text?.add_address} />
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
                <Title text={chekoutJourneyContent?.Step3?.Miscellaneous_Text?.mycar} />
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
                    console.log('reqBody', reqBody);
                    setMyCarDetails({ ...reqBody });
                  }}
                />
              </Col>
            </Row>
            <PreferencesForm
              pref={chekoutJourneyContent?.Step3?.Miscellaneous_Text}
              {...preferences}
              updatePreference={handlePreferenceChange}
              required={
                preferences?.whatsapp || preferences?.email || preferences?.phone || preferences?.post
              }
            />

            <div className="section sectionCheckout__buttonOuter">
              <AppButton
                variant="filled"
                isCentered
                isLarge
                type="submit"
                shape="rounded"
                text="Update"
                onClick={updateDetail}
              />
            </div>
          </Container>
        </section>
      ) : null}
    </React.Fragment>
  );
};

export default Details;
