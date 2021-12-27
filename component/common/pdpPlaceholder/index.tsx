import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import RectShape from 'react-placeholder/lib/placeholders/RectShape';
import SectionPlaceholder from 'components/common/placeholders/section';
import DefaultPlaceholder from 'components/common/placeholders/default';

const PdpPlaceholder = () => (
  <React.Fragment>
    <Container>
      <Row className="placeholderContainer__boxesRow">
        <Col md={4}>
          <RectShape color="var(--color-light-grey)" style={{ width: '100%', height: '8rem' }} />
          <RectShape color="var(--color-light-grey)" style={{ width: '100%', height: '16rem' }} />
        </Col>
        <Col md={8}>
          <RectShape color="var(--color-light-grey)" style={{ width: '100%', height: '25rem' }} />
        </Col>
      </Row>
      <SectionPlaceholder>
        <DefaultPlaceholder />
      </SectionPlaceholder>
    </Container>
  </React.Fragment>
);

export default PdpPlaceholder;
