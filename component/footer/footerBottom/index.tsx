import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { BASE_CMS_ENDPOINT, PRIVACY_POLICY_ENDPOINT, TERMS_CONDITIONS_ENDPOINT } from '/config/config';
import { imgRefactorURI } from '/utilities/utils';

const FooterBottom = (props) => {
  const { social = [], additionalLink = [] } = props;

  const pushToSocaialLinkDLAnalytics = (item) => {
    window?.['dataLayer'].push({
      event: 'socialClick',
      event_category: 'Social', // Static
      event_action: 'Click', // Static
      event_label: `${item?.link}`, // Capture the Element user clicked
    });
  };

  return (
    <div className="footerBottom">
      <Container>
        <Row className="footerBottom__bottomOuter">
          <Col xs={12} sm={9}>
            <div className="footerBottom__links-wrapper">
              {additionalLink?.copyright && (
                <span className="footerBottom__copyrights">{additionalLink?.copyright}</span>
              )}
              <ul className="footerBottom__extraLinks-list">
                {additionalLink?.FooterAdditionalLinks?.map((link: any, index: any) => (
                  <li className="footerBottom__extraLinks-item" key={index}>
                    <Link href={link?.path ? `${link?.name}` : '#'}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={3}>
            <ul className="footerBottom__socialLinks-list">
              {social?.SocialList?.map((item: any, index: any) => (
                <li
                  className="footerBottom__socialLinks-item"
                  key={index}
                  onClick={() => pushToSocaialLinkDLAnalytics(item)}
                >
                  <Link href={item.link}>
                    <img src={imgRefactorURI(item.icon)} />
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FooterBottom;
