import mongoose from 'mongoose'

const sportSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    themeClass: {
      type: String,
      default: 'sport-football',
    },
    tagline: {
      type: String,
      default: 'Varsity Team',
    },
    squadSize: {
      type: Number,
      default: 15,
    },
    captain: {
      type: String,
      required: true,
    },
    ground: {
      type: String,
      required: true,
    },
    nextMatch: {
      type: String,
      default: 'Upcoming fixture to be announced',
    },
    recentForm: {
      type: String,
      default: 'W - W - W - D',
    },
    roster: [
      {
        name: { type: String, required: true },
        role: { type: String, default: 'Squad Player' },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const Sport = mongoose.model('Sport', sportSchema)
