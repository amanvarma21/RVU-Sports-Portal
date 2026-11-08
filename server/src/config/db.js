import dns from 'dns'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { Sport } from '../models/Sport.js'
import { Tournament } from '../models/Tournament.js'
import { Match } from '../models/Match.js'

// Fix for Windows DNS resolving SRV records for Atlas clusters
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch {
  // Ignore in environments where setting servers is restricted
}

/**
 * Connect to MongoDB Atlas cluster
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI

  if (!uri) {
    throw new Error('❌ Missing MongoDB Atlas connection URI in environment variables (MONGO_URI).')
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas cluster...')
    const conn = await mongoose.connect(uri, {
      dbName: 'rvu_sports',
      serverSelectionTimeoutMS: 10000,
    })

    console.log(`✓ Connected to MongoDB Atlas: ${conn.connection.host} / Database: ${conn.connection.name}`)

    // Auto-seed initial data if database is fresh
    await seedDatabase()
    return conn
  } catch (err) {
    console.error('❌ MongoDB Atlas connection error:', err.message)
    throw err
  }
}

/**
 * Seed initial sports, tournaments, and demo accounts if collections are empty
 */
export const seedDatabase = async () => {
  try {
    // 1. Seed Sports
    const sportsCount = await Sport.countDocuments()
    if (sportsCount === 0) {
      console.log('🌱 Seeding initial RVU Varsity Sports into MongoDB Atlas...')
      await Sport.insertMany([
        {
          id: 'cricket',
          name: 'Cricket',
          icon: '🏏',
          themeClass: 'sport-cricket',
          tagline: 'Varsity & Club Teams',
          squadSize: 22,
          captain: 'Aditya Sharma',
          ground: 'RVU Turf Ground',
          nextMatch: 'vs Bangalore University — Nov 14',
          recentForm: 'W - W - L - W',
          roster: [
            { name: 'Aditya Sharma', role: 'Captain / All-rounder' },
            { name: 'Sameer Kulkarni', role: 'Opening Batsman' },
            { name: 'Rahul Joshi', role: 'Fast Bowler' },
            { name: 'Pranav Rao', role: 'Wicket Keeper' },
            { name: 'Varun Reddy', role: 'Spin Bowler' },
          ],
        },
        {
          id: 'football',
          name: 'Football',
          icon: '⚽',
          themeClass: 'sport-football',
          tagline: 'Men & Women Squads',
          squadSize: 25,
          captain: 'Rohan Varma',
          ground: 'RV Sports Complex',
          nextMatch: 'vs PES FC — Nov 18',
          recentForm: 'W - W - W - D',
          roster: [
            { name: 'Rohan Varma', role: 'Captain / Forward' },
            { name: 'Devendra Singh', role: 'Midfielder' },
            { name: 'Farhan Ali', role: 'Center Back' },
            { name: 'Arun Kumar', role: 'Goalkeeper' },
            { name: 'Vikram Menon', role: 'Winger' },
          ],
        },
        {
          id: 'basketball',
          name: 'Basketball',
          icon: '🏀',
          themeClass: 'sport-basketball',
          tagline: 'Inter-Collegiate Champions',
          squadSize: 15,
          captain: 'Kavya Nair',
          ground: 'RVU Indoor Court 1',
          nextMatch: 'vs Christ Stars — Nov 22',
          recentForm: 'W - L - W - W',
          roster: [
            { name: 'Kavya Nair', role: 'Captain / Point Guard' },
            { name: 'Ananya Deshmukh', role: 'Shooting Guard' },
            { name: 'Ritika Sen', role: 'Small Forward' },
            { name: 'Tanvi Hegde', role: 'Power Forward' },
            { name: 'Pooja Iyer', role: 'Center' },
          ],
        },
        {
          id: 'volleyball',
          name: 'Volleyball',
          icon: '🏐',
          themeClass: 'sport-volleyball',
          tagline: 'South Zone Circuit',
          squadSize: 14,
          captain: 'Nikhil Gowda',
          ground: 'RVU Outdoor Court',
          nextMatch: 'vs BMS Strikers — Nov 25',
          recentForm: 'L - W - W - W',
          roster: [
            { name: 'Nikhil Gowda', role: 'Captain / Setter' },
            { name: 'Siddharth Patil', role: 'Outside Hitter' },
            { name: 'Chirag Shetty', role: 'Middle Blocker' },
            { name: 'Kiran Nayak', role: 'Libero' },
          ],
        },
        {
          id: 'badminton',
          name: 'Badminton',
          icon: '🏸',
          themeClass: 'sport-badminton',
          tagline: 'Singles & Doubles Circuit',
          squadSize: 12,
          captain: 'Sneha Patel',
          ground: 'RVU Badminton Arena',
          nextMatch: 'State University Open — Dec 02',
          recentForm: 'W - W - W - W',
          roster: [
            { name: 'Sneha Patel', role: 'Captain / Singles No. 1' },
            { name: 'Manish Verma', role: 'Men Singles' },
            { name: 'Divya & Rashmi', role: 'Women Doubles Pair' },
            { name: 'Abhinav & Tarun', role: 'Men Doubles Pair' },
          ],
        },
      ])
    }

    // 2. Seed Users
    const usersCount = await User.countDocuments()
    if (usersCount === 0) {
      console.log('🌱 Seeding initial demo student & coach accounts...')
      const hashedPassword = await bcrypt.hash('password123', 10)
      await User.insertMany([
        {
          email: 'aman.varma@rvu.edu.in',
          password: hashedPassword,
          name: 'Aman Varma',
          role: 'student',
          department: 'School of Computer Science & Engineering',
        },
        {
          email: 'coach.sharma@rvu.edu.in',
          password: hashedPassword,
          name: 'Coach Rajesh Sharma',
          role: 'staff',
          department: 'Department of Physical Education & Athletics',
        },
        {
          email: 'kavya.nair@rvu.edu.in',
          password: hashedPassword,
          name: 'Kavya Nair',
          role: 'student',
          department: 'School of Business',
        },
      ])
    }

    // 3. Seed Tournaments
    const tournCount = await Tournament.countDocuments()
    if (tournCount === 0) {
      console.log('🌱 Seeding initial Tournaments into Atlas...')
      await Tournament.insertMany([
        {
          title: 'RVU Inter-School Football Cup',
          sport: 'Football',
          date: 'Nov 18 - Nov 24, 2026',
          status: 'Upcoming',
          statusClass: 'status-upcoming',
          description: '16 university departments competing for the annual chancellor trophy at RV Sports Complex.',
          maxTeams: 16,
          registeredCount: 12,
          createdByName: 'Coach Rajesh Sharma',
          createdByEmail: 'coach.sharma@rvu.edu.in',
          registeredAthletes: [
            {
              userId: 'demo_user',
              userName: 'Aman Varma',
              userEmail: 'aman.varma@rvu.edu.in',
              registeredAt: new Date(),
            },
          ],
        },
        {
          title: 'All-University Cricket League',
          sport: 'Cricket',
          date: 'Dec 01 - Dec 12, 2026',
          status: 'Open',
          statusClass: 'status-open',
          description: 'T20 tournament featuring campus teams, alumni all-stars, and faculty exhibition matches.',
          maxTeams: 12,
          registeredCount: 8,
          createdByName: 'Coach Rajesh Sharma',
          createdByEmail: 'coach.sharma@rvu.edu.in',
          registeredAthletes: [],
        },
        {
          title: 'South Zone Badminton Invitational',
          sport: 'Badminton',
          date: 'Dec 15 - Dec 18, 2026',
          status: 'Scheduled',
          statusClass: 'status-live',
          description: 'Premier inter-collegiate knockout circuit for varsity singles and doubles players.',
          maxTeams: 32,
          registeredCount: 24,
          createdByName: 'Coach Rajesh Sharma',
          createdByEmail: 'coach.sharma@rvu.edu.in',
          registeredAthletes: [],
        },
      ])
    }

    // 4. Seed Matches
    const matchCount = await Match.countDocuments()
    if (matchCount === 0) {
      console.log('🌱 Seeding recent match scores...')
      await Match.insertMany([
        {
          sportId: 'cricket',
          opponent: 'Bangalore University',
          date: '2026-10-20',
          score: 'RVU 182/4 (20.0) vs BU 158/8 (20.0)',
          result: 'Win',
          mvp: 'Aditya Sharma (68 runs, 2 wkts)',
        },
        {
          sportId: 'football',
          opponent: 'St. Joseph FC',
          date: '2026-10-24',
          score: 'RVU 3 - 1 St. Joseph FC',
          result: 'Win',
          mvp: 'Rohan Varma (2 goals)',
        },
        {
          sportId: 'basketball',
          opponent: 'Jain University',
          date: '2026-10-28',
          score: 'RVU 72 - 68 Jain Univ',
          result: 'Win',
          mvp: 'Kavya Nair (24 pts, 8 ast)',
        },
      ])
    }
  } catch (err) {
    console.error('⚠️ Seeding warning:', err.message)
  }
}
