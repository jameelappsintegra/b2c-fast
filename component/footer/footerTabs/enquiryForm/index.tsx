import { useState } from 'react';
import TagManager from 'react-gtm-module';
import { Col, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { SUBSCRIPTION_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import AppButton from '/components/common/appButton';
import { SUBSCRIPTION_CONTENT } from '/store/actions/types';
import { notification } from '/utilities/utils';
import { NOTIFICATION_TYPE } from 'libs/utils/notification';
import FormCustom from '/components/common/form';
// import { validatePhoneNumber } from 'libs/utils/formValidations';
const validatePhoneNumber = RegExp(/^[0-9]{9,10}$/);

const EnquiryForm = (props) => {
  const { locations } = props;
  const [formData, setFormData] = useState({
    title: '' || 'MR',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    preferredLocation: '' || 'Hessa Street',
    subject: '' || 'Subject 1',
    enquiry: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const dispatch = useDispatch();
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const sendEnquiry = (e) => {
    e.preventDefault();
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    console.log('Submit clicked');
    if (
      formData.title !== '' &&
      formData.firstName !== '' &&
      formData.lastName !== '' &&
      formData.email !== '' &&
      formData.email.match(regexEmail) &&
      validatePhoneNumber.test(formData.mobileNumber) &&
      formData.preferredLocation !== '' &&
      formData.subject !== '' &&
      formData.enquiry !== ''
    ) {
      setSubmitted(true);
      // TagManager.dataLayer({
      //   dataLayer: {
      //     event: 'enquiryEvent',
      //     'product type': 'Enquiry',
      //     selection: formData,
      //   },
      // });
      window?.['dataLayer'].push({
        event: 'enquiry',
        event_category: 'Form', // Static
        event_action: 'Click', // Static
        event_label: 'Send enquiry', // Capture the Element user clicked
        leadType: 'enquiry',
      });
      dispatch(
        commonFetch({
          URL: SUBSCRIPTION_ENDPOINT,
          type: SUBSCRIPTION_CONTENT,
          method: 'POST',
          redirect: 'follow',
          data: {
            leadType: 'enquiry',
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            firstName: formData.firstName,
            lastName: formData.lastName,
            title: formData.title,
            additionalDetails: [
              {
                keyName: 'enquiry',
                keyValue: formData.enquiry,
              },
              {
                keyName: 'subject',
                keyValue: formData.subject,
              },
              {
                keyName: 'preferredLocation',
                keyValue: formData.preferredLocation,
              },
            ],
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      setInvalid(false);
      setFormData({
        title: '' || 'MR',
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        preferredLocation: '' || 'Hessa Street',
        subject: '' || 'Subject 1',
        enquiry: '',
      });
      notification(
        NOTIFICATION_TYPE.success,
        'Thank you. A customer service respresentiative will be in touch.',
      );
    } else {
      setInvalid(true);
      console.log('>>>>>');
      // notification(NOTIFICATION_TYPE.error, 'Please fill all mandatory fields EEEE');
    }
  };

  return (
    <>
      <Col xs={12} sm={9}>
        <div className="footerContact b-footer">
          <div className="customForm__formOuter">
            <h6 className="b-footer__title">Enquiry form</h6>
            <FormCustom
            // className="customForm"
            // onSubmit={(event) => {
            //   console.log('>>OnSubmit');
            //   sendEnquiry(event);
            // }}
            >
              <Form.Row className="row">
                <Col xs={12} sm={12} md={4}>
                  {/* <Form.Group controlId="exampleForm.title"> */}
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    required
                    value={formData.title}
                    as="select"
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                    }}
                  >
                    <option value="MR">Mr</option>
                    <option value="MS">Miss</option>
                    <option value="MRS">Mrs</option>
                  </Form.Control>
                  {/* </Form.Group> */}
                </Col>
                <Col xs={12} sm={12} md={4}>
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    value={formData.firstName}
                    type="text"
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value });
                    }}
                    isInvalid={invalid ? !formData.firstName : invalid}
                  />
                </Col>
                <Col xs={12} sm={12} md={4}>
                  {/* <Form.Group controlId="exampleForm.lastName"> */}
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value });
                    }}
                    isInvalid={invalid ? !formData.lastName : invalid}
                  />
                  {/* </Form.Group> */}
                </Col>
                <Col xs={12} sm={12} md={4}>
                  {/* <Form.Group controlId="exampleForm.email"> */}
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    isInvalid={invalid ? !formData.email.match(regexEmail) : invalid}
                  />

                  {/* </Form.Group> */}
                </Col>
                <Col xs={12} sm={12} md={4}>
                  {/* <Form.Group controlId="exampleForm.email"> */}
                  <Form.Label>Mobile number</Form.Label>
                  <Form.Control
                    maxLength={10}
                    required
                    type="number"
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      if (e.target.value?.length <= 10) {
                        setFormData({ ...formData, mobileNumber: e.target.value });
                      }
                    }}
                    isInvalid={invalid ? !validatePhoneNumber.test(formData.mobileNumber) : invalid}
                  />
                  {/* </Form.Group> */}
                </Col>
                <Col xs={12} sm={12} md={4}>
                  {/* <Form.Group controlId="exampleForm.location"> */}
                  <Form.Label>Preferred location</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    value={formData.preferredLocation}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredLocation: e.target.value });
                    }}
                    isInvalid={invalid ? !formData.preferredLocation : invalid}
                  >
                    {locations &&
                      locations.tabsList.map((item, index) => <option key={index}>{item.title}</option>)}
                  </Form.Control>
                  {/* </Form.Group> */}
                </Col>
                <Col xs={12} sm={12} md={4}>
                  {/* <Form.Group controlId="exampleForm.subject"> */}
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                    }}
                  >
                    <option>Tyres</option>
                    <option>Batteries</option>
                    <option>Servicing</option>
                    <option>Others</option>
                  </Form.Control>
                  {/* </Form.Group> */}
                </Col>
                <Col sm={12} md={8}>
                  {/* <Form.Group controlId="exampleForm.location"> */}
                  <Form.Label>Enquiry</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={formData.enquiry}
                    onChange={(e) => {
                      setFormData({ ...formData, enquiry: e.target.value });
                    }}
                    isInvalid={invalid ? !formData.enquiry : invalid}
                  />
                  {/* </Form.Group> */}
                </Col>
                <Col sm={12}>
                  <AppButton
                    text="Send enquiry"
                    variant="filled"
                    shape="rounded"
                    type="submit"
                    onClick={(event) => sendEnquiry(event)}
                  />
                </Col>
              </Form.Row>
            </FormCustom>
          </div>
        </div>
      </Col>
    </>
  );
};

export default EnquiryForm;
