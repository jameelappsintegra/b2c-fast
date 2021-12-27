import React from 'react';

export interface IPostTitleProps {
  children?: React.ReactNode;
}

const PostTitle = (props: IPostTitleProps) => {
  const { children } = props;

  return <p className="sectionHero__postTitle">{children}</p>;
};

export default PostTitle;
