import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SectionOffersCarousel from '/components/templates/sectionOffersCarousel';
import {
  categoryTypesToB2cTypes,
  HEADER_FOOTER_ENDPOINT,
  OFFERS_FILTERED_ENDPOINT,
  POPULAR_PRODUCTS_ENDPOINT,
} from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import { useRouter } from 'next/router';
import {
  CATEGORY_CONTENT_TYPE,
  HEADER_FOOTER_CONTENT,
  OFFERS_SECTION_FILTERED_CONTENT,
  POPULAR_PRODUCTS_CONTENT,
} from '/store/actions/types';
import {
  normalizeOffersData,
  normalizePopularProductsData,
  notification,
  NOTIFICATION_TYPE,
  offersCatTypeLookup,
  popularProductsFieldsLookupByPimCode,
} from '/utilities/utils';
import Section from '/components/common/section';
import Grid from '/components/common/grid';
import { PLACEHOLDER_COUNT } from 'libs/utils/constants';
import { Container } from 'react-bootstrap';
import Features from '/components/templates/features';
import SectionHero from '/components/common/sectionHero';
import CarForm from 'components/pages/productListing/partialForms/car';
import SizeForm from '/components/pages/productListing/partialForms/size';
import TabsCustom from 'components/common/tabs';
import BrandLogos from '/components/templates/brandLogos';
import { ROUTES } from '/utilities/constants';
import Head from 'next/head';
import { toTitleHeadCase } from 'libs/utils/global';
import ProductComparison from '/components/templates/productComparison';

export interface CatagoryTypeProps {
  categoryType: string;
  categorySubType: string;
}

const categorySubType: React.SFC<CatagoryTypeProps> = ({ categoryType, categorySubType }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, setState] = useState<any>({});
  const [comparableProducts, setComparableProducts] = useState<any>([]);

  // Store data selection
  const headerFooterContent = useSelector((state: any) => state?.storeReducer?.headerFooterContent);
  const offersSectionFilteredContent = useSelector(
    (state: any) => state?.storeReducer?.offersSectionFilteredContent,
  );
  const categoryContentType = useSelector((state: any) => state?.storeReducer?.categoryContentType);
  const popularProductsContent = useSelector((state: any) => state?.storeReducer?.popularProductsContent);
  const relatedSubCategoryData = categoryContentType?.CLP_Services?.servicesList.filter((item) => {
    return item.name === categorySubType;
  });
  const pimCode = relatedSubCategoryData?.[0]?.PIM_Code;
  const pimFamilyCode = relatedSubCategoryData?.[0]?.PIM_Family_Code;
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
    getPopularProductsSection();
  }, []);

  useEffect(() => {
    getPopularProductsSection();
  }, [pimCode]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      videoSection: headerFooterContent?.video,
    }));
  }, [headerFooterContent]);

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
    if (popularProductsContent) {
      // console.log('popularProductsContent', popularProductsContent);
      const data = normalizePopularProductsData(popularProductsContent);
      // console.log('popularProductsContent (normalized)', data);
      setState((prevState) => ({
        ...prevState,
        popularProducts: data ?? {},
      }));
    }
  }, [popularProductsContent]);

  useEffect(() => {
    if (state.tyreSizeProduct) {
      getProductbySize(state.tyreSizeProduct);
      // console.log(state.tyreSizeProduct, 'state.tyreSizeProduct');
    }
  }, [state.tyreSizeProduct]);
  const getProductbySize = (tyreSizeProduct) => {
    const getTyrebySizeResult = {
      products: tyreSizeProduct,
    };
    // console.log(tyreSizeProduct, 'tyreSizeProduct');
    if (getTyrebySizeResult) {
      // console.log('getTyrebySizeResult', getTyrebySizeResult);
      const data = normalizePopularProductsData(getTyrebySizeResult);
      // console.log('getTyrebySizeResult (normalized)', data);
      setState((prevState) => ({
        ...prevState,
        productSearchResult: data ?? {},
      }));
    }
  };
  const getOffersSection = () => {
    dispatch(
      commonFetch({
        URL: OFFERS_FILTERED_ENDPOINT(offersCatTypeLookup[categoryType] ?? ''),
        type: OFFERS_SECTION_FILTERED_CONTENT,
        method: 'GET',
      }),
    );
  };
  const handleonChange = (product) => {
    // console.log(product, 'product');
    // console.log(state?.popularProducts, 'state?.popularProducts');
    if (comparableProducts.length <= 2 || product.isChecked) {
      const updatedProducts = state?.popularProducts?.products.map((item) => {
        let result = item;
        if (item.id === product.id) {
          result = { ...item, isChecked: !item.isChecked };
        }
        return result;
      });
      const filteredProducts = updatedProducts.filter((item) => {
        return item.isChecked;
      });
      setComparableProducts(filteredProducts);

      setState({ ...state, popularProducts: { products: updatedProducts } });
    } else {
      notification(NOTIFICATION_TYPE.warning, 'Maximum 3 products can be compared');
    }
  };

  const handleRemoveItem = (product) => {
    const result = comparableProducts.filter((item) => {
      return item.id !== product.id;
    });
    const updatedProducts = state?.popularProducts?.products.map((item) => {
      let result = item;
      if (item.id === product.id) {
        result = { ...item, isChecked: !item.isChecked };
      }
      return result;
    });

    setState({ ...state, popularProducts: { products: updatedProducts } });
    setComparableProducts(result);
  };

  const getPopularProductsSection = () => {
    if (pimCode) {
      dispatch(
        commonFetch({
          URL: POPULAR_PRODUCTS_ENDPOINT(
            categoryTypesToB2cTypes[categoryType],
            popularProductsFieldsLookupByPimCode[pimFamilyCode],
            pimCode,
            pimFamilyCode,
          ),
          type: POPULAR_PRODUCTS_CONTENT,
          method: 'GET',
          headers: {
            'Paging-Info': 'start-index=0|no-of-records=9',
          },
        }),
      );
    }
  };
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // });
  return (
    <>
      <Head>
        <title>
          {categoryType.split('_').join(' ').replace('and', '&')}{' '}
          {categorySubType ? `- ${toTitleHeadCase(categorySubType)}` : ''} - Al-Futtaim
        </title>
      </Head>
      {categoryContentType && (
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
                          query: `type=PARENT&category=${categoryType}&categorySubType=${categorySubType}&make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
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
                  query: `type=PARENT&category=${categoryType}&categorySubType=${categorySubType}&make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
                });
              }}
            />
          )}
        </SectionHero>
      )}
      <Section
        titleProps={{
          text: state?.popularProducts?.heading,
        }}
      >
        <Grid
          type="product"
          data={state?.popularProducts?.products ?? []}
          onChange={(product: any) => handleonChange(product)}
          page={'plpLanding'}
        />
        {comparableProducts?.length > 0 && (
          <ProductComparison
            items={comparableProducts}
            placeholderCount={PLACEHOLDER_COUNT}
            onClick={(item) => handleRemoveItem(item)}
          />
        )}
      </Section>
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
    </>
  );
};

export default categorySubType;
export async function getServerSideProps(context) {
  const { categoryType } = context?.query;
  const { categorySubType } = context?.query;
  return {
    props: { categoryType, categorySubType },
  };
}
