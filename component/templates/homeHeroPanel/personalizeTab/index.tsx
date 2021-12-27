import * as React from 'react';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { ROUTES } from 'utilities/constants';
import CarForm from 'components/pages/productListing/partialForms/car';
import AppButton from 'components/common/appButton';
import SizeForm from '/components/pages/productListing/partialForms/size';
import SectionHero from '/components/common/sectionHero';
import TabsCustom from 'components/common/tabs';

const PersonalizeTab = (props: any) => {
  const router = useRouter();

  const { headline = '', secondaryHeadline = '', description = '', formTitle = '', link = null } = props;
  return (
    <Container>
      <h1 className="personalizeTab__mainTitle">{headline}</h1>
      {!!secondaryHeadline && <p className="personalizeTab__description">{secondaryHeadline}</p>}
      {!!description && <p className="personalizeTab__searchDescp">{description}</p>}
      {link && (
        <AppButton
          text={link?.label}
          variant="filled"
          url={link?.label === 'Offers' && link?.url === null ? 'offers' : ''}
          shape="rounded"
        />
      )}
      {/* {!!formTitle && <p className="personalizeTab__searchDescp">{formTitle}</p>} */}
      {!!formTitle && props.tabIndex === 0 && (
        <CarForm
          page="home"
          onSearch={(reqBody: any) => {
            router.push({
              pathname: ROUTES.siteSearch,
              query: `make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
            });
          }}
        />
      )}
      {!!formTitle && props.tabIndex === 1 && (
        <SectionHero className="personalizeTab__heroSection">
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
                        query: `width=${reqBody?.width}&load=${reqBody?.load}&profile=${reqBody?.profile}&rimSize=${reqBody?.rimSize}&specialist=${reqBody?.specialist}&speed=${reqBody?.speed}`,
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
                    page="home"
                    onSearch={(reqBody: any) => {
                      router.push({
                        pathname: ROUTES.productSearch,
                        query: `make=${reqBody?.filtersData?.makeCode}&model=${reqBody?.filtersData?.modelCode}&year=${reqBody?.filtersData?.modelYear}&variant=${reqBody?.filtersData?.code}`,
                      });
                    }}
                  />
                ),
              },
            ]}
            width="auto"
          />
        </SectionHero>
      )}
    </Container>
  );
};

export default PersonalizeTab;
