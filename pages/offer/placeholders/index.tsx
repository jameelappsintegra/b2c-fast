import { Container } from 'react-bootstrap';
import SectionPlaceholder from 'components/common/placeholders/section';
import DefaultPlaceholder from 'components/common/placeholders/default';

const BlogPlaceholder = () => (
  <Container>
    <SectionPlaceholder>
      <DefaultPlaceholder />
    </SectionPlaceholder>
    <SectionPlaceholder>
      <DefaultPlaceholder />
    </SectionPlaceholder>
  </Container>
);

export default BlogPlaceholder;
