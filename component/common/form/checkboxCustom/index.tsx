import React from 'react';

const CheckboxCustom = (props: any) => {
  const { id = 'checkboxId', isChecked = false, className = '', name = '', label = '' } = props;
  const link = props.hasLinkNode && props.linkNode;
  return (
    <span className={`custom-control custom-checkbox ${className} ${props.atRight ? 'right' : 'left'}`}>
      <input
        type="checkbox"
        className="custom-control-input"
        id={id}
        name={name}
        checked={isChecked}
        onClick={props.onClick}
        disabled={props.disabled}
        onChange={props.onChange}
      />
      <label className="custom-control-label" htmlFor={id}>
        <span style={{ fontSize: '13px', color: 'var(--color-slate-grey)' }}>{label}</span>
        {link}
      </label>
    </span>
  );
};

export default CheckboxCustom;
