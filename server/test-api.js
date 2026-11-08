import http from 'http'
import mongoose from 'mongoose'
import app from './src/app.js'
import { connectDB } from './src/config/db.js'
import { Sport } from './src/models/Sport.js'
import { Tournament } from './src/models/Tournament.js'

console.log('🧪 Starting Automated API, Security & Atlas Database Tests for RVU Sports Portal...\n')

const TEST_PORT = 5096
const testSportId = `crud-test-${Date.now()}`
let createdTournamentId

// Connect to Atlas
await connectDB()

const server = app.listen(TEST_PORT, async () => {
  let passed = 0
  let failed = 0

  const assert = (condition, desc) => {
    if (condition) {
      console.log(`  ✓ PASS: ${desc}`)
      passed++
    } else {
      console.error(`  ✗ FAIL: ${desc}`)
      failed++
    }
  }

  const post = (path, body, headers = {}) =>
    new Promise((resolve, reject) => {
      const data = JSON.stringify(body)
      const req = http.request(
        {
          hostname: 'localhost',
          port: TEST_PORT,
          path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
            ...headers,
          },
        },
        (res) => {
          let raw = ''
          res.on('data', (c) => (raw += c))
          res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(raw) }))
        }
      )
      req.on('error', reject)
      req.write(data)
      req.end()
    })

  const get = (path, headers = {}) =>
    new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: 'localhost',
          port: TEST_PORT,
          path,
          method: 'GET',
          headers,
        },
        (res) => {
          let raw = ''
          res.on('data', (c) => (raw += c))
          res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(raw) }))
        }
      )
      req.on('error', reject)
      req.end()
    })

  const request = (method, path, body, headers = {}) =>
    new Promise((resolve, reject) => {
      const data = body === undefined ? '' : JSON.stringify(body)
      const req = http.request(
        {
          hostname: 'localhost',
          port: TEST_PORT,
          path,
          method,
          headers: {
            ...(body === undefined ? {} : {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data),
            }),
            ...headers,
          },
        },
        (res) => {
          let raw = ''
          res.on('data', (c) => (raw += c))
          res.on('end', () => resolve({ status: res.statusCode, data: raw ? JSON.parse(raw) : {} }))
        }
      )
      req.on('error', reject)
      if (data) req.write(data)
      req.end()
    })

  try {
    // 1. Root API Welcome Directory
    console.log('[Criteria 2: Backend Development & REST APIs]')
    const root = await get('/')
    assert(root.status === 200 && root.data.status === 'online', 'GET / returns API directory')

    // 2. Sports API
    const sports = await get('/api/sports')
    assert(sports.status === 200 && Array.isArray(sports.data.data), 'GET /api/sports returns sports from MongoDB Atlas')

    const cricket = await get('/api/sports/cricket')
    assert(cricket.status === 200 && cricket.data.data.name === 'Cricket', 'GET /api/sports/cricket returns cricket roster')

    // 3. Tournaments API
    const tourneys = await get('/api/tournaments')
    assert(tourneys.status === 200 && Array.isArray(tourneys.data.data), 'GET /api/tournaments returns collegiate fixtures')

    // 4. Criteria 4: Authentication & Security Verification
    console.log('\n[Criteria 4: Authentication & Security]')
    const unauthorizedLogin = await post('/api/auth/login', {
      email: 'hacker@gmail.com',
      password: 'password123',
    })
    assert(
      unauthorizedLogin.status === 403,
      'Rejects non-@rvu.edu.in email with 403 Forbidden'
    )

    const studentLogin = await post('/api/auth/login', {
      email: 'aman.varma@rvu.edu.in',
      password: 'password123',
      role: 'student',
    })
    assert(
      studentLogin.status === 200 && studentLogin.data.token,
      'Valid @rvu.edu.in student login generates secure JWT token'
    )
    const studentToken = studentLogin.data.token

    const facultyLogin = await post('/api/auth/login', {
      email: 'coach.sharma@rvu.edu.in',
      password: 'password123',
      role: 'staff',
    })
    assert(
      facultyLogin.status === 200 && facultyLogin.data.token,
      'Valid @rvu.edu.in coach login generates secure JWT token'
    )
    const facultyToken = facultyLogin.data.token
    const staffHeaders = { Authorization: `Bearer ${facultyToken}` }
    const studentHeaders = { Authorization: `Bearer ${studentToken}` }

    console.log('\n[Staff CRUD API & Authorization]')
    for (const [method, path] of [
      ['POST', '/api/sports'],
      ['PUT', '/api/sports/crud-missing'],
      ['DELETE', '/api/sports/crud-missing'],
      ['POST', '/api/tournaments'],
      ['PUT', '/api/tournaments/000000000000000000000000'],
      ['DELETE', '/api/tournaments/000000000000000000000000'],
    ]) {
      const response = await request(method, path, method === 'POST' ? {} : undefined)
      assert(response.status === 401, `Unauthenticated ${method} ${path} returns 401`)
    }
    const invalidTokenRequest = await request(
      'POST',
      '/api/sports',
      {},
      { Authorization: 'Bearer invalid-token' }
    )
    assert(invalidTokenRequest.status === 401, 'Invalid bearer token returns 401')

    for (const [method, path] of [
      ['POST', '/api/sports'],
      ['PUT', '/api/sports/cricket'],
      ['DELETE', '/api/sports/cricket'],
      ['POST', '/api/tournaments'],
      ['PUT', '/api/tournaments/000000000000000000000000'],
      ['DELETE', '/api/tournaments/000000000000000000000000'],
    ]) {
      const response = await request(method, path, method === 'POST' ? {} : undefined, studentHeaders)
      assert(response.status === 403, `Student ${method} ${path} returns 403`)
    }

    const unprovisionedStaffLogin = await post('/api/auth/login', {
      email: `first-time-staff-${Date.now()}@rvu.edu.in`,
      password: 'password123',
      role: 'staff',
    })
    assert(unprovisionedStaffLogin.status === 403, 'First-time login cannot self-provision a staff account')
    const selfStaffRegistration = await post('/api/auth/register', {
      email: `self-register-staff-${Date.now()}@rvu.edu.in`,
      password: 'password123',
      role: 'staff',
    })
    assert(selfStaffRegistration.status === 403, 'Public registration cannot create a staff account')

    const invalidSport = await request('POST', '/api/sports', { id: 'bad slug', name: '' }, staffHeaders)
    assert(invalidSport.status === 400, 'Invalid sport input returns 400')
    const invalidSportFields = await request('POST', '/api/sports', {
      id: testSportId,
      name: 'Invalid Sport',
      icon: '🏅',
      captain: 'Test Captain',
      ground: 'Test Ground',
      squadSize: true,
    }, staffHeaders)
    assert(invalidSportFields.status === 400, 'Sport fields are validated before persistence')
    const sportCreate = await request('POST', '/api/sports', {
      id: testSportId,
      name: 'CRUD Test Sport',
      icon: '🏅',
      themeClass: 'sport-football',
      tagline: 'Test squad',
      squadSize: 12,
      captain: 'Test Captain',
      ground: 'Test Ground',
      nextMatch: 'To be announced',
      recentForm: 'W - D - L',
      roster: [{ name: 'Test Player', role: 'Squad Player' }],
    }, staffHeaders)
    assert(sportCreate.status === 201 && sportCreate.data.data.id === testSportId, 'Staff creates a sport')
    const duplicateSport = await request('POST', '/api/sports', {
      id: testSportId,
      name: 'Duplicate Test Sport',
      icon: '🏅',
      captain: 'Test Captain',
      ground: 'Test Ground',
    }, staffHeaders)
    assert(duplicateSport.status === 409, 'Duplicate sport IDs are rejected')
    const sportRead = await get(`/api/sports/${testSportId}`)
    assert(sportRead.status === 200 && sportRead.data.data.name === 'CRUD Test Sport', 'Public API retrieves a created sport')
    const sportUpdate = await request('PUT', `/api/sports/${testSportId}`, {
      name: 'Updated CRUD Test Sport',
      squadSize: 14,
    }, staffHeaders)
    assert(sportUpdate.status === 200 && sportUpdate.data.data.squadSize === 14, 'Staff updates a sport')
    const missingSportUpdate = await request('PUT', '/api/sports/does-not-exist', { name: 'Missing' }, staffHeaders)
    assert(missingSportUpdate.status === 404, 'Updating a missing sport returns 404')
    const missingSportDelete = await request('DELETE', '/api/sports/does-not-exist', undefined, staffHeaders)
    assert(missingSportDelete.status === 404, 'Deleting a missing sport returns 404')
    const sportDelete = await request('DELETE', `/api/sports/${testSportId}`, undefined, staffHeaders)
    assert(sportDelete.status === 200, 'Staff deletes a sport')
    assert((await get(`/api/sports/${testSportId}`)).status === 404, 'Deleted sport is no longer publicly available')

    // 5. Protected Endpoint Verification
    const me = await get('/api/auth/me', { Authorization: `Bearer ${studentToken}` })
    assert(
      me.status === 200 && me.data.user.email === 'aman.varma@rvu.edu.in',
      'GET /api/auth/me securely validates JWT Bearer authorization'
    )

    // 6. Role-Based Access Control (RBAC): Student blocked from creating events
    console.log('\n[Criteria 4: RBAC & Faculty Event Creation]')
    const studentCreateAttempt = await post(
      '/api/tournaments',
      {
        title: 'Unauthorized Student Cup',
        sport: 'Football',
        date: 'Dec 20, 2026',
        description: 'Should fail',
      },
      { Authorization: `Bearer ${studentToken}` }
    )
    assert(
      studentCreateAttempt.status === 403,
      'Student forbidden from hosting tournaments (403 Forbidden)'
    )

    // 7. Faculty successfully creates a new tournament in Atlas
    const testTitle = `RVU Chancellor Trophy ${Date.now()}`
    const facultyCreateRes = await post(
      '/api/tournaments',
      {
        title: testTitle,
        sport: 'Basketball',
        date: 'Dec 22 - Dec 28, 2026',
        description: 'Annual inter-department basketball championship hosted by Athletics Board.',
        maxTeams: 16,
      },
      { Authorization: `Bearer ${facultyToken}` }
    )
    assert(
      facultyCreateRes.status === 201 && facultyCreateRes.data.success,
      'Faculty successfully creates tournament in MongoDB Atlas (201 Created)'
    )

    createdTournamentId = facultyCreateRes.data.data._id

    const tournamentList = await get('/api/tournaments')
    assert(
      tournamentList.status === 200 && tournamentList.data.data.some((item) => item._id === createdTournamentId),
      'Public API lists the newly created tournament'
    )
    const tournamentUpdate = await request('PUT', `/api/tournaments/${createdTournamentId}`, {
      title: `${testTitle} Updated`,
      status: 'Open',
      maxTeams: 20,
      registeredCount: 999,
    }, staffHeaders)
    assert(
      tournamentUpdate.status === 200
        && tournamentUpdate.data.data.title.endsWith('Updated')
        && tournamentUpdate.data.data.registeredCount === 0,
      'Staff updates tournament details without overwriting managed registration counts'
    )
    const invalidTournamentId = await request('PUT', '/api/tournaments/not-an-object-id', { title: 'Invalid' }, staffHeaders)
    assert(invalidTournamentId.status === 400, 'Invalid tournament ID returns 400')
    const missingTournamentUpdate = await request('PUT', '/api/tournaments/000000000000000000000000', { title: 'Missing' }, staffHeaders)
    assert(missingTournamentUpdate.status === 404, 'Updating a missing tournament returns 404')
    const missingTournamentDelete = await request('DELETE', '/api/tournaments/000000000000000000000000', undefined, staffHeaders)
    assert(missingTournamentDelete.status === 404, 'Deleting a missing tournament returns 404')

    // 8. Student registers for the newly created faculty tournament
    console.log('\n[Criteria 3: Database Design & Integration]')
    const studentRegRes = await post(
      `/api/tournaments/${createdTournamentId}/register`,
      {},
      { Authorization: `Bearer ${studentToken}` }
    )
    assert(
      studentRegRes.status === 200 && studentRegRes.data.success,
      'Student successfully registers for faculty event in MongoDB Atlas'
    )
    const registeredTournament = await get(`/api/tournaments/${createdTournamentId}`)
    assert(
      registeredTournament.status === 200 && registeredTournament.data.data.registeredCount === 1,
      'Student registration persists after tournament update'
    )
    const tournamentDelete = await request('DELETE', `/api/tournaments/${createdTournamentId}`, undefined, staffHeaders)
    assert(tournamentDelete.status === 200, 'Staff deletes a tournament')
    assert((await get(`/api/tournaments/${createdTournamentId}`)).status === 404, 'Deleted tournament is no longer publicly available')
    createdTournamentId = undefined

    console.log(`\n📊 Final Results: ${passed} passed, ${failed} failed.`)
    server.close()
    await mongoose.disconnect()
    process.exitCode = failed > 0 ? 1 : 0
  } catch (err) {
    console.error('Test execution error:', err)
    if (createdTournamentId) await Tournament.deleteOne({ _id: createdTournamentId })
    await Sport.deleteOne({ id: testSportId })
    server.close()
    await mongoose.disconnect()
    process.exitCode = 1
  }
})
