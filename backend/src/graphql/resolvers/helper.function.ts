import { EventSchema as Event, UserSchema as User } from '../../models';
import { dateToString } from '../../helpers';

const user = async (userId) => {
  try {
    const user: any = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(globalThis, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event: any) => {
      return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(globalThis, event.creator),
      };
    });
  } catch (error) {
    throw error;
  }
};

const fetchSingleEvent = async (eventID) => {
  try {
    const event: any = await Event.findOne({ _id: eventID });
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(globalThis, event.creator),
    };
  } catch (error) {
    throw error;
  }
};

export const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(globalThis, event._doc.creator),
  };
};

export const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(globalThis, booking._doc.user),
    event: fetchSingleEvent.bind(globalThis, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};
