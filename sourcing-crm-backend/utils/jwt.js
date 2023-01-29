const jwt = require("jsonwebtoken");
const { get } = require("lodash");
const { reIssueAccessTokenFn } = require("../service/session.service.js");


const privateKey = "secret";

function sign(object,options) {
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

  console.log({accessToken: accessToken, refreshToken: refreshToken});

  if (!accessToken) return next();

  const { decoded, expired } = decode(accessToken);
  
  console.log({decoded: decoded, expired: expired});

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
      console.log({decoded: decoded});
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
};