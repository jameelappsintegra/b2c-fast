import React from 'react';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Link from 'next/link';

interface IAppButtonProps {
  text: string;
  variant?: 'outlined' | 'filled';
  shape?: 'rounded' | 'rectangular';
  type?: 'submit';
  url?: string;
  disabled?: boolean;
  isSmall?: boolean;
  styles?: React.CSSProperties;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void | Promise<void> | undefined;
  /**
   * If button is center aligned to its parent
   */
  isCentered?: boolean;
  /**
   * If button has large width
   */
  isLarge?: boolean;
  spinner?: React.ReactNode;
}

const Component = (props: IAppButtonProps) => {
  const { url, isLarge, isSmall, isCentered, ...options } = props;
  const classes = [
    true ? 'appButton__button' : null,
    props.variant === 'filled' ? 'filled' : null,
    props.variant === 'outlined' ? 'outlined' : null,
    props.shape === 'rounded' ? 'rounded' : null,
    props.shape === 'rectangular' ? 'rectangular' : null,
    isLarge ? 'isLarge' : null,
    isSmall ? 'isSmall' : null,
    props.disabled ? 'disabled' : null,
  ];
  const template = url ? (
    <Link href={props.url ? props.url : '#'}>
      <span
        style={props.styles}
        className={`${classes.join(' ')} link`}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          if (props.onClick) {
            props.onClick(e);
          }
        }}
      >
        {props.text}
      </span>
    </Link>
  ) : (
    <Button {...options} className={classes.join(' ')} disabled={props.disabled} style={props.styles}>
      {props.spinner}
      {props.text}
    </Button>
  );
  return <div className={`appButton ${props?.isCentered ? 'text-center' : ''}`}>{template}</div>;
};

Component.displayName = 'AppButton';
Component.defaultProps = {
  variant: 'filled',
  type: 'rectangular',
} as any;

export const AppButton = Component;
export default AppButton;
