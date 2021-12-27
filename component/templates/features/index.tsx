import React from 'react';
import { Col, Row } from 'react-bootstrap';
import FeatureWidget from 'components/common/featureWidget';

const Features = (props: any) => {
  const column = (props.data.length = '3' ? 4 : 3);
  return (
    <Row>
      {props?.data &&
        props?.data.map((item: any, index: any) => (
          <Col sm={12} md={column} key={index}>
            <FeatureWidget icon={item.icon} title={item.title} description={item.description} />
          </Col>
        ))}
    </Row>
  );
};

export default Features;
