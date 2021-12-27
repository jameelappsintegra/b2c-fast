import React from 'react';
import { useSelector } from 'react-redux';
import TagManager from 'react-gtm-module';
import { getLocalData } from 'libs/utils/localStorage';
import { AUTH_LOCAL_DATA } from 'libs/utils/constants';
import { getGlobalEventTrigger } from 'libs/utils/global';
import AppButton from 'components/common/appButton';
import { CLASSIFICATION_INTENT } from 'libs/utils/gtm';

export interface IBookingSlotsFooterProps {
  onBookSlotClick?: (event?: React.MouseEvent<HTMLElement>) => void | undefined;
  onFirstAvailableClick?: (event?: React.MouseEvent<HTMLElement>) => void | undefined;
  onClickStepper?: () => void;
}

const BookingSlotsFooter = (props: IBookingSlotsFooterProps) => {
  const storedBookingDetails = useSelector((state: any) => {
    return state.checkoutJourneyR.bookingDetails;
  });
  const orderedId = localStorage.getItem('orderId');
  const bookAvailableSlot = () => {
    getGlobalEventTrigger(CLASSIFICATION_INTENT);
    if (props.onClickStepper) {
      // Posted when user has chosen their Booking Options and progresses to next step
      TagManager.dataLayer({
        dataLayer: {
          event: 'checkoutOption',
          ecommerce: {
            checkout_option: {
              actionField: {
                step: '1',
                option: storedBookingDetails?.location?.name || '',
              },
            },
          },
        },
      });

      // Sent when the user progresses to the 'Checkout page'
      TagManager.dataLayer({
        dataLayer: {
          event: 'checkout',
          ecommerce: {
            checkout: {
              actionField: {
                step: '2',
              },
            },
          },
        },
      });

      let loggedUserData: any = getLocalData(AUTH_LOCAL_DATA);
      loggedUserData = JSON.parse(loggedUserData);
      const isUserLoggedIn = loggedUserData?.isLoggedIn || false;

      // Sent when the user progresses to the 'Checkout page' either as Guest or from creating account/signing in.
      TagManager.dataLayer({
        dataLayer: {
          event: 'checkoutOption',
          ecommerce: {
            checkout_option: {
              actionField: {
                step: '2',
                option: isUserLoggedIn ? 'User' : 'Guest',
              },
            },
          },
        },
      });

      props.onClickStepper();
    }

    sendSlot(orderedId);
  };
  // "startDate": "2020-10-18T01:00:00+0400",
  //           "endDate": "2020-10-18T02:00:00+0400",
  //           "bayName": "2"
  const sendSlot = (orderId) => {
    // let axios = require('axios');
    // let dataPut = JSON.stringify({
    //   startDate: '2020-10-18T01:00:00+0400',
    //   endDate: "2020-10-18T02:00:00+0400",
    //   bayName: "2"
    // });
    // let config = {
    //   method: 'put',
    //   url: UPDATE_ORDER_ENDPOINT(orderId),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   data: dataPut,
    // };
    // axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  return (
    <div className="bookingSlotsFooter">
      <div className="bookingSlotsFooter__content">
        <div>
          <AppButton
            variant="filled"
            shape="rounded"
            text="Book slot"
            disabled={
              !storedBookingDetails?.selectedSlot ||
              (storedBookingDetails.hasOwnProperty('selectedSlot') &&
                !Object.entries(storedBookingDetails.selectedSlot).length)
            }
            onClick={bookAvailableSlot}
          />
        </div>
        <p>In a hurry? Highlight availability by</p>
        <div>
          <AppButton
            variant="outlined"
            shape="rounded"
            text="First available at all locations"
            styles={{ color: 'var(--color-azure)' }}
            // onClick={props.onClick}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingSlotsFooter;
