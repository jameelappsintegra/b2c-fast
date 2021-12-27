import axios from 'axios';
import { HEADER_FOOTER_ENDPOINT } from '/config/config';

const SEARCH_ENDPOINTS = {
  getMakeData:
    '/bff/list-of-values?sort=attributes.make=1&unique=YES&fields=attributes.make&q=type=B2C|keyGroup=VARIANT',
  getModelDataByMakeCode: (makeCode: string): string => {
    return `/bff/list-of-values?sort=attributes.model=1&unique=YES&fields=attributes.model&q=type=B2C|keyGroup=VARIANT|attributes.make=${makeCode}`;
  },
  getYearsDataByMakeModelCode: (makeCode: string, modelCode: string): string => {
    return `/bff/list-of-values?sort=attributes.modelYear=1&unique=YES&fields=attributes.modelYear&q=type=B2C|keyGroup=VARIANT|attributes.make=${makeCode}|attributes.model=${modelCode}`;
  },
  getVariantsDataByMakeModelYearCode: (makeCode: string, modelCode: string, modelYear: string): string => {
    return `/bff/list-of-values?sort=attributes.value=1&unique=YES&fields=attributes.value&q=type=B2C|keyGroup=VARIANT|attributes.make=${makeCode}|attributes.model=${modelCode}|attributes.modelYear=${modelYear}`;
  },
  getSearchResults: (
    categoriesArray: any,
    makeCode: string,
    modelCode: string,
    modelYear: string,
    modelVariant: string,
    formattedCategoryData: any,
  ): any => {
    return {
      query: '/bff/product/searchv2',
      body: {
        type: 'SITE',
        vehicleQuery: {
          make: makeCode,
          model: modelCode,
          year: modelYear,
          variant: modelVariant,
        },
        categories: formattedCategoryData,
      },
    };
  },

  getSearchResultsBySize: (queryParams: any): string => {
    const otherParams = `&type=${queryParams?.type}&categoryUrl=${queryParams?.categoryUrl}&load=${queryParams?.load}&speed=${queryParams?.speed}&specialist=${queryParams?.specialist}`;
    if (queryParams?.width !== '' && queryParams?.profile !== '' && queryParams?.rimSize !== '') {
      const rimSize = queryParams?.rimSize === '*' ? '' : `&rimSize=${queryParams?.rimSize}`;
      return `/search/tyre?width=${queryParams?.width}&profile=${queryParams?.profile}${rimSize}${otherParams}`;
    }
    if (queryParams?.width !== '' && queryParams?.profile !== '') {
      return `/search/tyre?width=${queryParams?.width}&profile=${queryParams?.profile}${otherParams}`;
    }
    return `/search/tyre?width=${queryParams?.width}${otherParams}`;
  },
};

const getMakeData = async () => {
  try {
    let resp: any = await fetch(SEARCH_ENDPOINTS.getMakeData);
    resp = await resp.json();
    resp = (resp ?? []).map((item) => ({ ...item, value: item.make }));
    return resp;
  } catch (error) {
    throw error;
  }
};

const getModelDataByMakeCode = async (makeCode: string) => {
  try {
    let resp: any = await fetch(SEARCH_ENDPOINTS.getModelDataByMakeCode(makeCode));
    resp = await resp.json();
    return resp;
  } catch (error) {
    throw error;
  }
};

const getYearsDataByMakeModelCode = async (makeCode: string, modelCode: string) => {
  try {
    let resp: any = await fetch(SEARCH_ENDPOINTS.getYearsDataByMakeModelCode(makeCode, modelCode));
    resp = await resp.json();
    return resp;
  } catch (error) {
    throw error;
  }
};

const getVariantsDataByMakeModelYearCode = async (makeCode: string, modelCode: string, modelYear: string) => {
  try {
    let resp: any = await fetch(
      SEARCH_ENDPOINTS.getVariantsDataByMakeModelYearCode(makeCode, modelCode, modelYear),
    );
    resp = await resp.json();
    return resp;
  } catch (error) {
    throw error;
  }
};

const getSearchResults = async (
  makeCode: string,
  modelCode: string,
  modelYear: string,
  modelVariant: string,
) => {
  try {
    const resp1: any = await axios(HEADER_FOOTER_ENDPOINT);
    const siteMapResult = (resp1?.data?.sitemap ?? [])?.filter((itemData: any) => {
      return itemData?.visibility?.catalogue === 'show';
    });
    const formatSiteMapResult = siteMapResult.map((item) => {
      return item?.PIM_Family_Code;
    });
    const keyArray = formatSiteMapResult.filter((item, i, ar) => ar.indexOf(item) === i);
    // tslint:disable-next-line: ter-prefer-arrow-callback
    const filteredKeyArray = keyArray.filter(function (el) {
      return el !== '';
    });

    const formattedCategoryData = filteredKeyArray.map((item) => {
      const codeArr = [];
      let itemName = '';
      const finalObj = {};
      siteMapResult.filter((val) => {
        const pimCode = val?.PIM_Code;
        if (!!pimCode && val?.PIM_Family_Code === item) {
          codeArr.push(pimCode);
        }
      });
      itemName = item.replace('ff_', 'b2c_');
      finalObj[itemName] = codeArr;
      return { ...finalObj };
    });

    const dataToSend: any = SEARCH_ENDPOINTS.getSearchResults(
      (siteMapResult ?? []).map((obj) => obj?.title ?? ''),
      makeCode,
      modelCode,
      modelYear,
      modelVariant,
      Object.assign({}, ...formattedCategoryData),
    );

    const resp2: any = await axios(dataToSend?.query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(dataToSend?.body ?? {}),
    });

    const siteSearchResults: any = resp2?.data
      ? Object.fromEntries?.(
          Object.entries(resp2?.data ?? {})?.map((item) => {
            item[0] = item[0].toLowerCase().replace(/\s/gi, '');
            return item;
          }),
        ) ?? {}
      : {};
    const siteSearchResultsFilterByCount = Object.entries(siteSearchResults)
      .map((item) => {
        return item;
      })
      .filter((obj) => obj[1]?.['count'] > 0);

    const dataToReturn: any = siteMapResult.map((item: any) => ({
      ...item,
      count: parseInt(
        // tslint:disable-next-line: ter-computed-property-spacing
        Object.fromEntries(siteSearchResultsFilterByCount)?.[
          // tslint:disable-next-line: ter-computed-property-spacing
          `${item?.PIM_Family_Code?.toLowerCase().replace('ff', 'b2c')}_${item?.PIM_Code?.toLowerCase()}`
          // tslint:disable-next-line: ter-computed-property-spacing
        ]?.['count'] ?? 0,
        0,
      ),
      currency: 'AED',
      startingPrice:
        // tslint:disable-next-line: ter-computed-property-spacing
        Object.fromEntries(siteSearchResultsFilterByCount)?.[
          // tslint:disable-next-line: ter-computed-property-spacing
          `${item?.PIM_Family_Code?.toLowerCase().replace('ff', 'b2c')}_${item?.PIM_Code?.toLowerCase()}`
          // tslint:disable-next-line: ter-computed-property-spacing
        ]?.['price'] ?? '',
    }));

    return dataToReturn ?? [];
  } catch (error) {
    throw error;
  }
};

const getSearchResultsBySize = async (queryParams: object) => {
  try {
    const resp: any = await fetch(SEARCH_ENDPOINTS.getSearchResultsBySize(queryParams));
    return resp?.data;
  } catch (error) {
    throw error;
  }
};

export {
  getMakeData,
  getModelDataByMakeCode,
  getYearsDataByMakeModelCode,
  getVariantsDataByMakeModelYearCode,
  getSearchResults,
  getSearchResultsBySize,
};
