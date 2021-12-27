import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Container } from 'react-bootstrap';
import Section from 'components/common/section';
import SectionHero from 'components/common/sectionHero';
import SectionFiltersBlue, { ISectionFiltersBlueItemProps } from 'components/templates/sectionFiltersBlue';
import Grid from 'components/common/grid';
import Features from 'components/templates/features';
import ProductComparison from '/components/templates/productComparison';
import { PLACEHOLDER_COUNT } from 'libs/utils/constants';
import router from 'next/router';
import TabsCustom from '/components/common/tabs';
import CarForm from '/components/pages/productListing/partialForms/car';
import SizeForm from '/components/pages/productListing/partialForms/size';
import BrandLogos from '/components/templates/brandLogos';
import { ROUTES } from '/utilities/constants';
import { commonFetch } from '/store/actions/thunk';
import { POPULAR_PRODUCT_BYCAR, POPULAR_PRODUCT_BYSIZE } from '/config/config';
import { useDispatch, useSelector } from 'react-redux';
import {
  normalizePopularProductsData,
  notification,
  NOTIFICATION_TYPE,
  popularProductsFieldsLookup,
} from '/utilities/utils';
import { ToastContainer } from 'react-toastify';
import { CATEGORY_CONTENT_TYPE } from '/store/actions/types';

interface IProductSearchResultsState {
  filters?: ISectionFiltersBlueItemProps[];
  productsData: any[];
  count: number | null;
  comparableProducts: any[];
  products: any;
  productSections: any;
}
export interface CatagoryTypeProps {
  categoryType: string;
  categorySubType: string;
}
const productSearch: React.SFC<any> = (props) => {
  const { categoryType, category, compareDisabled, make, model, year, variant } = props;
  const placeholderCount = PLACEHOLDER_COUNT;
  const dispatch = useDispatch();
  const [comparableProducts, setComparableProducts] = useState<any>([]);
  const [state, setState] = useState<any>({
    filters: [
      {
        title: 'Sort by',
        options: [
          { name: 'relevance', value: 'relevance' },
          { name: 'price low - high', value: 'price low - high' },
          { name: 'price high - low', value: 'price high - low' },
        ],
      },
    ],
    productsData: [],
    count: null,
    popularProducts: {},
    productSearchResult: [],
  });
  if (typeof window !== 'undefined') {
    const hashId = window.location.hash;
    if (hashId) {
      // Use the hash to find the first element with that id
      const element = document.querySelector(hashId);

      if (element) {
        // Smooth scroll to that elment
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }
  }
  const categoryContentType = useSelector((state: any) => state?.storeReducer?.categoryContentType);
  const popularProductsContent = useSelector((state: any) => state?.storeReducer?.popularProductsContent);
  useEffect(() => {
    const reqBody: any = JSON.parse(localStorage.getItem('productSearchReqBody') ?? '{}');
    getProducts(reqBody);
    getPopularProductsSection();
    getProductbySize();
  }, []);
  useEffect(() => {
    dispatch(
      commonFetch({
        URL: `/bff/dx/clp&spath=/aftersales_en/home/${categoryType}&categoriesPath=/aftersales_en/home/${categoryType}/categories&keypath=/aftersales_en/home/${categoryType}/key_feature_tiles`,
        type: CATEGORY_CONTENT_TYPE,
        method: 'GET',
      }),
    );
  }, [categoryType]);

  // useEffect(() => {
  //   if (popularProductsContent) {
  //     console.log('popularProductsContent', popularProductsContent);
  //     const data = normalizePopularProductsData(popularProductsContent);
  //     console.log('popularProductsContent (normalized)', data);
  //     setState((prevState) => ({
  //       ...prevState,
  //       popularProducts: data ?? {},
  //     }));
  //   }
  // }, [popularProductsContent]);

  const getProducts = async (params: any) => {
    try {
      // const [resp = {}] = await PLPSearchService.getSearchResults(params);
      // this.setState({ productsData: resp?.results, count: resp?.count });
    } catch (error) {
      console.log(error);
    }
  };

  const getProductSize = async (params: any) => {
    try {
      // const [resp = {}] = await PLPSearchService.getSearchResults(params);
      // this.setState({ productsData: resp?.results, count: resp?.count });
    } catch (error) {
      console.log(error);
    }
  };
  const getPopularProductsSection = (filteredValue = 'attributes.ff_popular.values.EN=1') => {
    const categoryType = {
      'car-servicing': 'Servicing',
      Tyres: 'Tyres',
      Batteries: 'Batteries',
      Air_Conditioning: 'Air Conditioning',
      car_care: 'Car Care',
    };
    const axios = require('axios');
    const data = JSON.stringify({
      type: 'productSearch',
      vehicleQuery: {
        make,
        model,
        year,
        variant,
      },
      categories: [categoryType[category]],
      query: {
        fields: popularProductsFieldsLookup[category],
        sort: filteredValue,
      },
    });

    const config = {
      data,
      method: 'post',
      url: POPULAR_PRODUCT_BYCAR,
      headers: {
        'Cache-Control': 'no-cache',
        'Paging-Info': 'start-index=0|no-of-records=50',
        'Content-Type': 'application/json',
      },
    };

    axios(config)
      // tslint:disable-next-line: ter-prefer-arrow-callback
      .then(function (response) {
        console.log(response.data[category]?.product);
        const popularProductsContent = {
          products: response.data[categoryType[category]]?.product,
        };
        if (popularProductsContent) {
          // console.log('popularProductsContent', popularProductsContent);
          const data = normalizePopularProductsData(popularProductsContent);
          // console.log('popularProductsContent (normalized)', data);
          setState((prevState) => ({
            ...prevState,
            productSearchResult: data ?? {},
          }));
        }
      })
      // tslint:disable-next-line: ter-prefer-arrow-callback
      .catch(function (error) {
        console.log(error);
      });

    // dispatch(
    //   commonFetch({
    //     URL: POPULAR_PRODUCTS_ENDPOINT(
    //       categoryTypesToB2cTypes[category],
    //       popularProductsFieldsLookup[category],
    //       {},
    //     ),
    //     type: POPULAR_PRODUCTS_CONTENT,
    //     method: 'GET',
    //   }),
    // );
  };
  const getProductbySize = () => {
    const axios = require('axios');

    const config = {
      method: 'get',
      url: POPULAR_PRODUCT_BYSIZE,
      headers: {
        'Cache-Control': 'no-cache',
        'Paging-Info': 'start-index=0|no-of-records=50',
        Cookie:
          'connect.sid=s%3A74V0fBAy61KFIHwUv03CWv2KyiLePre7.6cuMLIamN22%2FMbpLTpLwuuqErqLgCjcMLnYjmK3J9%2BA',
      },
    };

    axios(config)
      // tslint:disable-next-line: ter-prefer-arrow-callback
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const getPrdocutbysizeContent = {
          productbySizeResult: response.data?.productbySizeResult,
        };
        if (getPrdocutbysizeContent) {
          console.log('getPrdocutbysizeContent+++++++++++', getPrdocutbysizeContent);
          const data = normalizePopularProductsData(getPrdocutbysizeContent);
          // console.log('popularProductsContent (normalized)', data);
          setState((prevState) => ({
            ...prevState,
            productSearchResult: data ?? {},
          }));
        }
      })
      // tslint:disable-next-line: ter-prefer-arrow-callback
      .catch(function (error) {
        console.log(error);
      });
  };
  const handlePriceFilter = (value) => {
    let filteredValue = '';
    if (value === 'relevance') {
      filteredValue = 'attributes.ff_popular.values.EN = 1';
    } else if (value === 'price low - high') {
      filteredValue = 'minPrice=1';
    } else if (value === 'price high - low') {
      filteredValue = 'minPrice=-1';
    }
    console.log(value, 'sort by filter');
    getPopularProductsSection(filteredValue);
  };
  const handleonChange = (product) => {
    console.log(product, 'product');
    console.log(state?.productSearchResult, 'state?.productSearchResult');
    if (comparableProducts.length <= 2 || product.isChecked) {
      const updatedProducts = state?.productSearchResult?.products.map((item) => {
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

      setState({ ...state, productSearchResult: { products: updatedProducts } });
    } else {
      notification(NOTIFICATION_TYPE.warning, 'Maximum 3 products can be compared');
    }
  };

  const handleRemoveItem = (product) => {
    const result = comparableProducts.filter((item) => {
      return item.id !== product.id;
    });
    const updatedProducts = state?.productSearchResult?.products.map((item) => {
      let result = item;
      if (item.id === product.id) {
        result = { ...item, isChecked: !item.isChecked };
      }
      return result;
    });

    setState({ ...state, productSearchResult: { products: updatedProducts } });
    setComparableProducts(result);
  };

  return (
    <>
      <ToastContainer />
      <Head>
        <title>{category.split('_').join(' ').replace('and', '&')} - Al-Futtaim</title>
      </Head>
      <SectionHero title={category.split('_').join(' ')}>
        {category.toLowerCase() === 'tyres' ? (
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
                      router.push({
                        pathname: ROUTES.productSearch,
                        query: `category=${category}&width=${reqBody?.width}&load=${reqBody?.load}&profile=${reqBody?.profile}&rimSize=${reqBody?.rimSize}&specialist=${reqBody?.specialist}&speed=${reqBody?.speed}`,
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
                        query: `category=${category}&make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
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
                query: `category=${category}&make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
              });
            }}
          />
        )}
      </SectionHero>

      <Section
        className="productSearch"
        titleProps={{
          text: state?.productSearchResult?.heading,
        }}
      >
        <SectionFiltersBlue filters={state.filters} onSelect={handlePriceFilter} />

        <Grid
          id="grid_scroll"
          type="product"
          isComparable={true}
          data={state?.productSearchResult?.products ?? []}
          page={'plpSearch'}
          onChange={(product: any) => handleonChange(product)}
        />

        {comparableProducts?.length > 0 && (
          <ProductComparison
            items={comparableProducts}
            placeholderCount={placeholderCount}
            onClick={(item) => handleRemoveItem(item)}
          />
        )}
      </Section>
      {categoryContentType?.CLP_Logos?.totalItems > 0 && (
        <Section>
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
    </>
  );
};

export default productSearch;
export async function getServerSideProps(context) {
  const { category = '', make = '', model = '', year = '', variant = '' } = context.query;

  return {
    props: {
      category,
      make,
      model,
      year,
      variant,
    },
  };
}
