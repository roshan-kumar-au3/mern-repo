const Session = require('../model/session');
const { decode, sign } = require('../utils/jwt');


async function createSession(userId, userAgent) {
    const session = await Session.create({ user: userId, userAgent });
  
    return session.toJSON();
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
    updateSession,
    findSessions,
};