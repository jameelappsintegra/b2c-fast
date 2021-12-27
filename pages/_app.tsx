import '../styles/globals.scss';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { initializeStore } from '../store';
import { createWrapper } from 'next-redux-wrapper';
import NetworkInter from '../services/interceptor';
import Layout from '/components/layout';
// import $ from 'jquery';
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ProgressBar from '@badrap/bar-of-progress';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import CookieBox from '/components/common/CookieBox';
import { msalConfig } from '/config/authConfig';

// import '../components/common/section/title/style.scss';
// import '../components/common/section/style.scss';
// import '../components/templates/sectionOffersCarousel/offersCarousel/style.scss';
// import '../components/templates/sectionOffersCarousel/style.scss';
// import '../components/templates/sectionOffersCarousel/offersCarousel/style.scss';

export const msalInstance = new PublicClientApplication(msalConfig);

function MyApp({ Component, pageProps }: AppProps) {
  const [canonicalTag, SetCanonical] = React.useState('');

  const router = useRouter();
  const isArabic = router.locale === 'ar' ? true : false;
  let canonical;
  useEffect(() => {
    canonical = window.location.href;
    SetCanonical(canonical);
  }, [router]);
  useEffect(() => {
    const progress = new ProgressBar({
      size: 2,
      color: '#29e',
      className: 'bar-of-progress',
      delay: 20,
    });
    Router.events.on('routeChangeStart', progress.start);
    Router.events.on('routeChangeComplete', progress.finish);
    Router.events.on('routeChangeError', progress.finish);
    return () => {
      Router.events.off('routeChangeStart', progress.start);
      Router.events.off('routeChangeComplete', progress.finish);
      Router.events.off('routeChangeError', progress.finish);
    };
  }, []);

  isArabic ? require('../styles/globals-ar.scss') : '';

  return (
    <>
      <Head>
        {canonicalTag ? (
          <>
            <link rel="canonical" href={canonicalTag}></link>
            <link rel="alternate" href={canonicalTag} hrefLang={router?.locale} />
          </>
        ) : null}
      </Head>
      <MsalProvider instance={msalInstance}>
        <Layout>
          <Component {...pageProps} />
          <CookieBox />
        </Layout>
      </MsalProvider>
    </>
  );
}

const initStore = initializeStore();
NetworkInter.setupInterceptors(initStore.store);
export default createWrapper(() => initStore.store).withRedux(MyApp);
