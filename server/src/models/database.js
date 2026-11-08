import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = path.join(__dirname, '../../data/db.json')

/**
 * Default Seed Data for RV University Sports Portal
 */
const getDefaultData = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10)

  return {
    users: [
      {
        id: 'usr_1',
        email: 'aman.varma@rvu.edu.in',
        password: hashedPassword,
        name: 'Aman Varma',
        role: 'student',
        department: 'School of Computer Science & Engineering',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_2',
        email: 'coach.sharma@rvu.edu.in',
        password: hashedPassword,
        name: 'Coach Rajesh Sharma',
        role: 'staff',
        department: 'Department of Physical Education & Athletics',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_3',
        email: 'kavya.nair@rvu.edu.in',
        password: hashedPassword,
        name: 'Kavya Nair',
        role: 'student',
        department: 'School of Business',
        createdAt: new Date().toISOString(),
      },
    ],
    sports: [
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
    ],
    tournaments: [
      {
        id: 'tourn_1',
        title: 'RVU Inter-School Football Cup',
        sport: 'Football',
        date: 'Nov 18 - Nov 24, 2026',
        status: 'Upcoming',
        statusClass: 'status-upcoming',
        description: '16 university departments competing for the annual chancellor trophy at RV Sports Complex.',
        maxTeams: 16,
        registeredCount: 12,
        registeredAthletes: [
          {
            userId: 'usr_1',
            userName: 'Aman Varma',
            userEmail: 'aman.varma@rvu.edu.in',
            registeredAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'tourn_2',
        title: 'All-University Cricket League',
        sport: 'Cricket',
        date: 'Dec 01 - Dec 12, 2026',
        status: 'Open',
        statusClass: 'status-open',
        description: 'T20 tournament featuring campus teams, alumni all-stars, and faculty exhibition matches.',
        maxTeams: 12,
        registeredCount: 8,
        registeredAthletes: [],
      },
      {
        id: 'tourn_3',
        title: 'South Zone Badminton Invitational',
        sport: 'Badminton',
        date: 'Dec 15 - Dec 18, 2026',
        status: 'Scheduled',
        statusClass: 'status-live',
        description: 'Premier inter-collegiate knockout circuit for varsity singles and doubles players.',
        maxTeams: 32,
        registeredCount: 24,
        registeredAthletes: [],
      },
    ],
    matches: [
      {
        id: 'match_1',
        sportId: 'cricket',
        opponent: 'Bangalore University',
        date: '2026-10-20',
        score: 'RVU 182/4 (20.0) vs BU 158/8 (20.0)',
        result: 'Win',
        mvp: 'Aditya Sharma (68 runs, 2 wkts)',
      },
      {
        id: 'match_2',
        sportId: 'football',
        opponent: 'St. Joseph FC',
        date: '2026-10-24',
        score: 'RVU 3 - 1 St. Joseph FC',
        result: 'Win',
        mvp: 'Rohan Varma (2 goals)',
      },
      {
        id: 'match_3',
        sportId: 'basketball',
        opponent: 'Jain University',
        date: '2026-10-28',
        score: 'RVU 72 - 68 Jain Univ',
        result: 'Win',
        mvp: 'Kavya Nair (24 pts, 8 ast)',
      },
    ],
  }
}

/**
 * Thread-safe In-Memory cache + JSON file sync Database Manager
 */
class Database {
  constructor() {
    this.data = null
    this.initPromise = this.init()
  }

  async init() {
    const dataDir = path.dirname(DB_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8')
        this.data = JSON.parse(raw)
      } catch (err) {
        console.warn('⚠️ Could not parse existing db.json, reseeding default data:', err.message)
        this.data = await getDefaultData()
        this.save()
      }
    } else {
      this.data = await getDefaultData()
      this.save()
    }
  }

  async ready() {
    await this.initPromise
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8')
    } catch (err) {
      console.error('❌ Failed to write to db.json:', err)
    }
  }

  // --- User Collection Operations ---
  getUsers() {
    return this.data.users
  }

  findUserByEmail(email) {
    if (!email) return null
    const clean = email.trim().toLowerCase()
    return this.data.users.find((u) => u.email.toLowerCase() === clean) || null
  }

  findUserById(id) {
    return this.data.users.find((u) => u.id === id) || null
  }

  addUser(user) {
    this.data.users.push(user)
    this.save()
    return user
  }

  // --- Sports Collection Operations ---
  getSports() {
    return this.data.sports
  }

  findSportById(id) {
    return this.data.sports.find((s) => s.id === id) || null
  }

  // --- Tournaments Collection Operations ---
  getTournaments() {
    return this.data.tournaments
  }

  findTournamentById(id) {
    return this.data.tournaments.find((t) => t.id === id) || null
  }

  registerForTournament(tournamentId, user) {
    const tournament = this.findTournamentById(tournamentId)
    if (!tournament) return null

    if (!tournament.registeredAthletes) {
      tournament.registeredAthletes = []
    }

    const alreadyRegistered = tournament.registeredAthletes.some(
      (entry) => entry.userEmail.toLowerCase() === user.email.toLowerCase()
    )

    if (alreadyRegistered) {
      return { success: false, message: 'You are already registered for this tournament.' }
    }

    tournament.registeredAthletes.push({
      userId: user.id || 'usr_guest',
      userName: user.name,
      userEmail: user.email,
      registeredAt: new Date().toISOString(),
    })
    tournament.registeredCount = (tournament.registeredCount || 0) + 1

    this.save()
    return { success: true, tournament }
  }

  // --- Matches Collection Operations ---
  getMatches() {
    return this.data.matches
  }
}

export const db = new Database()
