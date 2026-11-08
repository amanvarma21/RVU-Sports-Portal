import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema(
  {
    sportId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    opponent: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ['Win', 'Loss', 'Draw', 'Upcoming'],
      default: 'Win',
    },
    mvp: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Match = mongoose.model('Match', matchSchema)
