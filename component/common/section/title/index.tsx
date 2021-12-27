import * as React from 'react';
import classNames from 'classnames';

export interface ITitleProps {
  text: string;
  textColor?: string;
  textAlign?: 'left' | 'right';
  separatorColor?: string;
}

const Title = (props: ITitleProps) => {
  const textColor = props.textColor && props.textColor;
  return (
    <div className="title text-center">
      <h3
        className={`title__text ${classNames({
          alignLeft: props.textAlign === 'left',
          alignRight: props.textAlign === 'right',
        })}`}
        style={{ color: textColor }}
      >
        {props.text}
        <span
          className={`separator ${classNames({
            alignLeft: props.textAlign === 'left',
            alignRight: props.textAlign === 'right',
          })}`}
          style={{ borderColor: props.separatorColor }}
        />
      </h3>
    </div>
  );
};

export default Title;
