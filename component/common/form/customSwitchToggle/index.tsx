import React, { Dispatch, SetStateAction } from 'react';

export interface ICustomSwitchToggleProps {
  id: string;
  label?: string;
  toggle?: boolean;
  disabled?: boolean;
  onChange?: (e: boolean) => any;
}

const CustomSwitchToggle = (props: ICustomSwitchToggleProps) => {
  const { id, toggle = false, disabled = false, label = '' } = props;
  return (
    <div className="custom-control custom-switch">
      <input
        type="checkbox"
        className="custom-control-input"
        id={id}
        // checked={toggle}
        onChange={() => {
          if (props.onChange) {
            props.onChange(!toggle);
          }
        }}
        disabled={disabled}
      />
      <label className="custom-control-label" htmlFor={id}>
        <span style={{ fontSize: '13px', color: 'var(--color-slate-grey)' }}>{label}</span>
      </label>
    </div>
  );
};

export default CustomSwitchToggle;
