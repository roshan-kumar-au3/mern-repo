const { validationResult } = require("express-validator");
const { omit, get } = require("lodash");
const { createSession, updateSession, findSessions } = require("../service/session.service");
const { validatePassword } = require("../service/user.service");
const { sign, createAccessToken } = require("../utils/jwt");


const accessTokenTtl = "60d";
const refreshTokenTtl = "1y";

async function createUserSessionHandler(req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // validate the email and password
        const user = await validatePassword(req.body);

        if (!user) {
            return res.status(401).send("Invalid username or password");
        }

        // Create a session
        const session = await createSession(user._id, req.get("user-agent") || "");

        // create access token
        const accessToken = createAccessToken({
            user,
            session,
        });

        // create refresh token
        const refreshToken = sign(session, {
            expiresIn: refreshTokenTtl, // 1 year
        });

        // send refresh & access token back
        return res.send({ accessToken, refreshToken, user });
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

async function invalidateUserSessionHandler(
    req,
    res
  ) {
    const sessionId = get(req, "user.session");
  
    await updateSession({ _id: sessionId }, { valid: false });
  
    return res.sendStatus(200);
  }
  
async function getUserSessionsHandler(req, res) {
    const userId = get(req, "user._id");
  
    const sessions = await findSessions({ user: userId, valid: true });
  
    return res.send(sessions);
  }
module.exports = {
    createUserSessionHandler,
    invalidateUserSessionHandler,
    getUserSessionsHandler,
};