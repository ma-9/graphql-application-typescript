import React from 'react';
import './EventItem.css';

interface IEventItemProps {
  event: object;
  userId: string;
  viewDetail: any;
}

const EventItemComponent: React.FC<IEventItemProps> = (props) => {
  const event: any = props.event;
  return (
    <li key={event._id} className='events__list-item'>
      <div>
        <h1>{event.title}</h1>
        <h2>
          ₹{event.price} - {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {props.userId === event.creator._id ? (
          <p>You are the owner of this event.</p>
        ) : (
          <button onClick={props.viewDetail.bind(globalThis, event._id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItemComponent;
