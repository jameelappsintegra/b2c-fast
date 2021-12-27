import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DefaultPlaceholder from 'components/common/placeholders/default';
import SectionPlaceholder from 'components/common/placeholders/section';

const SlotsPlaceholder = () => (
  <React.Fragment>
    <Container>
      <SectionPlaceholder>
        <DefaultPlaceholder />
      </SectionPlaceholder>
    </Container>
  </React.Fragment>
);

export default SlotsPlaceholder;
