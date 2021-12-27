import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import SectionHero from '/components/common/sectionHero';
import PlaceholderItems from '/components/templates/productComparison/partials/placeholderItems';
import Grid from '/components/common/grid';
import Section from '/components/common/section';
import AppButton from '/components/common/appButton';
import CustomSwitchToggle from '/components/common/form/customSwitchToggle';
import Head from 'next/head';
import { NOT_AVAILABLE } from 'libs/utils/constants';
import CustomerEnq from './customerEnq';

const ProductComparisonDetail = () => {
  const [isToggled = false, setIsToggled] = React.useState<boolean>(false);
  const [preTitle, setPreTitle] = React.useState<string>('');
  const [show, setShow] = React.useState<boolean>(false);
  const compareProductsContent = useSelector((state: any) => state?.storeReducer?.ISetCompareItemsProps);
  const toggleShow = () => setShow(!show);
  const samplePyload = compareProductsContent?.products.reduce(
    (pre, curr) => {
      for (const key in curr) {
        if (pre[key]) pre[key].push(curr[key]);
      }
      return pre;
    },
    Object.keys(compareProductsContent?.products[0]).reduce((pre, curr) => {
      if (
        curr === 'year' ||
        curr === 'rim' ||
        curr === 'noise' ||
        curr === 'efficiency' ||
        curr === 'width' ||
        curr === 'height' ||
        curr === 'speedRating'
      ) {
        pre[curr] = [];
      }
      return pre;
    }, {}),
  );

  const titleCase = (str) => {
    const splitStr = str.toLowerCase().split(' ');
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  };
  const getAttributeDivs = () => {
    return Object.entries(samplePyload).map(([key, value]) => {
      return (
        <div className="mockTable">
          <div className="mockTable__thead">
            <span className="mockTable__th">{titleCase(key)}</span>
          </div>
          <div className="mockTable__tr">
            <div className="mockTable__td">
              <span className="mockTable_td">{value[0] ? value[0] : NOT_AVAILABLE}</span>
              <span className="mockTable_td">{value[1] ? value[1] : NOT_AVAILABLE}</span>
              <span className="mockTable_td">{value[2] ? value[2] : NOT_AVAILABLE}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Head>
        <title>Comparison Result - Al-Futtaim</title>
      </Head>
      <div className="d-none d-md-block">
        {compareProductsContent?.products.length > 1 && (
          <SectionHero
            className="comparisonHeroSection"
            title="Compare"
            // preTitle={{
            //   children: preTitle,
            // }}
          >
            <Container>
              <Grid
                type="product"
                data={compareProductsContent?.products}
                placeHolderItems={PlaceholderItems}
              />
            </Container>
          </SectionHero>
        )}
        <Section className="tableDifferences">
          <Container>
            {compareProductsContent?.products.length > 0 && (
              <>
                {/* <div className="text-right">
                  <CustomSwitchToggle
                    id="highlightToggle"
                    label="Highlight differences"
                    toggle={isToggled}
                    onChange={(isToggled) => {
                      setIsToggled(isToggled);
                    }}
                  />
                </div> */}
                <Row>{getAttributeDivs()}</Row>
              </>
            )}
            <div className="reorderOuter">
              <p>Not sure? Ask us a question</p>
              <AppButton
                text="Customer services"
                variant="filled"
                shape="rounded"
                onClick={() => toggleShow()}
              />
            </div>
          </Container>
        </Section>
        <CustomerEnq show={show} toggleShow={toggleShow} />
      </div>
    </>
  );
};

export default ProductComparisonDetail;
