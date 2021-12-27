import React from 'react';

export interface IPreTitleProps {
  styles?: React.CSSProperties;
  children: React.ReactNode;
}

const PreTitle = (props: IPreTitleProps) => {
  const { children, styles } = props;

  return (
    <p className="sectionHero__preTitle" style={styles}>
      {children}
    </p>
  );
};

export default PreTitle;
