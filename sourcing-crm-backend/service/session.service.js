const Session = require('../model/session');
const { decode, sign } = require('../utils/jwt');


const accessTokenTtl = "60d";
const refreshTokenTtl = "1y";

async function createSession(userId, userAgent) {
    const session = await Session.create({ user: userId, userAgent });
  
    return session.toJSON();
}

function createAccessToken({
    user,
    session,
  }) {
    // Build and return the new access token
    const accessToken = sign(
      { ...user, session: session._id },
      { expiresIn: accessTokenTtl } // 15 minutes
    );
  
    return accessToken;
  }
  
async function reIssueAccessTokenFn({
    refreshToken,
  }) {
    // Decode the refresh token
    const { decoded } = decode(refreshToken);
  
    if (!decoded || !get(decoded, "_id")) return false;
  
    // Get the session
    const session = await Session.findById(get(decoded, "_id"));
  
    // Make sure the session is still valid
    if (!session || !session?.valid) return false;
  
    const user = await findUser({ _id: session.user });
  
    if (!user) return false;
  
    const accessToken = createAccessToken({ user, session });
  
    return accessToken;
  }
  
async function updateSession(
    query,
    update
  ) {
    return Session.updateOne(query, update);
  }
  
async function findSessions(query) {
    return Session.find(query).lean();
  }

module.exports = {
    createSession,
    createAccessToken,
    reIssueAccessTokenFn,
    updateSession,
    findSessions,
};