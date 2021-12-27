import * as React from 'react';
// import { css } from "@emotion/react";
import PropagateLoader from 'react-spinners/PropagateLoader';

// Can be a string as well. Need to ensure each key-value pair ends with ;
// const override = css`
// display: block;
// margin: 0 auto;
// border-color: var(--color-azure);
// background-color: var(--color-azure);
// `;

interface ILoaderProps {
  color: string;
  loading: boolean;
  styles?: any;
}
const Loader = (props: ILoaderProps) => {
  const { color = '', loading = false, styles = {} } = props;
  return (
    <div className="loaderWrapper" style={{ ...styles }}>
      <PropagateLoader
        color={color}
        loading={loading}
        // css={override}
        size={15}
      />
    </div>
  );
};

export default Loader;
