import * as React from 'react';

export interface ICardHeaderProps {
  /** Title of the card header */
  title?: string;

  /** classnames spearated by spaces */
  classes?: string;

  styles?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface ICardProps {
  header?: ICardHeaderProps;
  children?: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

const Card = (props: ICardProps) => {
  const header = props.header && (
    <div
      className={`card-header ${props.header?.classes ? props.header?.classes : ''}`}
      style={{ ...props.header.styles }}
    >
      {props.header.children}
    </div>
  );
  return (
    <div className={`card ${props.cardClassName ? props.cardClassName : ''}`}>
      {header}
      <div className={`card-body ${props.className ? props.className : ''}`}>{props.children}</div>
    </div>
  );
};

export default Card;
