import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (val) {
          // Strictly enforce that emails end with rvu.edu.in
          return /^[^\s@]+@(?:[a-z0-9-]+\.)*rvu\.edu\.in$/i.test(val)
        },
        message: 'Access Restricted: Only official @rvu.edu.in university emails are permitted.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [4, 'Password must be at least 4 characters long'],
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      default: 'RV University',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model('User', userSchema)
