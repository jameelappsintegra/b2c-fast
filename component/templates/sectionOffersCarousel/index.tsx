import React from 'react';
import { Container } from 'react-bootstrap';
import { ITitleProps } from '../../../components/common/section/title';
import Section from '../../../components/common/section';
import OffersCarousel from './offersCarousel';

export interface ISectionOffersCarouselProps {
  titleProps: ITitleProps;
  styles?: React.CSSProperties;
  isDark?: boolean;

  /**
   * Temporarily setting attribute as optional is we have to map strapi data at many places.
   * Once strapi data mapped everywhere then this prop can be set as mandatory
   */
  data?: any[];
  subTextColor?: any;
}

const SectionOffersCarousel = (props: ISectionOffersCarouselProps) => {
  const { data = [], titleProps = {} as ITitleProps, styles = {}, isDark = true, subTextColor = '' } = props;
  // console.log(data); //ahsan
  return (
    <Section styles={styles} titleProps={titleProps}>
      <Container>
        <OffersCarousel isDark={isDark} data={data} subTextColor={subTextColor} />
      </Container>
    </Section>
  );
};
export default SectionOffersCarousel;
