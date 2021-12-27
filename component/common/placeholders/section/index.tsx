import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import RectShape from 'react-placeholder/lib/placeholders/RectShape';

const SectionPlaceholder = (props: { children: JSX.Element }) => (
  <Container>
    <Row>
      <Col md={4}></Col>
      <Col md={4}>
        <RectShape style={{ height: '4rem', margin: '5rem 0 3rem' }} />
      </Col>
      <Col md={4}></Col>
    </Row>
    <Row>{props.children}</Row>
  </Container>
);

export default SectionPlaceholder;
