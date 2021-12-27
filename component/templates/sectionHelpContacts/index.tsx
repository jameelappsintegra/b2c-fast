import { Container } from 'react-bootstrap';
import Section from 'components/common/section';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

const SectionHelpContacts = (props) => {
  const { step2 } = props;
  const chekoutJourneyContent = useSelector((state: any) => state?.storeReducer?.chekoutJourneyContent);
  return (
    <Section
      className="sectionHelpContacts"
      styles={{ backgroundColor: 'var(--color-black)' }}
      titleProps={{
        text: `${chekoutJourneyContent?.Step2?.Miscellaneous_Text?.need_help}`,
        textColor: 'var(--color-white)',
      }}
    >
      <Container>
        <div className="helpContacts">
          <div className="helpContacts__item">
            <Link href="tel:80069227">Call us 800AutoService</Link>
            <p>{chekoutJourneyContent?.Step2?.Miscellaneous_Text?.call_us_value}</p>
          </div>
          <div className="helpContacts__mail">
            <p>{chekoutJourneyContent?.Step2?.Miscellaneous_Text?.email_title}</p>
            <Link href="mailto:help@autoservice.ae">help@autoservice.ae</Link>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default SectionHelpContacts;
