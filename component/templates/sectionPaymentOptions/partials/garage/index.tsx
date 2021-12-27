import React, { useEffect } from 'react';
import Card from 'components/common/card';
import AppButton from '/components/common/appButton';
import { useDispatch, useSelector } from 'react-redux';
import { commonFetch } from '/store/actions/thunk';
import { GET_LOCATION_ENDPOINT } from '/config/config';

const Garage = (props) => {
  const { locGarage, cartTotal } = props;
  const dispatch = useDispatch();
  const getServiceLocation = useSelector((state: any) => state?.storeReducer?.getServiceLocation);

  useEffect(() => {
    dispatch(
      commonFetch({
        URL: GET_LOCATION_ENDPOINT(locGarage),
        type: 'CHECK_LOCATION',
        method: 'GET',
      }),
    );
  }, []);

  const payatGarage = (e) => {
    e.preventDefault();
    console.log('payatgarage button');
  };
  return (
    <Card>
      <div className="garage">
        <div>
          <h4>AED {cartTotal * 0.1} – 10% deposit</h4>
          <p>You are required to enter your payment information.</p>
          <h4 className="garage__rem">Pay remaining balance at {getServiceLocation?.[0]?.keyValue} </h4>
          <p className="garage__note">
            Note: If you do not show for a confirmed appointment without letting us know, you will be liable
            to our cancellation policy and fee.
          </p>
        </div>
        <AppButton
          isCentered
          text="Pay at Garage"
          variant="filled"
          shape="rounded"
          type="submit"
          onClick={(event) => payatGarage(event)}
        />
      </div>
    </Card>
  );
};

export default Garage;
