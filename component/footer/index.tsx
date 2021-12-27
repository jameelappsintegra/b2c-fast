import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HOME_ENDPOINT, LOCATION_ENDPOINT, VEHICLE_CARE_ENDPOINT } from '/config/config';
import { commonFetch } from '../../store/actions/thunk';
import FooterBottom from './footerBottom';
import FooterTabs from './footerTabs';

const Footer = () => {
  const dispatch = useDispatch();
  // Store data selection
  const headerFooterContent = useSelector((state: any) => state?.storeReducer?.headerFooterContent);
  const locationContent = useSelector((state: any) => state?.storeReducer?.locationContent);
  const vehicleCareContent = useSelector((state: any) => state?.storeReducer?.vehicleCareContent);

  useEffect(() => {
    // API call with reusable commonFetch function
    dispatch(
      commonFetch({
        URL: HOME_ENDPOINT,
        type: 'HEADER_FOOTER_CONTENT',
        method: 'GET',
      }),
    );
    dispatch(
      commonFetch({
        URL: LOCATION_ENDPOINT,
        type: 'LOCATION_CONTENT',
        method: 'GET',
      }),
    );
    dispatch(
      commonFetch({
        URL: VEHICLE_CARE_ENDPOINT,
        type: 'VEHICLE_CARE_CONTENT',
        method: 'GET',
      }),
    );
  }, []);

  useEffect(() => {
    // Consume api response here...will trigger once data available
  }, [headerFooterContent, locationContent, vehicleCareContent]);

  return (
    <footer className="footer">
      {vehicleCareContent && locationContent && <FooterTabs {...vehicleCareContent} {...locationContent} />}
      <FooterBottom additionalLink={headerFooterContent.additionalLink} social={headerFooterContent.social} />
    </footer>
  );
};

export default Footer;
