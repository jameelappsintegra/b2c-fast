import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import PLPSearchService from 'services/components/plpSearch';
import { Container, Table } from 'react-bootstrap';
import Section from 'components/common/section';
import SectionHero from 'components/common/sectionHero';
import SectionFiltersBlue, { ISectionFiltersBlueItemProps } from 'components/templates/sectionFiltersBlue';
import Grid from 'components/common/grid';
import RadioCustom from 'components/common/form/radioCustom';
import Features from 'components/templates/features';
import VideoLightBoxLink from 'components/templates/videoLightBox';
import AppButton from 'components/common/appButton';
import FormCustom from 'components/common/form';
import ProductComparison from '/components/templates/productComparison';
import {
  notification,
  NOTIFICATION_TYPE,
  popularProductsFieldsLookup,
  fieldsLookupByPimFamilyCodeClpPage,
  normalizePopularProductsData,
} from '/utilities/utils';
import { PLACEHOLDER_COUNT } from 'libs/utils/constants';
import router from 'next/router';
import TabsCustom from '/components/common/tabs';
import CarForm from '/components/pages/productListing/partialForms/car';
import SizeForm from '/components/pages/productListing/partialForms/size';
import BrandLogos from '/components/templates/brandLogos';
import { ROUTES } from '/utilities/constants';
import { commonFetch } from '/store/actions/thunk';
import { POPULAR_PRODUCT_BYCAR, POPULAR_PRODUCT_BYSIZE, BASE_URL, END_POINT_BFF_KEY } from '/config/config';
import { CATEGORY_CONTENT_TYPE, POPULAR_PRODUCTS_CONTENT } from '/store/actions/types';
import { useDispatch, useSelector } from 'react-redux';

import { toTitleHeadCase, scrollToTop } from 'libs/utils/global';
interface IProductSearchResultsState {
  filters?: ISectionFiltersBlueItemProps[];
  productsData: any[];
  count: number | null;
  comparableProducts: any[];
  products: any;
  productSections: any;
}

const productSearch: React.SFC<any> = (props) => {
  const {
    type,
    category,
    categorySubType,
    compareDisabled,
    make,
    model,
    year,
    variant,
    car,
    width,
    profile,
    rimSize,
  } = props;
  const categoryContentType = useSelector((state: any) => state?.storeReducer?.categoryContentType);
  const [pimSubCategoryCode, setPimSubCategoryCode] = useState<any>();
  const pimCategoryCode = categoryContentType?.PIM_Code;
  const pimFamilyCode = categoryContentType?.PIM_Family_Code?.replace('ff_', 'b2c_');
  const placeholderCount = PLACEHOLDER_COUNT;
  const [typeVal, setTypeVal] = useState(type);
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

  useEffect(() => {
    dispatch(
      commonFetch({
        URL: `/bff/dx/clp&spath=/aftersales_en/home/${category}&categoriesPath=/aftersales_en/home/${category}/categories&keypath=/aftersales_en/home/${category}/key_feature_tiles`,
        type: CATEGORY_CONTENT_TYPE,
        method: 'GET',
      }),
    );
  }, [category, variant, make, model, year]);
  useEffect(() => {
    const pimSubCategoryCodeFilter = categoryContentType?.CLP_Services?.servicesList?.find((item) => {
      return item?.name === categorySubType;
    });
    const pimSubCC = pimSubCategoryCodeFilter?.['PIM_Code'] || pimCategoryCode;
    const typeData = pimSubCategoryCodeFilter?.['PIM_Code'] ? 'PARENT' : 'TOPCATEGORIES';
    setTypeVal(typeData);
    setPimSubCategoryCode(pimSubCC);
  }, [categoryContentType]);

  useEffect(() => {
    // const reqBody: any = JSON.parse(localStorage.getItem('productSearchReqBody') ?? '{}');
    // getProducts(reqBody);
    if (pimSubCategoryCode && make && model && year && variant) {
      getPopularProductsSection(pimSubCategoryCode);
    }
  }, [pimSubCategoryCode, make, model, year, variant]);

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
    const obj = {};
    console.log(pimSubCategoryCode, pimCategoryCode);
    obj[pimFamilyCode] = [pimSubCategoryCode];
    const categoryParam = { ...obj };
    const axios = require('axios');
    const data = JSON.stringify({
      type: typeVal,
      vehicleQuery: {
        make,
        model,
        year,
        variant,
      },
      categories: categoryParam,
      query: {
        fields: fieldsLookupByPimFamilyCodeClpPage[pimFamilyCode],
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
        // const popularProductsContent = {
        //   products: response.data[pimFamilyCode]?.product,
        // };
        // if (popularProductsContent) {
        const data = normalizePopularProductsData(response.data);
        setState((prevState) => ({
          ...prevState,
          productSearchResult: data ?? {},
        }));

        // }
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
  // useEffect(() => {
  //   if (width === '') {
  //     getPopularProductsSection();
  //   }
  // }, [variant, make, model, year]);
  const getTyreSizecontent = (
    width = 0,
    profile = 0,
    rimSize = 0,
    filteredValue = 'attributes.ff_popular.values.EN=1',
    loadRating = '',
    speedRating = '',
    specialist = '',
  ) => {
    const axios = require('axios');
    const categoryType = {
      Tyres: 'tyre',
    };
    const config = {
      method: 'get',
      url: `${BASE_URL}/${END_POINT_BFF_KEY}/findTyre/searchByTyreSize?width=${width}&profile=${profile}&rimSize=${rimSize}&loadRating=${loadRating}&speedRating=${speedRating}&specialist=${specialist}&fields=${popularProductsFieldsLookup['Tyres']}&sort=${filteredValue}&category=ff_our_tyres&categoryType=PARENT`,
      headers: {
        'Cache-Control': 'no-cache',
        'Paging-Info': 'start-index=0|no-of-records=50',
      },
    };

    axios(config)
      // tslint:disable-next-line: ter-prefer-arrow-callback
      .then(function (response) {
        const getTyreSizeResult = {
          tyreSizeResult: response.data.tyre,
        };
        setState({ ...state, tyreSizeProduct: getTyreSizeResult.tyreSizeResult });
      })
      // tslint:disable-next-line: ter-prefer-arrow-callback
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    if (width && profile && rimSize) {
      getTyreSizecontent(width, profile, rimSize);
    }
  }, [width, profile, rimSize]);
  useEffect(() => {
    if (state.tyreSizeProduct) {
      getProductbySize(state.tyreSizeProduct);
    }
  }, [state.tyreSizeProduct]);
  const getProductbySize = (tyreSizeProduct) => {
    const getTyrebySizeResult = {
      products: tyreSizeProduct,
    };
    if (getTyrebySizeResult) {
      const data = normalizePopularProductsData(getTyrebySizeResult);
      setState((prevState) => ({
        ...prevState,
        productSearchResult: data ?? {},
      }));
    }
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
    // console.log(categoryContentType.clc_title);
    if (category.toLowerCase() === 'tyres' && width && profile && rimSize) {
      getTyreSizecontent(width, profile, rimSize, filteredValue);
    } else {
      getPopularProductsSection(filteredValue);
    }
  };
  const handleonChange = (product) => {
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
      notification(NOTIFICATION_TYPE.error, 'Maximum 3 products can be compared');
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
  useEffect(() => {
    if (category.toLowerCase() === 'tyres') {
      window.scrollTo(0, 800);
    } else {
      window.scrollTo(0, 600);
    }
  });
  const onClickSearch = (reqBody: any) => {
    router.push(
      {
        pathname: ROUTES.productSearch,
        query: `category=${category}&make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
      },
      null,
      { shallow: false },
    );
  };
  return (
    <>
      <Head>
        <title>
          {category.split('_').join(' ').replace('and', '&') || categoryContentType.clc_title} - Al-Futtaim
        </title>
      </Head>
      <SectionHero
        title={toTitleHeadCase(
          categoryContentType.clc_title && categoryContentType.clc_title.toLowerCase() === 'home'
            ? 'Tyres'
            : categoryContentType.clc_title ?? '',
        )}
      >
        {category.toLowerCase() === 'tyres' || categoryContentType.clc_title === 'Home' ? (
          <TabsCustom
            id="carSearchTabs"
            defaultActiveKey={width ? 'size' : 'car'}
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
                        query: `category=${category}&width=${reqBody?.width}&load=${reqBody?.load}&profile=${reqBody?.profile}&rimSize=${reqBody?.rimSize}&specialist=${reqBody?.specialist}&speed=${reqBody?.speed}`,
                      });
                    }}
                  />
                ),
              },
              {
                title: 'Find by car',
                key: 'car',
                children: <CarForm onSearch={(reqBody) => onClickSearch(reqBody)} />,
              },
            ]}
            width="auto"
          />
        ) : (
          <CarForm
            type="PRODUCT"
            onSearch={(reqBody: any) => {
              router.push(
                {
                  pathname: ROUTES.productSearch,
                  query: `category=${category}&make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
                },
                null,
                { shallow: false },
              );
            }}
          />
        )}
      </SectionHero>

      <Section
        className="productSearch"
        titleProps={{
          text: state?.productSearchResult?.searchHeading,
        }}
      >
        <SectionFiltersBlue filters={state.filters} onSelect={handlePriceFilter} />

        <Grid
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
  const {
    type = '',
    category = '',
    categorySubType = '',
    make = '',
    model = '',
    year = '',
    variant = '',
    width = '',
    profile = '',
    rimSize = '',
  } = context.query;
  const configOptions = {
    headers: {
      'Accept-Language': context?.locale,
      'Server-Call': 'Y',
    },
  };

  return {
    props: {
      type,
      category,
      categorySubType,
      make,
      model,
      year,
      variant,
      width,
      profile,
      rimSize,
    },
  };
}
