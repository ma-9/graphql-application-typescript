import { BookingSchema as Booking, EventSchema as Event } from '../../models';
import { transformBooking, transformEvent } from './helper.function';

export default {
  bookings: async (arga, req) => {
    if (!req.isAuth) return new Error('Unauthonticated!');
    try {
      const bookings = await Booking.find();
      return bookings.map((booking: any) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args: any, req) => {
    if (!req.isAuth) return new Error('Unauthonticated!');
    const { eventId } = args;
    try {
      const fetchedEvent = await Event.findOne({ _id: eventId });
      const newBooking = new Booking({
        user: '5edccd0e8ceb0531f81b6c73',
        event: fetchedEvent,
      });
      const result: any = await newBooking.save();
      return transformBooking(result);
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) return new Error('Unauthonticated!');
    const { bookingId } = args;
    try {
      const fetchedBooking: any = await Booking.findOne({
        _id: bookingId,
      }).populate('event');
      const bookedEvent = transformEvent(fetchedBooking.event);
      await Booking.deleteOne({ _id: bookingId });
      return bookedEvent;
    } catch (error) {
      throw error;
    }
  },
};
