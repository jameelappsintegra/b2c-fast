import { Col, Form, Row } from 'react-bootstrap';

const ContactDetails = (props: any) => {
  const {
    title = '',
    opening_hours_label = '',
    Address = '',
    Address_label = '',
    Email_label = '',
    Email_value = '',
    Friday_label = '',
    Friday_timing = '',
    Monday_label = '',
    Monday_timing = '',
    Phone_Label = '',
    Phone_value = '',
    Saturday_label = '',
    Saturday_timing = '',
    Sunday_label = '',
    Sunday_timing = '',
    Thursday_label = '',
    Thursday_timing = '',
    Tuesday_label = '',
    Tuesday_timing = '',
    Wednesday_label = '',
    Wednesday_timing = '',
    Whatsapp_label = '',
    Whatsapp_value = '',
    description = '',
    getdirections_label = '',
    getdirections_value = '',
    schedules = [],
  } = props;

  return (
    <>
      <Row className="contactDetails">
        <Col sm={12} md={6}>
          <ul>
            <li>
              <span>{Sunday_label}</span>
              <span>{Sunday_timing && Sunday_timing ? `${Sunday_timing}` : 'Closed'}</span>
            </li>
            <li>
              <span>{Monday_label}</span>
              <span>{Monday_timing && Monday_timing ? `${Monday_timing}` : 'Closed'}</span>
            </li>
            <li>
              <span>{Tuesday_label}</span>
              <span>{Tuesday_timing && Tuesday_timing ? `${Tuesday_timing}` : 'Closed'}</span>
            </li>
            <li>
              <span>{Wednesday_label}</span>
              <span>{Wednesday_timing && Wednesday_timing ? `${Wednesday_timing}` : 'Closed'}</span>
            </li>
            <li>
              <span>{Thursday_label}</span>
              <span>{Thursday_timing && Thursday_timing ? `${Thursday_timing}` : 'Closed'}</span>
            </li>
            <li>
              <span>{Friday_label}</span>
              <span>{Friday_timing && Friday_timing ? `${Friday_timing}` : 'Closed'}</span>
            </li>
            <li>
              <span>{Saturday_label}</span>
              <span>{Saturday_timing && Saturday_timing ? `${Saturday_timing}` : 'Closed'}</span>
            </li>
          </ul>
        </Col>
        <Col sm={12} md={6}>
          <div className="contactDetails__rightOuter d-flex flex-column h-100 justify-content-between">
            <div className="contactDetails__upperBlock">
              {Phone_Label && (
                <label>
                  <span>{Phone_Label}:</span>
                  {Phone_value}
                </label>
              )}
              {Email_label && (
                <label>
                  <span>{Email_label}:</span> <a href={`mailto:${Email_value}`}>{Email_value}</a>
                </label>
              )}
              {Address && <label>{Address_label}</label>}
              {Address && <Form.Text dangerouslySetInnerHTML={{ __html: Address }} />}
            </div>
            <div className="contactDetails__lowerBlock">
              {Address_label && (
                <>
                  <label>{title}</label>
                  <label>
                    <a href={getdirections_value} target="_blank" rel="noreferrer">
                      {getdirections_label ? getdirections_label : ''}
                    </a>
                  </label>
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ContactDetails;
