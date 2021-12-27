import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CHECKOUT_JOURNEY_ENDPOINT, CHECK_CUSTOMER_CHECK, HOME_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import Navbar from './navbar';
import TopHeader from './topHeader';
import ResponsiveDrawer from './responsiveDrawer';
import { accountHeaderItemsList, ROUTES } from '/utilities/constants';
import { useRouter } from 'next/router';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '/config/authConfig';

const Header = (props) => {
  const router = useRouter();
  const { fixedHeader } = props;
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();
  const [authTokenObj, SetAuthTokenObj] = useState(null);
  const { instance, accounts, inProgress } = useMsal();
  // Store data selection
  const headerFooterContent = useSelector((state: any) => {
    return state?.storeReducer?.headerFooterContent;
  });
  const chekoutJourneyContent = useSelector((state: any) => state?.storeReducer?.chekoutJourneyContent);

  // dataLayer for Header footer
  useEffect(() => {
    dispatch(
      commonFetch({
        URL: HOME_ENDPOINT,
        type: 'HEADER_FOOTER_CONTENT',
        method: 'GET',
      }),
    );
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      SetAuthTokenObj(sessionStorage.getItem('idTokenMyAccount'));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const account = instance.getAllAccounts()[0];
    const accessTokenRequest = { account, scopes: loginRequest.scopes };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    if (inProgress === 'none' && accounts.length > 0) {
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          SetAuthTokenObj(accessTokenResponse?.idToken);
          // Call your API with token
        })
        .catch((err) => {
          // console.log(err, err.name, 'this is error to acquireToken Silent');
          if (err.name === 'InteractionRequiredAuthError' || err.name === 'InteractionRequiredAuthError') {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then((accessTokenResponse) => {
                SetAuthTokenObj(accessTokenResponse);
                console.log(accessTokenResponse, 'Error tO get acquireTokenPopup 1');
                // Call your API with token
              })
              .catch((err) => {
                console.log(err, 'Error to get acquireTokenPopup');
                instance.logoutPopup().then((res) => {
                  sessionStorage.removeItem('idTokenMyAccount');
                  sessionStorage.removeItem('guestUser');
                  dispatch({ type: 'CHECK_CUSTOMER', payload: {} });
                });
              });
          }
        });
    }
  }, [inProgress, accounts, instance]);

  useEffect(() => {
    if (isAuthenticated && authTokenObj !== null) {
      sessionStorage.setItem('idTokenMyAccount', authTokenObj);
      dispatch(
        commonFetch({
          URL: `${CHECK_CUSTOMER_CHECK}`,
          type: 'CHECK_CUSTOMER',
          method: 'POST',
          headers: {
            'X-Access-Token': authTokenObj,
          },
        }),
      );
    }
  }, [authTokenObj, isAuthenticated]);
  useEffect(() => {
    if (router?.pathname === '/checkoutJourney') {
      dispatch(
        commonFetch({
          URL: CHECKOUT_JOURNEY_ENDPOINT,
          type: 'CHECKOUT_JOURNEY_CONTENT',
          method: 'GET',
        }),
      );
    }
  }, [router?.pathname]);

  return (
    <header className={'header'}>
      <div className={`${fixedHeader ? 'fixed' : 'not-fixed'}`}>
        <div className="d-none d-md-block">
          {headerFooterContent?.logo ? <TopHeader items={headerFooterContent?.logo} /> : null}
          {router?.pathname === '/checkoutJourney' ? (
            <Navbar className="navbar--stepper" items={chekoutJourneyContent?.Nav} type="stepper" />
          ) : router?.pathname.startsWith(ROUTES.account) ? (
            <Navbar items={accountHeaderItemsList} type={ROUTES.account.replace('/', '')} />
          ) : (
            <Navbar items={headerFooterContent?.sitemap} />
          )}
        </div>
        <div className="d-block d-sm-block d-md-none">
          {headerFooterContent?.logo ? <ResponsiveDrawer items={headerFooterContent?.logo} /> : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
