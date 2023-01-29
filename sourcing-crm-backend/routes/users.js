const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { startLinkedInScrape } = require('../controller/linkedin');
const { createUserSessionHandler, getUserSessionsHandler, invalidateUserSessionHandler } = require('../controller/session.controller');
const { createUserHandler } = require('../controller/user.controller');
const Search = require('../model/searchResult');
const { requiresUser } = require('../utils/jwt');

// register user
router.post('/register',
	body('email').isEmail(),
	body('password').isLength({ min: 6 }), createUserHandler);

// login user
router.post('/login', body('email').isEmail(),
	body('password').isLength({ min: 6 }), createUserSessionHandler);

// Get the user's sessions
router.get("/sessions", requiresUser, getUserSessionsHandler);

// Logout
router.delete("/sessions", requiresUser, invalidateUserSessionHandler);

router.post('/linkedin-scrape', requiresUser, async (req, res) => {
	console.log(req.body)
	const linkedinFilterQuery = req.body.linkedinFilterQuery;
	const result = await Search.create({ linkedinFilterQuery, linkedinSearchResults: [] });
	startLinkedInScrape(linkedinFilterQuery, result._id);
	// console.log(data);
	
	// console.log(result, 'result')
	return res.send({searchId: result._id});
});

router.post('/search-results', requiresUser, async (req, res) => {
	const { searchId } = req.body;
	const result = await Search.findById(searchId);
	return res.send(result ? result.linkedinSearchResults : []);
});

module.exports = router;
