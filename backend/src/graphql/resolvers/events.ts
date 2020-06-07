import { EventSchema as Event, UserSchema as User } from '../../models';
import { dateToString } from '../../helpers';
import { transformEvent } from './helper.function';

export default {
  events: async () => {
    try {
      const events: any = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) return new Error('Unauthonticated!');
    const { title, description, price, date } = args.eventInput;
    var createdEvent;
    const event = new Event({
      title,
      description,
      price,
      date: dateToString(date),
      creator: '5edccd0e8ceb0531f81b6c73',
    });
    try {
      const creator: any = await User.findById('5edccd0e8ceb0531f81b6c73');
      if (!creator) {
        throw new Error("User Doesn't exist ");
      } else {
        const result: any = await event.save();
        createdEvent = transformEvent(result);
        creator.createdEvents.push(event);
        await creator.save();
      }
      return createdEvent;
    } catch (error) {
      throw error;
    }
  },
};
