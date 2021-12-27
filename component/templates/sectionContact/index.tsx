import { Container } from 'react-bootstrap';
import Section from 'components/common/section';
import ContactDetails from './contactDetails';
const SectionContact = (props: any) => {
  const { opening_hours_label = '' } = props;

  return (
    <Section
      className="sectionContact"
      titleProps={{
        text: opening_hours_label,
      }}
      styles={{ backgroundColor: 'var(--color-lightest-grey)' }}
    >
      <Container>
        <ContactDetails {...props} />
      </Container>
    </Section>
  );
};

export default SectionContact;
