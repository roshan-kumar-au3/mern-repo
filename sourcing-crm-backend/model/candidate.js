const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    location: { type: String },
    currentPosition: { type: String },
    profileLink: { type: String },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;