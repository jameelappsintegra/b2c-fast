import { useState } from 'react';
import { Container, Row, Form, Col } from 'react-bootstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import FooterLocations from '../footerLocations';
import Link from 'next/link';
import AppButton from 'components/common/appButton';
import FormCustom from 'components/common/form';
import Subscription from './subscription';
import EnquiryForm from './enquiryForm';
import GetInTouch from './getInTouch';
import { toTitleHeadCase } from 'libs/utils/global';

const FooterTabs = (props: any) => {
  const [activeTab, setActiveTab] = useState<string>('1' as any);

  const pushToFooterDLAnalytics = (item) => {
    window?.['dataLayer'].push({
      event: 'footerEvent',
      event_category: 'Footer Navigation', // Static
      event_action: 'Click', // Static
      event_label: `${item?.name}`, // Capture the Element user clicked
    });
  };

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const getvalidURL = (item) => {
    if (item.Name === 'looking_after_your_vehicle') {
      return (
        item?.secondlevel_links?.length > 0 &&
        item?.secondlevel_links
          ?.filter((itemData: any) => {
            return itemData?.visibility === 'show';
          })
          .map((item: any, index: number) => (
            <li className="b-footer__item" key={index} onClick={() => pushToFooterDLAnalytics(item)}>
              <Link href={item?.path ? `/blog/${item?.name}` : '#'}>{toTitleHeadCase(item.title)}</Link>
            </li>
          ))
      );
    }
    if (item.Name === 'Latest Offers') {
      return (
        item?.secondlevel_links?.length > 0 &&
        item?.secondlevel_links
          ?.filter((itemData: any) => {
            return itemData?.visibility === 'show';
          })
          .map((item: any, index: number) => (
            <li className="b-footer__item" key={index} onClick={() => pushToFooterDLAnalytics(item)}>
              <Link href={item?.path ? `/offer/${item?.path.split('/')[4]}` : '#'}>
                {toTitleHeadCase(item.title)}
              </Link>
            </li>
          ))
      );
    }
    return (
      item?.secondlevel_links?.length > 0 &&
      item?.secondlevel_links
        ?.filter((itemData: any) => {
          return itemData?.visibility === 'show';
        })
        .map((item: any, index: number) => (
          <li className="b-footer__item" key={index} onClick={() => pushToFooterDLAnalytics(item)}>
            <Link href={item?.path ? `/${item?.path.split('/')[3]}` : '#'}>
              {toTitleHeadCase(item.title)}
            </Link>
          </li>
        ))
    );
  };

  return (
    <>
      {props?.vehiclecarelinks && (
        <div className="footerTabs">
          <div className="footerTabs__inner">
            <Container>
              <div className="d-flex align-items-center justify-content-between">
                <Nav tabs>
                  <NavItem className="footerTabs__tabItem">
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => {
                        toggle('1');
                      }}
                    >
                      Vehicle Care
                    </NavLink>
                  </NavItem>
                  <NavItem className="footerTabs__tabItem">
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => {
                        toggle('2');
                      }}
                    >
                      Contact
                    </NavLink>
                  </NavItem>
                  <NavItem className="footerTabs__tabItem">
                    <NavLink
                      className={classnames({ active: activeTab === '3' })}
                      onClick={() => {
                        toggle('3');
                      }}
                    >
                      Locations
                    </NavLink>
                  </NavItem>
                </Nav>
                <div className="footerTabs__phone-outer">
                  <a href="tel:80069227" className="w-100 d-inline-flex justify-content-end">
                    <span className="icon">
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <span className="contact d-none d-md-block">800MYCAR</span>
                  </a>
                </div>
              </div>
            </Container>
          </div>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Container>
                <Row>
                  <Col sm="12">
                    <div className="footerVehicleCare b-footer">
                      <Row className="b-footer__bottomOuter">
                        {props?.vehiclecarelinks?.firstlevel_links.length > 0 &&
                          props?.vehiclecarelinks?.firstlevel_links?.map((item: any, index: number) => (
                            <Col
                              xs={6}
                              sm={item.Name === 'looking_after_your_vehicle' ? '6' : '3'}
                              key={index}
                            >
                              <h6 className="b-footer__title">{item.title}</h6>
                              <ul
                                className={`b-footer__list ${
                                  item.Name === 'looking_after_your_vehicle' ? 'split-col' : ''
                                }`}
                              >
                                {getvalidURL(item)}
                              </ul>
                              {item.Name === 'looking_after_your_vehicle' ? <Subscription /> : ''}
                            </Col>
                          ))}
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Container>
            </TabPane>
            <TabPane tabId="2">
              <Container>
                <Row>
                  <GetInTouch />
                  <EnquiryForm locations={props?.locations} />
                </Row>
              </Container>
            </TabPane>
            <TabPane tabId="3">
              <Container>
                <Row>
                  <Col sm="12">
                    <FooterLocations locations={props?.locations} />
                  </Col>
                </Row>
              </Container>
            </TabPane>
          </TabContent>
          {/* {<Subscription />} */}
        </div>
      )}
    </>
  );
};

export default FooterTabs;
