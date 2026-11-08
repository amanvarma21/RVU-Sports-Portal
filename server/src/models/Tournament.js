import mongoose from 'mongoose'

const registeredAthleteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const tournamentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tournament title is required'],
      trim: true,
    },
    sport: {
      type: String,
      required: [true, 'Sport is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date / Schedule is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Open', 'Live', 'Completed'],
      default: 'Upcoming',
    },
    statusClass: {
      type: String,
      default: 'status-upcoming',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    maxTeams: {
      type: Number,
      default: 16,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdByName: {
      type: String,
      default: 'RVU Athletic Board',
    },
    createdByEmail: {
      type: String,
      default: 'athletics@rvu.edu.in',
    },
    registeredAthletes: [registeredAthleteSchema],
  },
  {
    timestamps: true,
  }
)

export const Tournament = mongoose.model('Tournament', tournamentSchema)
