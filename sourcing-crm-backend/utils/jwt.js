const jwt = require("jsonwebtoken");
const { get } = require("lodash");
const Session = require("../model/session");


const privateKey = "secret";
const accessTokenTtl = "60d";
const refreshTokenTtl = "1y";

function sign(object, options) {
  return jwt.sign(object, privateKey, options);
}

function decode(token) {
  try {
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
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
};

const deserializeUser = async (
  req,
  res,
  next,
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");

  console.log({ accessToken: accessToken, refreshToken: refreshToken });

  if (!accessToken) return next();

  const { decoded, expired } = decode(accessToken);

  console.log({ decoded: decoded, expired: expired });

  if (decoded) {
    req.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessTokenFn({ refreshToken });

    if (newAccessToken) {
      // Add the new access token to the response header
      res.setHeader("x-access-token", newAccessToken);

      const { decoded } = decode(newAccessToken);
      console.log({ decoded: decoded });
      req.user = decoded;
    }

    return next();
  }

  return next();
};

const requiresUser = async (
  req,
  res,
  next
) => {
  const user = get(req, "user");

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
};

module.exports = {
  sign,
  decode,
  deserializeUser,
  requiresUser,
  createAccessToken,
  reIssueAccessTokenFn,
};