import React from 'react';
import './BookingList.css';

interface IBookingListingProps {
  bookings: any;
  onDelete: any;
}

const BookingListComponent: React.FC<IBookingListingProps> = (props) => {
  return (
    <ul className='bookings__list'>
      {props.bookings.map((booking: any) => (
        <li key={booking._id} className='bookings__item'>
          <div>
            <h2>
              {booking.event.title} -{' '}
              {new Date(booking.event.date).toLocaleDateString()}
            </h2>
          </div>
          <div>
            <button onClick={props.onDelete.bind(globalThis, booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookingListComponent;
