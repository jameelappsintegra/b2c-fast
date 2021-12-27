import React from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap';
import classNames from 'classnames';
import ProductGridItem from '/components/common/productGridItem';
import CategoryGridItem from '/components/common/categoryGridItem';

const Grid = (props) => {
  const { gridType, data, page, urlPrefix, isComparable } = props;
  return (
    <Container className="gridList">
      <Row className="gx-md-3 gy-md-4 g-4">
        {data.length ? (
          data.map((item: any, index: number) => (
            <Col className="col" sm={12} xs={12} md={4} lg={4} key={index}>
              <Card
                className={`gridList__item ${classNames({
                  placeholder: false,
                })} ${
                  page === 'plpLanding' || page === 'plpSearch'
                    ? '' // 'clickable-grid-item'
                    : ''
                }`}
              >
                {props.gridType === 'category' ? (
                  <CategoryGridItem
                    type={gridType}
                    urlPrefix={urlPrefix}
                    id={index.toString()}
                    item={item}
                    page={page}
                  />
                ) : (
                  <ProductGridItem
                    isComparable={isComparable}
                    id={index.toString()}
                    itemLength={data?.length}
                    item={item}
                    onChange={props.onChange}
                    page={page}
                    onCategoryGridItemClicked={(redirectURL: string = '') =>
                      page === 'plpLanding' || page === 'plpSearch'
                        ? (window.location.href = redirectURL)
                        : null
                    }
                  />
                )}
              </Card>
            </Col>
          ))
        ) : (
          <>
            <h3 className="text-center"></h3>
          </>
        )}
        {/* {data.map((item: any, index: number) => (
          <Col className="col" sm={12} xs={12} md={4} lg={4} key={index}>
            <Card
              className={`gridList__item ${classNames({
                placeholder: false,
              })}`}
            >
              {gridType === "category" ? (
                <CategoryGridItem
                  type={gridType}
                  urlPrefix={urlPrefix}
                  id={index.toString()}
                  item={item}
                  // page={page}
                />
              ) : (
                <ProductGridItem
                  id={index.toString()}
                  item={item}
                  // onChange={props.onChange}
                  // page={props.page}
                />
              )}
            </Card>
          </Col>
        ))} */}
        {/* {this.state.placeHolderItems && this.state.placeHolderItems.length > 0
          ? this.state.placeHolderItems.map((item: any, index: number) => (
              <Col sm={12} md={6} lg={4} key={index}>
                {item}
              </Col>
            ))
          : ""} */}
      </Row>
    </Container>
  );
};

export default Grid;
