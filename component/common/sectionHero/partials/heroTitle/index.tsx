const HeroTitle = (props: any) => {
  const { title = '' } = props;
  return <h2 className="sectionHero__title">{typeof title === 'string' ? title : title}</h2>;
};

export default HeroTitle;
