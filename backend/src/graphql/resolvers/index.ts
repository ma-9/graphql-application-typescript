import AuthResolver from './auth';
import BookingResolver from './bookings';
import EventResolver from './events';

export default {
  ...AuthResolver,
  ...BookingResolver,
  ...EventResolver,
};
