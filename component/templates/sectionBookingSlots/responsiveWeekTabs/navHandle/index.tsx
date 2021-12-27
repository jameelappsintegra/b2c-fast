import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IBookingNavHandleProps {
  direction: 'left' | 'right';
  onClick: (direction: string) => void;
}

/**
 * Slot navigation tab handles to switch among week tabs
 * @param props
 */
const BookingNavHandle = (props: IBookingNavHandleProps) => {
  const { direction = '' } = props;
  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        props.onClick(direction);
      }}
    >
      <FontAwesomeIcon
        style={{ color: 'var(--color-azure)' }}
        icon={direction === 'left' ? 'chevron-left' : 'chevron-right'}
      />
    </span>
  );
};

export default BookingNavHandle;
