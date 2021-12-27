import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormGroup from 'components/common/form/formGroup';
import FormCustom from 'components/common/form';
import SlotComponent from 'components/templates/sectionBookingSlots/slotComponent';
import ITimeSlotsOnly from '../timeSlotsOnly';
import { DATE_TIME_FORMATS, getFormattedDateTime } from 'libs/utils/dateTime';
import BookingNavHandle from './navHandle';
import {
  ISlotProps,
  ITimeSlotsOnlyProps,
  IWeekDataProps,
  IWeekDay,
} from 'pages/checkoutJourney/booking/interfaces';

interface IResponsiveWeekTabsProps {
  weeks: IWeekDataProps[];
  weekDays: IWeekDay[];
  activeTab: number;
  timeSlotsOnly: ITimeSlotsOnlyProps[];
  onClick: (weekTabIndex: number) => void;
}

const ResponsiveWeekTabs = (props: IResponsiveWeekTabsProps) => {
  const { weeks = [], weekDays, activeTab = 0, timeSlotsOnly = [] } = props;
  let days: any = [];
  const [weekDaysNames, setWeekDaysNames] = useState<any[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(activeTab);
  const [weekDayIndex, setWeekDayIndex] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<any>(null);
  const [selectedDaySlots, setSelectedDaySlots] = useState<any[]>([]);
  const [selectedDropdownVal, setSelectedDropdownVal] = useState<string>(weekDayIndex.toString());
  const storedBookingDetails = useSelector((state: any) => {
    return state.checkoutJourneyR.bookingDetails;
  });

  useEffect(() => {
    renderActiveTab();
    if (storedBookingDetails && Object.entries(storedBookingDetails)?.length) {
      const selectedSlotHash = storedBookingDetails.selectedSlotHash;
      if (selectedSlotHash && Object.entries(selectedSlotHash)?.length) {
        if (selectedSlotHash?.weekDayIndex >= 0) {
          setSelectedDropdownVal((selectedSlotHash.weekDayIndex + 1).toString()); // +1 to avoid 'Choose' in dropdown
          setSelectedDaySlots(weekDays[selectedSlotHash.weekDayIndex]?.slots);
        }
      } else {
        defaultDaySelection();
      }
    }
  }, []);

  useEffect(() => {
    renderWeekDays();
    renderActiveTab();
    defaultDaySelection();
    renderDaySlots(0);
  }, [activeTabIndex]);

  /**
   * Renders formatted days in dropdown
   */
  const renderWeekDays = () => {
    const tempWeekDays = weeks[activeTabIndex].weekDays;
    if (tempWeekDays && tempWeekDays.length > 0) {
      days = [];
      days = tempWeekDays.map((slotDay: any, index: number) => {
        return {
          value: (index + 1).toString(),
          name: `${slotDay.dateObj.day} ${getFormattedDateTime(
            slotDay.dateObj.date,
            DATE_TIME_FORMATS.dayOfMonth,
          )} ${slotDay.dateObj.month}`,
        };
      });
      setWeekDaysNames(days);
    }
  };

  const renderActiveTab = () => {
    if (weeks && weeks.length) {
      {
        setCurrentTab(
          <span
            key={activeTabIndex}
            className="active"
            onClick={() => {
              if (props.onClick) {
                setActiveTabIndex(Number(weeks[activeTabIndex].week.weekNo) - 1);
                props.onClick(Number(weeks[activeTabIndex].week.weekNo) - 1);
              }
            }}
          >
            {weeks[activeTabIndex].week.weekLabel}
          </span>,
        );
      }
    }
  };

  /**
   * Pre-select default first day of the dropdown
   */
  const defaultDaySelection = () => {
    setSelectedDropdownVal((1).toString());
    setSelectedDaySlots(weekDays[activeTabIndex].slots);
  };

  const handleBookingTabs = (direction: string) => {
    if (direction === 'right') {
      if (activeTabIndex + 1 <= weeks.length) {
        setActiveTabIndex(activeTabIndex + 1);
      }
    }
    if (direction === 'left') {
      if (activeTabIndex - 1 >= -1) {
        setActiveTabIndex(activeTabIndex - 1);
      }
    }
  };

  const handleOnDaySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    renderDaySlots(Number(target.value) - 1);
    setSelectedDropdownVal(Number(target.value).toString());
  };

  /**
   * Renders slots for selected day from dropdown
   * @param index day index in a week
   */
  const renderDaySlots = (index: number) => {
    const tempWeekDays = weeks[activeTabIndex].weekDays;
    setSelectedDaySlots(tempWeekDays[index]?.slots);
    setWeekDayIndex(index);
  };

  return (
    <div>
      <div className="responsiveWeekTabs tabHeaders">
        {activeTabIndex > 0 && <BookingNavHandle direction="left" onClick={handleBookingTabs} />}
        {currentTab}
        {activeTabIndex < weeks.length - 1 && (
          <BookingNavHandle direction="right" onClick={handleBookingTabs} />
        )}
      </div>

      <div className="responsiveDaysComponent">
        <div className="responsiveDaysComponent__dropdown">
          <FormCustom>
            <FormGroup
              id="weeksDropdown"
              formControl={{
                type: 'select',
                options: weekDaysNames,
                value: selectedDropdownVal,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleOnDaySelect(e),
              }}
            />
          </FormCustom>
        </div>
        <div className="responsiveDaysComponent__timeSlots">
          <div className="responsiveDaysComponent__timeCol">
            <ITimeSlotsOnly data={timeSlotsOnly} />
          </div>
          {selectedDaySlots && selectedDaySlots.length > 0 ? (
            <div className="responsiveDaysComponent__slotsCol">
              {selectedDaySlots.map((slot: ISlotProps, slotIndex: number) => {
                return (
                  <div key={slotIndex}>
                    <SlotComponent
                      slot={slot}
                      weekDayIndex={weekDayIndex}
                      slotIndex={slotIndex}
                      weekIndex={activeTabIndex}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveWeekTabs;
