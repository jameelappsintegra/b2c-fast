import React from 'react';
import classNames from 'classnames';
import { SLOT_STATUS_AVAILABLE, SLOT_STATUS_SELECTED } from 'libs/utils/global';
import { useDispatch, useSelector } from 'react-redux';
import { ISlotProps } from 'pages/checkoutJourney/booking/interfaces';
import { SET_BOOKING_DETAILS } from '/store/actions/types';

export interface ISlotComponentProps {
  slot: ISlotProps;
  slotIndex: number;
  weekDayIndex: number;
  weekIndex: number;
  onClick?: (slot: ISlotProps) => void;
}

const SlotComponent = (props: ISlotComponentProps) => {
  const { slot = {} as ISlotProps, weekIndex, weekDayIndex, slotIndex } = props;
  const dispatch = useDispatch();
  const storedBookingDetails = useSelector((state: any) => {
    return state.checkoutJourneyR.bookingDetails;
  });

  const storeBookingDetails = () => {
    // Match with existing indexes
    let deSelection = false;
    if (
      storedBookingDetails.selectedSlotHash?.weekDayIndex === weekDayIndex &&
      storedBookingDetails.selectedSlotHash?.slotIndex === slotIndex &&
      storedBookingDetails.selectedSlotHash?.weekIndex === weekIndex
    ) {
      deSelection = true;
    }

    const tempBookingDetails = {
      ...storedBookingDetails,
      selectedSlotHash: deSelection ? {} : { slotIndex, weekDayIndex, weekIndex },
      selectedSlot: deSelection ? {} : slot,
      defaultTab: weekIndex,
    };
    dispatch({
      type: SET_BOOKING_DETAILS,
      payload: tempBookingDetails,
    });
  };

  return (
    <div
      className={`${classNames({
        isSelected:
          weekDayIndex === storedBookingDetails.selectedSlotHash?.weekDayIndex &&
          slotIndex === storedBookingDetails.selectedSlotHash?.slotIndex &&
          weekIndex === storedBookingDetails.selectedSlotHash?.weekIndex,
        emptySlot: slot.status !== SLOT_STATUS_AVAILABLE,
      })}`}
    >
      {slot.status === SLOT_STATUS_AVAILABLE || slot.status === SLOT_STATUS_SELECTED ? (
        <p
          onClick={() => {
            storeBookingDetails();
          }}
        >
          {weekDayIndex === storedBookingDetails.selectedSlotHash?.weekDayIndex &&
          slotIndex === storedBookingDetails.selectedSlotHash?.slotIndex &&
          weekIndex === storedBookingDetails.selectedSlotHash?.weekIndex
            ? SLOT_STATUS_SELECTED
            : slot.status}
        </p>
      ) : (
        <p>
          <span>&nbsp;</span>
        </p>
      )}
    </div>
  );
};

export default SlotComponent;
