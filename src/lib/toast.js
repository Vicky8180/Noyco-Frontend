let toastRoot;

function ensureRoot() {
  if (!toastRoot) {
    toastRoot = document.createElement('div');
    toastRoot.id = 'toast-root';
    toastRoot.style.position = 'fixed';
    toastRoot.style.top = '1rem';
    toastRoot.style.right = '1rem';
    toastRoot.style.zIndex = '9999';
    document.body.appendChild(toastRoot);
  }
  return toastRoot;
}

export const showToast = (message, type = 'info', duration = 4000) => {
  const root = ensureRoot();
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.background = type === 'error' ? '#f56565' : '#2d3748';
  toast.style.color = '#fff';
  toast.style.padding = '8px 12px';
  toast.style.marginTop = '8px';
  toast.style.borderRadius = '4px';
  toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
  toast.style.fontSize = '14px';
  root.appendChild(toast);
  setTimeout(() => {
    toast.remove();
    if (!root.hasChildNodes()) {
      root.remove();
      toastRoot = null;
    }
  }, duration);
}; 