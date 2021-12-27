import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import AppButton from '/components/common/appButton';
import FormCustom from '/components/common/form';
import { SUBSCRIPTION_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import { SUBSCRIPTION_CONTENT } from '/store/actions/types';
import { notification, NOTIFICATION_TYPE } from '/utilities/utils';

const Subscription = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [helper, setHelper] = useState('');
  const [showSubscribe, setshowSubscribe] = useState(false);

  const subscrptionHandler = (e): any => {
    e.preventDefault();
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    window?.['dataLayer'].push({
      event: 'Subscribe',
      event_category: 'Form', // Static
      event_action: 'Click', // Static
      event_label: 'Subscribe', // Capture the Element user clicked
      leadType: 'subscribe',
    });
    if (email.match(regexEmail)) {
      dispatch(
        commonFetch({
          URL: SUBSCRIPTION_ENDPOINT,
          type: SUBSCRIPTION_CONTENT,
          method: 'POST',
          redirect: 'follow',
          data: {
            email,
            leadType: 'subscribe',
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      setshowSubscribe(true);
      setHelper('');
      notification(NOTIFICATION_TYPE.success, 'Your email Successfully Subscribed');
      setEmail('');
      return true;
    }
    if (email === '') {
      setHelper('Email Should not be Empty');
    } else {
      setHelper('Invalid Email');
      return false;
    }
  };

  const subscriptionEmail = (e) => {
    setHelper('');
    setEmail(e.target.value);
  };
  return (
    <>
      <Row>
        <Col xs={12} sm={12}>
          <p className="footerVehicleCare__subscription-info">
            Subscribe to receive more tips and special offers
          </p>
          <div className="footerVehicleCare__subscription FormOuter">
            <FormCustom>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    onChange={subscriptionEmail}
                    isInvalid={!!helper}
                  />
                  <small className="form-text text-muted validation">{helper}</small>
                </Col>
                <Col>
                  <AppButton
                    text="Subscribe"
                    shape="rounded"
                    variant="filled"
                    onClick={() => subscrptionHandler(event)}
                    styles={{ backgroundColor: 'var(--color-slate-grey)' }}
                  />
                </Col>
              </Row>
            </FormCustom>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Subscription;
