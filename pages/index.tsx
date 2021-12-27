import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SectionOffersCarousel from '/components/templates/sectionOffersCarousel';
import VideoSection from '/components/templates/sectionVideo';
import HomeHeroPanel from '/components/templates/homeHeroPanel';
import { HEADER_FOOTER_ENDPOINT, HERO_PANEL_ENDPOINT, OFFERS_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import { HEADER_FOOTER_CONTENT, HERO_PANEL_CONTENT, OFFERS_SECTION_CONTENT } from '/store/actions/types';
import { normalizeHeroPanelData, normalizeOffersData } from '../utilities/utils';
import UniqueSellingProposition from '/components/templates/uniqueSellingProposition';
import Section from '/components/common/section';
import Grid from '/components/common/grid';
import { CATEGORY_URL_PREFIX } from 'libs/utils/constants';
import { useCookie } from 'next-cookie';
import { useRouter } from 'next/router';

export default function Home() {
  const dispatch = useDispatch();
  const router: any = useRouter();

  const [state, setState] = useState<any>({});
  const [sitemap, setSitemap] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Store data selection
  const headerFooterContent = useSelector((state: any) => state?.storeReducer?.headerFooterContent);
  const heroPanelContent = useSelector((state: any) => state?.storeReducer?.heroPanelContent);
  const offersSectionContent = useSelector((state: any) => state?.storeReducer?.offersSectionContent);

  useEffect(() => {
    // Fetching Header/Footer...
    dispatch(
      commonFetch({
        URL: HEADER_FOOTER_ENDPOINT,
        type: HEADER_FOOTER_CONTENT,
        method: 'GET',
      }),
    );

    // Fetching Hero Panel...
    dispatch(
      commonFetch({
        URL: HERO_PANEL_ENDPOINT,
        type: HERO_PANEL_CONTENT,
        method: 'GET',
      }),
    );

    // Fetching Offers Section...
    dispatch(
      commonFetch({
        URL: OFFERS_ENDPOINT,
        type: OFFERS_SECTION_CONTENT,
        method: 'GET',
      }),
    );
  }, []);

  useEffect(() => {
    // console.log('headerFooterContent', headerFooterContent);
    setState((prevState) => ({
      ...prevState,
      videoSection: headerFooterContent?.video,
    }));
    const sitemapResult = headerFooterContent?.sitemap?.filter((itemData) => {
      return itemData?.visibility?.catalogue === 'show';
    });
    setSitemap(sitemapResult);
  }, [headerFooterContent]);

  useEffect(() => {
    if (heroPanelContent) {
      const data = normalizeHeroPanelData(heroPanelContent);
      setState((prevState) => ({
        ...prevState,
        heroSection: data,
      }));
    }
  }, [heroPanelContent]);

  useEffect(() => {
    if (offersSectionContent) {
      // console.log('offersSectionContent', offersSectionContent);
      const data = normalizeOffersData(offersSectionContent);
      // console.log('offersSectionContent (normalized)', data);
      setState((prevState) => ({
        ...prevState,
        offersSection: data ?? {},
      }));
    }
  }, [offersSectionContent]);
  return (
    <div>
      <Head>
        <title>Al-Futtaim</title>
      </Head>
      {/* <h1>This is home page</h1> */}

      {state.heroSection?.length > 0 && <HomeHeroPanel heroSection={state.heroSection} />}
      {headerFooterContent?.sitemap && (
        <Section
          titleProps={{
            text: 'Top services across our range',
          }}
        >
          {sitemap && <Grid gridType="category" urlPrefix={CATEGORY_URL_PREFIX} data={sitemap} />}
        </Section>
      )}
      {state.videoSection && (
        <VideoSection
          titleProps={{
            text: state.videoSection.Video_Title,
          }}
          url={state.videoSection.Video_Script}
        />
      )}
      {headerFooterContent?.our_promise && (
        <UniqueSellingProposition
          titleProps={{
            text: headerFooterContent?.our_promise?.heading,
            textAlign: `${router.locale === 'ar' ? 'right' : 'left'}`,
          }}
          backgroundImage={headerFooterContent?.our_promise?.background_image}
          data={headerFooterContent?.our_promise?.PromiseList}
        />
      )}
      {state.offersSection?.offers?.length > 0 && (
        <SectionOffersCarousel
          isDark
          styles={{ backgroundColor: 'var(--color-promo-background)' }}
          data={state.offersSection?.offers}
          titleProps={{
            text: state.offersSection?.title,
            textColor: 'var(--color-white)',
          }}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { categoryType } = context.query;
  const {
    BASE_URL,
    DEFAULT_USED_BRANCH,
    DEFAULT_NEW_BRANCH,
    NEXT_PUBLIC_AZURE_CLIENT_ID,
    NEXT_PUBLIC_SIGNUP_SIGNIN_AUTHORITY,
    NEXT_PUBLIC_SIGNUP_AUTHORITY,
    NEXT_PUBLIC_FORGOT_PASSWORD_AUTHORITY,
    NEXT_PUBLIC_EDIT_PROFILE_AUTHORITY,
    NEXT_PUBLIC_AZURE_REDIRECT_URI,
    NEXT_PUBLIC_AZURE_LOGIN_URL,
    NEXT_PUBLIC_INSTRUMENTATION_KEY,
    NEXT_PUBLIC_APPINSIGHT_ACCOUNT_ID,
    NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CMS_API_ENDPOINT,
  } = process.env;
  const cookie = useCookie(context);
  cookie.set('NEXT_PUBLIC_CMS_API_ENDPOINT', NEXT_PUBLIC_CMS_API_ENDPOINT, { path: '/' });
  cookie.set('NEXT_PUBLIC_AZURE_CLIENT_ID', NEXT_PUBLIC_AZURE_CLIENT_ID, { path: '/' });
  cookie.set('NEXT_PUBLIC_SIGNUP_SIGNIN_AUTHORITY', NEXT_PUBLIC_SIGNUP_SIGNIN_AUTHORITY, { path: '/' });
  cookie.set('NEXT_PUBLIC_SIGNUP_AUTHORITY', NEXT_PUBLIC_SIGNUP_AUTHORITY, { path: '/' });
  cookie.set('NEXT_PUBLIC_FORGOT_PASSWORD_AUTHORITY', NEXT_PUBLIC_FORGOT_PASSWORD_AUTHORITY, { path: '/' });
  cookie.set('NEXT_PUBLIC_EDIT_PROFILE_AUTHORITY', NEXT_PUBLIC_EDIT_PROFILE_AUTHORITY, { path: '/' });
  cookie.set('NEXT_PUBLIC_AZURE_REDIRECT_URI', NEXT_PUBLIC_AZURE_REDIRECT_URI, { path: '/' });
  cookie.set('NEXT_PUBLIC_AZURE_LOGIN_URL', NEXT_PUBLIC_AZURE_LOGIN_URL, { path: '/' });
  cookie.set('NEXT_PUBLIC_BASE_URL', NEXT_PUBLIC_BASE_URL, { path: '/' });
  return {
    props: {},
  };
}
