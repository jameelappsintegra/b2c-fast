import Head from 'next/head';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SectionHero from '/components/common/sectionHero';
import { loginRequest } from '/config/authConfig';
import { ROUTES } from '/utilities/constants';
import SectionHelpContacts from 'components/templates/sectionHelpContacts';

const Tracking = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  useEffect(() => {
    if (isAuthenticated) {
      const account = instance.getAllAccounts()[0];
      const accessTokenRequest = { account, scopes: loginRequest.scopes };
      instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
        // Acquire token silent success
        const idToken = accessTokenResponse.idToken;
        const mailId = accessTokenResponse?.idTokenClaims['email'];
      });
    } else {
      router.push({
        pathname: ROUTES.login,
      });
    }
  }, [isAuthenticated]);

  return (
    <>
      <Head>
        <title>Tracking - Al-Futtaim</title>
      </Head>
      <SectionHero className="heroTracking" title="Tracking" preTitle={{ children: '' }} />
      <SectionHelpContacts />
    </>
  );
};

export default Tracking;
