import bcrypt from 'bcryptjs';
import { UserSchema as User } from '../../models';
import jwt from 'jsonwebtoken';

export default {
  createUser: async (args: any) => {
    const { email, password } = args.userInput;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser: any = new User({
          email,
          password: hashedPassword,
        });
        await newUser.save();
        return { ...newUser._doc, password: null, _id: newUser.id };
      }
    } catch (error) {
      throw error;
    }
  },
  login: async (args) => {
    const { email, password } = args;
    try {
      const user: any = await User.findOne({ email });
      if (!user) {
        throw new Error("User Doesn't Exist");
      } else {
        const verifiedUser = await bcrypt.compare(password, user.password);
        if (!verifiedUser) {
          throw new Error('Password is not correct...');
        } else {
          const token = jwt.sign(
            { userId: user.id, email: user.email },
            'badboysecurities-graphql',
            { expiresIn: '1h' }
          );
          return { userId: user.id, token, tokenExpiration: 1 };
        }
      }
    } catch (error) {
      throw error;
    }
  },
};
