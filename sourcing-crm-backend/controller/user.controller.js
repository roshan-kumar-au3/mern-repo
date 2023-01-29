const { validationResult } = require("express-validator");
const { omit } = require("lodash");
const User = require("../model/user");
const { createUser } = require("../service/user.service");

async function createUserHandler(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const isUserFound = await User.findOne({ email: req.body.email });
  
        if (isUserFound) {
          return res.status(400).json({ errors: [{ "msg": "User already exists"}] });;
        }
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), "password"));
    } catch (e) {
        console.log(e);
        return res.status(409).send(e.message);
    }
}

module.exports = {
    createUserHandler,
}