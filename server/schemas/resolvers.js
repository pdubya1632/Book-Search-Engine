const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id,
        }).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('Please log in first');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      console.log(user);
      const token = signToken(user);
      console.log(token);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.find({ email });
      console.log(user);
      if (!user) {
        throw new AuthenticationError('No user with this email!');
      }

      const correctPw = await user[0].isCorrectPassword(password);
      console.log(correctPw);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect Password!');
      }

      const token = signToken(user[0]);

      const user1 = user[0];

      return { user1, token };
    },

    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const update = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: book } },
          { new: true }
        );
        return update;
      }

      throw new AuthenticationError('Please log in first');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const removeBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return removeBook;
      }

      throw new AuthenticationError('Please log in first');
    },
  },
};

module.exports = resolvers;
