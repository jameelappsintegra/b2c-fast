import React from 'react';
import { Container } from 'react-bootstrap';
import bannerBg from '/images/hero-bg.svg';
import PreTitle from './partials/preTitle';
import HeroTitle from './partials/heroTitle';
import { toTitleHeadCase } from 'libs/utils/global';
import PostTitle from './partials/postTitle';

// export interface ISectionHeroProps {
//   title: string | IBilingual[];
//   /**
//    * Description that appears right before banner title
//    */
//   preTitle?: IPreTitleProps;

//   /**
//    * Description that appears right after banner title
//    */
//   postTitle?: IPostTitleProps;
//   className?: string;
//   children?: React.ReactNode;
//   styles?: React.CSSProperties;
// }

const SectionHero = (props: any) => {
  const { title = '', className = '', noFormateTitle } = props;
  const formatTitle = toTitleHeadCase(title);
  const preTitle = props.preTitle && <PreTitle {...props.preTitle} />;
  const postTitle = props.postTitle && <PostTitle {...props.postTitle} />;
  return (
    <section
      className={`sectionHero text-center ${className}`}
      style={{ ...props.styles, backgroundImage: `url(${bannerBg.src})` }}
    >
      <Container>
        {preTitle}
        {noFormateTitle ? <HeroTitle title={title} /> : <HeroTitle title={formatTitle} />}
        {postTitle}
        {props.children}
      </Container>
    </section>
  );
};

export default SectionHero;
