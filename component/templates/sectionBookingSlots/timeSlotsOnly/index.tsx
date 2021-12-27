import { ITimeSlotsOnlyProps } from 'pages/checkoutJourney/booking/interfaces';
import React from 'react';

interface ITimeSlotsOnlyComponent {
  data: ITimeSlotsOnlyProps[];
}

const ITimeSlotsOnly = (props: ITimeSlotsOnlyComponent) => {
  const { data = [] } = props;
  return (
    <>
      {data.map((slot, index) => (
        <div key={index}>
          <p>
            {slot.startTime} {' - '} {slot.endTime}
          </p>
        </div>
      ))}
    </>
  );
};

export default ITimeSlotsOnly;
