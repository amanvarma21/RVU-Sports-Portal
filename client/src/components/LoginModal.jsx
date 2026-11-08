function LoginModal({
  loginRole,
  setLoginRole,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginError,
  setLoginError,
  isSubmitting,
  hasTypedEmail,
  isCurrentlyValidEmail,
  onClose,
  onSubmit,
}) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <h3>
            RVU <span>SPORTS</span> LOGIN
          </h3>
          <button
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Close Login Modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="domain-requirement-banner">
            <span>🔒</span>
            <div>
              Restricted Access: <strong>@rvu.edu.in</strong> university emails only
            </div>
          </div>

          <div className="role-tabs">
            <button
              type="button"
              className={`tab-btn ${loginRole === 'student' ? 'active' : ''}`}
              onClick={() => { setLoginRole('student'); setLoginError(''); }}
            >
              Student / Player
            </button>
            <button
              type="button"
              className={`tab-btn ${loginRole === 'staff' ? 'active' : ''}`}
              onClick={() => { setLoginRole('staff'); setLoginError(''); }}
            >
              Coach / Faculty
            </button>
          </div>

          {loginError && (
            <div className="form-alert error" role="alert">
              <span>⚠️</span>
              <div>{loginError}</div>
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail">
                <span>University Email</span>
                {hasTypedEmail && (
                  <span className={`field-hint ${isCurrentlyValidEmail ? 'valid' : 'invalid'}`}>
                    {isCurrentlyValidEmail ? '✓ Valid @rvu.edu.in' : 'Must end with rvu.edu.in'}
                  </span>
                )}
              </label>
              <input
                id="loginEmail"
                type="email"
                placeholder="student@rvu.edu.in"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value)
                  if (loginError) setLoginError('')
                }}
                className={hasTypedEmail ? (isCurrentlyValidEmail ? 'input-success' : 'input-error') : ''}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value)
                  if (loginError) setLoginError('')
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-submit-login"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying Credentials...' : 'Sign In to RVU Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
