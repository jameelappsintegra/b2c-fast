import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import Section from 'components/common/section';
import {
  IBookingDetailsProps,
  ITimeSlotsOnlyProps,
  IWeekDataProps,
  IWeekDay,
} from 'pages/checkoutJourney/booking/interfaces';
import ITimeSlotsOnly from './timeSlotsOnly';
import { getFormattedDateTime, DATE_TIME_FORMATS } from 'libs/utils/dateTime';
import { viewportWidth } from 'libs/utils/global';
import { VIEWPORT_BREAKPOINTS } from 'libs/utils/constants';

import SlotComponent from 'components/templates/sectionBookingSlots/slotComponent';
import ResponsiveWeekTabs from './responsiveWeekTabs';
import BookingSlotsFooter from './bookingSlotsFooter';
import { SET_BOOKING_DETAILS } from '/store/actions/types';

export interface IBookingSection {
  weeks: IWeekDataProps[];
  activeTab: number;
  timeSlotsOnly: ITimeSlotsOnlyProps[];
  onClick?: (slot: any) => void;
  onClickStepper?: () => void;
}

const SectionBookingSlots = (props: IBookingSection) => {
  const { weeks = [], activeTab = 0, timeSlotsOnly = [] } = props;
  const dispatch = useDispatch();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(activeTab);
  const [localWeeks, setLocalWeeks] = useState<IWeekDataProps[]>([] as IWeekDataProps[]);
  const [bookingDetails, setBookingDetails] = useState<IBookingDetailsProps>({} as IBookingDetailsProps);
  const [weekDays, setWeekDays] = useState<IWeekDay[]>([] as IWeekDay[]);
  const storedBookingDetails = useSelector((state: any) => {
    return state.checkoutJourneyR.bookingDetails;
  });
  useEffect(() => {
    setLocalWeeks(weeks);
    setWeekDays(weeks[activeTab].weekDays);
  }, []);

  const storeBookingDetails = (bookingDetails: IBookingDetailsProps) => {
    if (bookingDetails) {
      setBookingDetails(bookingDetails);
      dispatch({
        type: SET_BOOKING_DETAILS,
        payload: bookingDetails,
      });
    }
  };

  const handleSlotClick = (weekIndex: number) => {
    setActiveTabIndex(weekIndex);
    setWeekDays(weeks[weekIndex].weekDays);

    const tempBookingDetails = {
      ...storedBookingDetails,
      defaultTab: weekIndex,
    };
    storeBookingDetails(tempBookingDetails);
  };

  const handleTabClick = (weekIndex: number) => {
    setActiveTabIndex(weekIndex);
    setWeekDays(weeks[weekIndex].weekDays);
  };

  return (
    <Section titleProps={{ text: 'Choose date and time' }}>
      {localWeeks && localWeeks.length > 0 && (
        <Container>
          {viewportWidth >= VIEWPORT_BREAKPOINTS.sm ? (
            <div className="bookingSlotsSection d-none d-md-block">
              <div className="tabHeaders">
                {localWeeks.map((weeksTab, weekTabIndex: number) => {
                  return (
                    <span
                      key={weekTabIndex}
                      className={classNames({
                        active: weekTabIndex === activeTabIndex,
                      })}
                      onClick={() => handleTabClick(Number(weeksTab.week.weekNo) - 1)}
                    >
                      {weeksTab.week.weekLabel}
                    </span>
                  );
                })}
              </div>

              <div className="bookingSlotsSection__daysComponent">
                <div className="bookingSlotsSection__daysComponent__timeSection">
                  <div>&nbsp;</div>
                  <ITimeSlotsOnly data={timeSlotsOnly} />
                </div>
                <div className="bookingSlotsSection__daysComponent__daysSection">
                  {weekDays?.map((day, weekDayIndex: number) => {
                    return (
                      <div
                        key={weekDayIndex}
                        className="bookingSlotsSection__daysComponent__daysSection__day"
                      >
                        <div className="bookingSlotsSection__daysComponent__daysSection__day__header">
                          <div className="bookingSlotsSection__daysComponent__daysSection__day__header__date">
                            <p>{day.dateObj.day}</p>
                            <p>{`${getFormattedDateTime(
                              day.dateObj.date,
                              DATE_TIME_FORMATS.dayOfMonthWithImmediateZero,
                            )} ${day.dateObj.month}`}</p>
                          </div>
                        </div>
                        <div className="bookingSlotsSection__daysComponent__daysSection__day__slots">
                          {day.slots.map((slot, slotIndex: number) => (
                            <SlotComponent
                              key={slotIndex}
                              slot={slot}
                              weekDayIndex={weekDayIndex}
                              slotIndex={slotIndex}
                              weekIndex={activeTabIndex}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bookingSlotsSection d-sm-block d-md-none">
              <ResponsiveWeekTabs
                weeks={weeks}
                weekDays={weekDays}
                activeTab={activeTab}
                timeSlotsOnly={timeSlotsOnly}
                onClick={(weekTabIndex: number) => {
                  handleSlotClick(weekTabIndex);
                }}
              />
            </div>
          )}
        </Container>
      )}
      <BookingSlotsFooter onClickStepper={props.onClickStepper} />
    </Section>
  );
};

export default SectionBookingSlots;
