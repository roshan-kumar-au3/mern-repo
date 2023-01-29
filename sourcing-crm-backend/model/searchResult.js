const mongoose = require("mongoose");

const SearchResults = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	linkedinFilterQuery: { type: Object, default: {} },
	linkedinSearchResults: { type: Array, default: [] },
	shortListedCandidates: { type: Array, default: [] },
},
	{ timestamps: true }
);

const Search = mongoose.model("Search", SearchResults);

module.exports = Search;