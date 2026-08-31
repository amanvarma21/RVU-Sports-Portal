import './App.css'

function App() {
  return (
    <>
      {/* NAVBAR */}

      <header>
        <nav className="navbar">

          <div className="logo">
            RVU <span>SPORTS</span>
          </div>

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#sports">Sports</a>
            <a href="#tournaments">Tournaments</a>
            <a href="#about">About</a>
          </div>

          <button className="login-btn">
            Login
          </button>

        </nav>
      </header>


      {/* HERO */}

      <main>

        <section className="hero" id="home">

          <div className="hero-content">

            <p className="hero-label">
              RVU SPORTS PORTAL
            </p>

            <h1>
              Your Team.
              <br />
              Your History.
              <br />
              <span>Your Game.</span>
            </h1>

            <p className="hero-description">
              Explore RVU sports teams, match history,
              player statistics and upcoming tournaments
              — all in one place.
            </p>

            <button className="hero-btn">
              Explore Sports
            </button>

          </div>

        </section>


        {/* FEATURES */}

        <section className="features">

          <div className="section-heading">

            <p>WHAT WE OFFER</p>

            <h2>
              Everything About RVU Sports
            </h2>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                🏆
              </div>

              <h3>Team History</h3>

              <p>
                Explore team performances and
                match history across different seasons.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                📊
              </div>

              <h3>Match Statistics</h3>

              <p>
                View match results, player statistics
                and memorable performances.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                📅
              </div>

              <h3>Upcoming Events</h3>

              <p>
                Stay updated with tournaments,
                matches and sports announcements.
              </p>

            </div>

          </div>

        </section>


        {/* SPORTS */}

        <section className="sports" id="sports">

          <div className="section-heading">

            <p>EXPLORE</p>

            <h2>Our Sports</h2>

          </div>


          <div className="sports-grid">

            <div className="sport-card">
              <h3>Cricket</h3>
              <a href="#">View Team →</a>
            </div>

            <div className="sport-card">
              <h3>Football</h3>
              <a href="#">View Team →</a>
            </div>

            <div className="sport-card">
              <h3>Basketball</h3>
              <a href="#">View Team →</a>
            </div>

            <div className="sport-card">
              <h3>Volleyball</h3>
              <a href="#">View Team →</a>
            </div>

            <div className="sport-card">
              <h3>Badminton</h3>
              <a href="#">View Team →</a>
            </div>

          </div>

        </section>


        {/* ABOUT */}

        <section className="about" id="about">

          <div className="about-content">

            <p className="section-label">
              OUR PURPOSE
            </p>

            <h2>
              Preserving Our Sporting Legacy
            </h2>

            <p>
              RVU Sports brings together the history of
              our college teams, matches, players and
              tournaments in one centralized platform.
            </p>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <h2>RVU SPORTS</h2>

        <p>
          Your Team. Your History. Your Game.
        </p>

        <p>
          © 2026 RVU Sports
        </p>

      </footer>

    </>
  )
}

export default App