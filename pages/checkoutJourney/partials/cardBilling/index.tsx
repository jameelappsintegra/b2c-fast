import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from 'components/common/card';
import { useMsal } from '@azure/msal-react';
import { checkFormKeysValidStatus } from 'libs/utils/formValidations';
import notification, { NOTIFICATION_TYPE } from 'libs/utils/notification';
import { MESSAGES } from 'libs/utils/messages';
import getFormData from '../../../../components/pages/checkout/partials/formData';
const CardBilling = (props: any) => {
  const { step4 } = props;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [required, setRequired] = useState<boolean>();
  const [touched, setTouched] = useState<boolean>(false);
  const [guestLogin, setGuestLogin] = useState(false);
  const { instance } = useMsal();

  const isUserLoggedIn = false;

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
  }, [checkCustomer]);

  return (
    <>
      <Card
        className="card--address"
        header={{
          children: <span>{step4?.Miscellaneous_Text?.billing_address || 'Billing address'}</span>,
        }}
      >
        <div>
          <strong>
            {step4?.Miscellaneous_Text?.flat || 'Flat/House number'}
            {' : '}
          </strong>
          {checkCustomer?.customerInformation?.addresses?.[0]?.houseNumber}
        </div>
        <div>
          <strong>
            {step4?.Miscellaneous_Text?.building_name || 'Building name'}
            {' : '}
          </strong>
          {checkCustomer?.customerInformation?.addresses?.[0]?.building}
        </div>
        <div>
          <strong>
            {step4?.Miscellaneous_Text?.street || 'Street'}
            {' : '}
          </strong>
          {checkCustomer?.customerInformation?.addresses?.[0]?.streetAddress}
        </div>
        <div>
          <strong>
            {step4?.Miscellaneous_Text?.emirates || 'Emirates'}
            {' : '}
          </strong>
          {checkCustomer?.customerInformation?.addresses?.[0]?.city}
        </div>
        <div>
          <strong>
            {step4?.Miscellaneous_Text?.nearest_land_mark || 'Nearest land mark'}
            {' : '}
          </strong>
          {checkCustomer?.customerInformation?.addresses?.[0]?.location}
        </div>
      </Card>
    </>
  );
};

export default CardBilling;
