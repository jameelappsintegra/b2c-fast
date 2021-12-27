import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SectionOffersCarousel from '/components/templates/sectionOffersCarousel';
import VideoSection from '/components/templates/sectionVideo';
import {
  HEADER_FOOTER_ENDPOINT,
  OFFERS_ENDPOINT,
  OFFERS_FILTERED_ENDPOINT,
  BASE_URL,
  END_POINT_BFF_KEY,
} from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import { useRouter } from 'next/router';
import {
  CATEGORY_CONTENT_TYPE,
  HEADER_FOOTER_CONTENT,
  OFFERS_SECTION_CONTENT,
  OFFERS_SECTION_FILTERED_CONTENT,
} from '/store/actions/types';
import {
  normalizeOffersData,
  offersCatTypeLookup,
  normalizePopularProductsData,
  popularProductsFieldsLookup,
  afterPageViewDL,
} from '/utilities/utils';
import UniqueSellingProposition from '/components/templates/uniqueSellingProposition';
import OffersCLPBody from '/components/templates/offersCLPBody';
import Section from '/components/common/section';
import Grid from '/components/common/grid';
import { CATEGORY_URL_PREFIX } from 'libs/utils/constants';
import { Container } from 'react-bootstrap';
import Features from '/components/templates/features';
import SectionHero from '/components/common/sectionHero';
import CarForm from 'components/pages/productListing/partialForms/car';
import SizeForm from '/components/pages/productListing/partialForms/size';
import TabsCustom from 'components/common/tabs';
import BrandLogos from '/components/templates/brandLogos';
import { ROUTES } from '/utilities/constants';
import Head from 'next/head';
import { toTitleHeadCase, scrollToTop } from 'libs/utils/global';
import { useCookie } from 'next-cookie';
import PrivacyPolicy from 'pages/policy';
import { useIsAuthenticated } from '@azure/msal-react';

export interface CatagoryTypeProps {
  categoryType: string;
}

const catagoryType: React.SFC<CatagoryTypeProps> = ({ categoryType }) => {
  const dispatch = useDispatch();
  const router: any = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const [state, setState] = useState<any>({});

  // Store data selection
  const headerFooterContent = useSelector((state: any) => state?.storeReducer?.headerFooterContent);
  const offersSectionFilteredContent = useSelector(
    (state: any) => state?.storeReducer?.offersSectionFilteredContent,
  );
  const categoryContentType = useSelector((state: any) => state?.storeReducer?.categoryContentType);
  const relatedCategoryData = categoryContentType?.CLP_Services?.servicesList?.filter((item) => {
    return item.name === categoryType;
  });
  const pimCode = relatedCategoryData?.[0]?.PIM_Code;
  const pimFamilyCode = relatedCategoryData?.[0]?.PIM_Family_Code;

  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);

  useEffect(() => {
    dispatch(
      commonFetch({
        URL: `/bff/dx/clp&spath=/aftersales_en/home/${categoryType}&categoriesPath=/aftersales_en/home/${categoryType}/categories&keypath=/aftersales_en/home/${categoryType}/key_feature_tiles`,
        type: CATEGORY_CONTENT_TYPE,
        method: 'GET',
      }),
    );
  }, [categoryType]);

  useEffect(() => {
    dispatch(
      commonFetch({
        URL: HEADER_FOOTER_ENDPOINT,
        type: HEADER_FOOTER_CONTENT,
        method: 'GET',
      }),
    );
    getOffersSection();
  }, []);

  useEffect(() => {
    if (offersSectionFilteredContent) {
      // console.log('offersSectionFilteredContent', offersSectionFilteredContent);
      const data = normalizeOffersData(offersSectionFilteredContent);
      // console.log('offersSectionFilteredContent (normalized)', data);
      setState((prevState) => ({
        ...prevState,
        offersSection: data ?? {},
      }));
    }
  }, [offersSectionFilteredContent]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      videoSection: categoryContentType?.video,
    }));
  }, [categoryContentType]);

  const getOffersSection = () => {
    dispatch(
      commonFetch({
        URL: OFFERS_FILTERED_ENDPOINT(offersCatTypeLookup[categoryType] ?? ''),
        type: OFFERS_SECTION_FILTERED_CONTENT,
        method: 'GET',
      }),
    );
  };
  useEffect(() => {
    if (state.tyreSizeProduct) {
      getProductbySize(state.tyreSizeProduct);
      console.log(state.tyreSizeProduct, 'state.tyreSizeProduct');
    }
  }, [state.tyreSizeProduct]);
  const getProductbySize = (tyreSizeProduct) => {
    const getTyrebySizeResult = {
      products: tyreSizeProduct,
    };
    console.log(tyreSizeProduct, 'tyreSizeProduct');
    if (getTyrebySizeResult) {
      console.log('getTyrebySizeResult', getTyrebySizeResult);
      const data = normalizePopularProductsData(getTyrebySizeResult);
      console.log('getTyrebySizeResult (normalized)', data);
      setState((prevState) => ({
        ...prevState,
        productSearchResult: data ?? {},
      }));
    }
  };
  let res;
  const nodeEnv = process.env.NODE_ENV === 'development' ? 'staging' : 'live';

  useEffect(() => {
    if (isAuthenticated) {
      console.warn(checkCustomer, 'checkCustomer');
      res = {
        login: true,
        environment: nodeEnv,
        uniqueId: checkCustomer?.customerInformation?.customerCode,
      };
    } else {
      res = {
        login: false,
        environment: nodeEnv,
        uniqueId: '',
      };
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    afterPageViewDL(res, router);
  }, []);

  return (
    <>
      <Head>
        <title>{toTitleHeadCase(categoryContentType.clc_title ?? '')} - Al-Futtaim</title>
      </Head>
      {categoryContentType &&
        (categoryType?.toLowerCase() === 'offers' ? (
          <OffersCLPBody />
        ) : categoryType?.toLowerCase() === 'privacy_policy' ? (
          <PrivacyPolicy />
        ) : (
          <SectionHero title={toTitleHeadCase(categoryContentType.clc_title ?? '')}>
            {categoryType.toLowerCase() === 'tyres' ? (
              <TabsCustom
                id="carSearchTabs"
                defaultActiveKey={true ? 'size' : 'car'}
                tabs={[
                  {
                    title: 'Find by size',
                    key: 'size',
                    children: (
                      <SizeForm
                        onSearch={(reqBody: any) => {
                          setState((prevState) => ({
                            ...prevState,
                            tyreSizeProduct: reqBody?.tyreSizeProduct ?? '',
                          }));
                          router.push({
                            pathname: ROUTES.productSearch,
                            query: `category=${categoryType}&width=${reqBody?.width}&load=${reqBody?.load}&profile=${reqBody?.profile}&rimSize=${reqBody?.rimSize}&specialist=${reqBody?.specialist}&speed=${reqBody?.speed}`,
                          });
                        }}
                      />
                    ),
                  },
                  {
                    title: 'Find by car',
                    key: 'car',
                    children: (
                      <CarForm
                        onSearch={(reqBody: any) => {
                          router.push({
                            pathname: ROUTES.productSearch,
                            query: `type=TOPCATEGORIES&category=${categoryType}&make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
                          });
                        }}
                      />
                    ),
                  },
                ]}
                width="auto"
              />
            ) : (
              <CarForm
                onSearch={(reqBody: any) => {
                  router.push({
                    pathname: ROUTES.productSearch,
                    query: `type=TOPCATEGORIES&category=${categoryType}&make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
                  });
                }}
              />
            )}
          </SectionHero>
        ))}

      {categoryContentType?.CLP_Services?.totalItems > 0 && (
        <Section
          titleProps={{
            text: categoryContentType?.CLP_Services?.servicesTitle,
          }}
        >
          <Grid
            gridType="category"
            isCLP
            data={categoryContentType?.CLP_Services?.servicesList}
            page={'clp'}
            // onChange={(product: IProductProps) =>
            //   this.handleProductComparison(product)
            // }
          />
        </Section>
      )}
      {categoryContentType?.CLP_Logos?.totalItems > 0 && (
        <Section
          styles={{
            backgroundColor: 'var(--color-lightest-grey)',
          }}
        >
          <Container>
            <BrandLogos data={categoryContentType?.CLP_Logos?.logosList} />
          </Container>
        </Section>
      )}
      {categoryContentType?.key_feature_tiles?.PromiseList && (
        <Section>
          <Container>
            <Features data={categoryContentType?.key_feature_tiles?.PromiseList} />
          </Container>
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
      {headerFooterContent?.our_promise && categoryType?.toLowerCase() !== 'privacy_policy' && (
        <UniqueSellingProposition
          titleProps={{
            text: headerFooterContent?.our_promise?.heading,
            textAlign: `${router.locale === 'ar' ? 'right' : 'left'}`,
          }}
          backgroundImage={headerFooterContent?.our_promise?.backgroundImage}
          data={headerFooterContent?.our_promise?.PromiseList}
        />
      )}
      {state.offersSection?.offers?.length > 0 &&
        categoryType?.toLowerCase() !== 'offers' &&
        categoryType?.toLowerCase() !== 'privacy_policy' && (
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
    </>
  );
};

export default catagoryType;
export async function getServerSideProps(context) {
  const { categoryType } = context.query;

  return {
    props: { categoryType },
  };
}
