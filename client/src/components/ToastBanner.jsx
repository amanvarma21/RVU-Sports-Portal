function ToastBanner({ message, onDismiss }) {
  return (
    <div className="toast-banner" role="status" aria-live="polite">
      <p>{message}</p>
      <button className="toast-close-btn" onClick={onDismiss}>✕</button>
    </div>
  )
}

export default ToastBanner
