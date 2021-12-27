import React from 'react';
import { useRouter } from 'next/router';
import AppButton from 'components/common/appButton';
import { defaultImageThumbSrc, pathTodefaultImageThumb } from 'libs/utils/global';
import { Card } from 'react-bootstrap';
import { ROUTES } from '/utilities/constants';
import { imgRefactorURI } from '/utilities/utils';

const CategoryGridItem = (props) => {
  const router = useRouter();
  const { item, urlPrefix = '' } = props;

  const thumbailName = item.catalogue_thumbnail || item.Thumbnail;
  const description = item.catalogue_desc || item.Service_Description;

  const handleOnClick = (category: any, _urlPrefix: string) => {
    if (props?.page) {
      if (props?.page === 'clp') {
        // TODO: revert back or change // ahsan
        if (!category?.redirectUrl) {
          // window.location.href = `..${window.location.pathname}/${category.name}?categoryUrl=${category.path}`;
          // window.location.href = `..${window.location.pathname}/${category.name}`;
          categoryDataLayer(item);
          router.push({
            pathname: `..${window.location.pathname}/${category.name}`,
          });
        }
        return;
      }
      if (props?.page === 'siteSearch') {
        const queryParams: any = new URLSearchParams(window.location.search);
        categoryDataLayer(item);
        router.push({
          pathname: ROUTES.productSearch,
          query: `compareDisabled=true&type=TOPCATEGORIES&category=${(category?.url ?? '').replace(
            /\//gi,
            '',
          )}&make=${queryParams.get('make')}&model=${queryParams.get('model')}&year=${queryParams.get(
            'year',
          )}&variant=${queryParams.get('variant')}`,
        });

        return;
      }
      if (category?.redirectUrl?.indexOf('?') === -1) {
        categoryDataLayer(item);
        router.push({
          pathname: `${category?.redirectUrl}?page=${props.page}&type=${category?.type || ''}`,
        });
      } else {
        categoryDataLayer(item);
        router.push({
          pathname: `${category?.redirectUrl}&page=${props.page}&type=${category?.type || ''}`,
        });
      }
    } else {
      // window.location.href = category.redirectUrl;
      router.push({
        pathname: `${category?.name}`,
      });
      categoryDataLayer(item);
    }
  };

  const categoryDataLayer = (item) => {
    console.log(`${JSON.stringify(item)}`);
    window?.['dataLayer'].push({
      event: 'homepageEvent',
      event_category: 'Homepage', // Static
      event_action: item?.name, // Captures the category of element,
      event_label: item?.title, // Capture the Element user clicked
    });
  };

  return (
    <>
      {item.catalogue_thumbnail || item.Thumbnail ? (
        <div className="categoryGridItem__thumbContainer">
          <Card.Img
            variant="top"
            src={imgRefactorURI(
              thumbailName?.renditionList?.find((item) => item.name === 'default')?.resourceUri,
            )}
            alt={item?.title}
            onError={defaultImageThumbSrc}
          />
        </div>
      ) : (
        <div className="categoryGridItem__thumbContainer">
          <Card.Img
            variant="top"
            src={pathTodefaultImageThumb}
            alt="defaultThumb"
            onError={defaultImageThumbSrc}
          />
        </div>
      )}
      <Card.Body className="categoryGridItem__contentBlock">
        <Card.Title>{item.title}</Card.Title>
        <span>
          {item.catalogue_price_label} <strong>{item.catalogue_starting_price}</strong>
        </span>
        <Card.Text>{description}</Card.Text>
        <div>
          <AppButton
            text={`All ${item.title}`}
            shape="rectangular"
            variant="filled"
            onClick={() => handleOnClick(item, urlPrefix)}
          />
        </div>
      </Card.Body>
    </>
  );
};

export default CategoryGridItem;
