import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from 'utilities/constants';
import { normalizeSiteSearchResults, normalizeOffersData } from '/utilities/utils';
import { commonFetch } from '/store/actions/thunk';
import { OFFERS_ENDPOINT } from '/config/config';
import { OFFERS_SECTION_CONTENT } from '/store/actions/types';
import { getVehicleForm, getUserVehicleData } from 'libs/utils/storage';
import { getLocalData } from 'libs/utils/localStorage';
import PLPSearchService from 'services/components/plpSearch';
import { Container } from 'react-bootstrap';
import Section from 'components/common/section';
import Loader from 'components/common/loader';
import SectionHero from 'components/common/sectionHero';
import { AUTH_LOCAL_DATA } from 'libs/utils/constants';
import SectionOffersCarousel from 'components/templates/sectionOffersCarousel';
import CarForm from 'components/pages/productListing/partialForms/car';
import AppButton from 'components/common/appButton';
import Grid from 'components/common/grid';

const SiteSearch = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [carFormSelectedData, setCarFormSelectedData] = useState<any>();
  const [offersSection, setOffersSection] = useState<any>({} as any);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleCarForm, setToggleCarForm] = useState<boolean>(false);
  const [topCategoriesSection, setTopCategoriesSection] = useState<any>({});
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);

  const offersSectionContent = useSelector((state: any) => state?.storeReducer?.offersSectionContent);

  useEffect(() => {
    // Performing Search...
    performSearch();

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
    if (offersSectionContent) {
      // console.log('offersSectionContent', offersSectionContent);
      const data = normalizeOffersData(offersSectionContent);
      // console.log('offersSectionContent (normalized)', data);
      setOffersSection(data ?? {});
    }
  }, [offersSectionContent]);

  const getSearchCategories = async () => {
    try {
      setIsLoading(true);
      const requestBody: any = getVehicleForm();
      const reqBody = {
        ...requestBody,
        page: 'home',
      };
      const queryParams: any = new URLSearchParams(window.location.search);

      // let resp = await PLPSearchService.getSearchResults(
      //   reqBody?.filtersData?.makeCode,
      //   reqBody?.filtersData?.modelCode,
      //   reqBody?.filtersData?.modelYear,
      //   reqBody?.filtersData?.code,
      // );
      let resp = await PLPSearchService.getSearchResults(
        queryParams.get('make'),
        queryParams.get('model'),
        queryParams.get('year'),
        queryParams.get('variant'),
      );
      console.log('Search request & response', resp);
      resp = normalizeSiteSearchResults(resp);
      console.log('Search request & response', reqBody, resp);

      const topCategoriesSection = resp?.topCategoriesSection || {};
      const totalProductsCount = resp?.topCategoriesSection?.categories?.reduce(
        (total: number, curObj: any) => total + (curObj?.count || 0),
        0,
      );
      setTotalProductsCount(totalProductsCount);
      // setOffersSection(resp?.offersSection || {});
      setTopCategoriesSection(topCategoriesSection);
      setToggleCarForm(false);
      setIsLoading(false);
    } catch (error) {
      setToggleCarForm(false);
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setIsUserLoggedIn(checkCustomer ? true : false);
  }, []);

  const performSearch = () => {
    let loggedUserData: any = getLocalData(AUTH_LOCAL_DATA);
    loggedUserData = JSON.parse(loggedUserData);

    const queryParams: any = new URLSearchParams(window.location.search);

    // setCarFormSelectedData(getUserVehicleData());
    setCarFormSelectedData({
      make: { label: queryParams.get('make') },
      model: { label: queryParams.get('model') },
      year: { label: queryParams.get('year') },
      variant: { label: queryParams.get('variant') },
    });

    getSearchCategories();
  };

  return (
    <>
      {isLoading && (
        <Loader
          color={'var(--color-azure)'}
          loading={isLoading}
          styles={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            top: '100px',
            position: 'relative',
          }}
        />
      )}
      <section className="localisationResultsTopbar">
        <Container>
          <div>
            <p>{`${carFormSelectedData?.make?.label || ''} ${carFormSelectedData?.model?.label || ''} ${
              carFormSelectedData?.year?.label || ''
            }`}</p>
            <AppButton
              text="Edit vehicle"
              variant="outlined"
              shape="rounded"
              styles={{ color: 'var(--color-white)' }}
              onClick={() => {
                setToggleCarForm(!toggleCarForm);
              }}
            />
          </div>
        </Container>
      </section>
      {toggleCarForm ? (
        <CarForm
          page="home"
          onSearch={() => {
            // if (router.pathname === ROUTES.siteSearch) {
            //   performSearch();
            // } else {
            //   router.push({
            //     pathname: ROUTES.siteSearch,
            //   });
            // }
            const requestBody: any = getVehicleForm();

            window.location.href = `../${ROUTES.siteSearch}?make=${requestBody?.filtersData?.makeCode}&model=${requestBody?.filtersData?.modelCode}&year=${requestBody?.filtersData?.modelYear}&variant=${requestBody?.filtersData?.code}`;
          }}
        />
      ) : (
        <SectionHero
          title={`${carFormSelectedData?.make?.label || ''} ${carFormSelectedData?.model?.label || ''}`}
          preTitle={{
            children: `${totalProductsCount} products and services selected for your ${
              carFormSelectedData?.year?.value || ''
            } vehicle`,
          }}
        />
      )}
      <Section
        titleProps={{
          text: 'Services chosen for you',
        }}
      >
        <div className="siteSearchProduct">
          <Grid gridType="category" data={topCategoriesSection?.categories || []} page="siteSearch" />
        </div>
        {!isUserLoggedIn && (
          <Container>
            <div className="reorderOuter">
              <p>Previously purchased with us?</p>
              <AppButton
                text="Login to reorder"
                variant="filled"
                shape="rounded"
                onClick={(e: React.MouseEvent<HTMLElement> | undefined) => {
                  if (e) {
                    router.push({
                      pathname: ROUTES.login,
                    });
                  }
                }}
              />
            </div>
          </Container>
        )}
      </Section>
      {offersSection && offersSection?.offers?.length > 0 && (
        <SectionOffersCarousel
          isDark={false}
          styles={{ backgroundColor: 'var(--color-dark-grey)' }}
          data={offersSection.offers}
          titleProps={{
            text: offersSection.title,
            textColor: 'var(--color-white)',
          }}
        />
      )}
    </>
  );
};

export default SiteSearch;
