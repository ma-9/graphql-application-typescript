import React from 'react';
import './EventList.css';
import { EventItemComponent } from 'Components';

interface IEventListProps {
  events: any;
  AuthUserID: string;
  viewEventDetails: any;
}

const EventListComponent: React.FC<IEventListProps> = (props) => {
  const eventList = props.events.map((event: any) => (
    <EventItemComponent
      key={event._id}
      event={event}
      userId={props.AuthUserID}
      viewDetail={props.viewEventDetails}
    />
  ));
  return <ul className='events__list'>{eventList}</ul>;
};

export default EventListComponent;
