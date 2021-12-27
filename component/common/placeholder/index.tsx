import * as React from 'react';
import ReactPlaceholder from 'react-placeholder/lib/ReactPlaceholder';

export interface IPlaceholderProps {
  children: React.ReactNode;
  className?: string;
  placeholderBody: any;
  togglePlaceholder: boolean;
}

const Placeholder = (props: IPlaceholderProps) => {
  const { placeholderBody, children, togglePlaceholder } = props;
  return (
    <ReactPlaceholder showLoadingAnimation ready={togglePlaceholder} customPlaceholder={placeholderBody}>
      {children}
    </ReactPlaceholder>
  );
};

export default Placeholder;
