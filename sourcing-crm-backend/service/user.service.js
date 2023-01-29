const { omit } = require("lodash");
const User = require("../model/user");

async function createUser(input) {
    try {
      return await User.create(input);
    } catch (error) {
      throw new Error(error);
    }
}

async function validatePassword({
    email,
    password,
  }) {
    const user = await User.findOne({ email });
  
    if (!user) {
      return false;
    }
  
    const isValid = await user.comparePassword(password);
  
    if (!isValid) {
      return false;
    }
  
    return omit(user.toJSON(), "password");
  }

module.exports = {
createUser,
validatePassword,
};
