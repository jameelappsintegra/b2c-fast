import React from 'react';
import { Container, Table } from 'react-bootstrap';
import Section from 'components/common/section';
import StaticTileListing from 'components/common/staticTileListing';
import { camelToTitleCase } from 'libs/utils/global';
import { IProductAttributeProps } from 'components/common/productGridItem';
import { NOT_AVAILABLE } from 'libs/utils/constants';

const SectionProductDescription = (props: any) => {
  const { product } = props;

  const getProductKeyFeatures = (product) => {
    const { attributes } = product;

    const featureKeys =
      Object.keys(attributes ?? {})?.filter((key) => key.startsWith('ff_keyfeatures')) ?? [];
    const productKeyFeatures: any = featureKeys?.map((key) => ({ name: attributes?.[key]?.value })) ?? [];
    return productKeyFeatures;
  };

  const getProductTableAttributes = (product: any) => {
    const { attributes } = product;

    const productTableAttributeKeys =
      Object.keys(attributes ?? {})?.filter(
        (key) => attributes?.[key]?.isPDPTable === 'YES' || attributes?.[key]?.isPDPTable === true,
      ) ?? [];

    const productTableAttributeData =
      productTableAttributeKeys?.map((key) => ({
        label: attributes?.[key]?.label,
        value: attributes?.[key]?.value,
      })) ?? [];

    return productTableAttributeData;
  };

  const productKeyFeatures: any = getProductKeyFeatures(product);
  const productTableAttributes: any = getProductTableAttributes(product);

  const colLimit = 4; // no of columns to show
  let tableLength = Math.ceil(productTableAttributes.length) / colLimit || 0;
  let modifiedProductAttrForHeaders: IProductAttributeProps[] = [];
  let modifiedProductAttrForBody: IProductAttributeProps[] = [];

  /**
   * Return table th's
   */
  const getTableTh = () => {
    const tempProductAttr = modifiedProductAttrForHeaders.length
      ? modifiedProductAttrForHeaders
      : [...productTableAttributes];

    const cols: any = [];
    let count = 1;
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < tempProductAttr.length; i++) {
      const item = tempProductAttr[i];
      if (i < colLimit && item) {
        cols.push(<th key={i}>{camelToTitleCase(item?.label)}</th>);
        modifiedProductAttrForHeaders = [...tempProductAttr];
      } else break;
      // tslint:disable-next-line: no-increment-decrement
      count++;
    }
    modifiedProductAttrForHeaders = modifiedProductAttrForHeaders.slice(count - 1);

    return cols;
  };

  /**
   * Return table td's
   */
  const getTableTd = () => {
    const tempProductAttr = modifiedProductAttrForBody.length
      ? modifiedProductAttrForBody
      : [...productTableAttributes];
    const cols: any = [];
    let count = 1;
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < tempProductAttr.length; i++) {
      const item = tempProductAttr[i];
      if (i < colLimit && item) {
        cols.push(<td key={i}>{item?.value ? item?.value : NOT_AVAILABLE}</td>);
        modifiedProductAttrForBody = [...tempProductAttr];
      } else break;
      // tslint:disable-next-line: no-increment-decrement
      count++;
    }
    modifiedProductAttrForBody = modifiedProductAttrForBody.slice(count - 1);
    return cols;
  };

  /**
   * Returns product attributes structure for mobile responsive
   */
  const getResponsiveProductAttributes = () => {
    return (
      productTableAttributes.length > 0 &&
      productTableAttributes.map((item, index) => {
        return (
          <li key={index}>
            <span>{item?.label ? camelToTitleCase(item?.label) : ''}</span>
            <span>{item?.value ? item?.value : NOT_AVAILABLE}</span>
          </li>
        );
      })
    );
  };

  const getAttributeTables = () => {
    const tables: any = [];
    while (tableLength > 0) {
      tables.push(
        <div className="scrollableTable" key={tableLength}>
          <Table className="customTable--shrinked" striped>
            <thead>
              <tr>{getTableTh()}</tr>
            </thead>
            <tbody>
              <tr>{getTableTd()}</tr>
            </tbody>
          </Table>
        </div>,
      );
      // tslint:disable-next-line: no-increment-decrement
      tableLength--;
    }
    return tables;
  };

  return (
    <>
      <Section
        className="sectionProductDescription"
        titleProps={{
          text: 'Product description',
        }}
      >
        <Container>
          <p
            className="richTextDescription"
            dangerouslySetInnerHTML={{ __html: product?.description?.EN ?? '' }}
          />
          {productKeyFeatures?.length > 0 && <StaticTileListing data={productKeyFeatures} />}
          <div className="d-none d-md-block">{getAttributeTables()}</div>
          <div className="d-block d-md-none">
            <ul className="responsiveProductAttrList">{getResponsiveProductAttributes()}</ul>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default SectionProductDescription;
