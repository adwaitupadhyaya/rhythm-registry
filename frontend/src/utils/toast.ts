type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'info', duration: number = 4000): void {
  const container = document.getElementById('toast-container');
  if (!container) {
    const newContainer = document.createElement('div');
    newContainer.id = 'toast-container';
    newContainer.className = 'toast-container';
    document.body.appendChild(newContainer);
  }

  const toastContainer = document.getElementById('toast-container')!;
  
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  
  toast.innerHTML = `
    <div class="toast__message">${escapeHtml(message)}</div>
    <button class="toast__close" aria-label="Close">✕</button>
  `;

  const closeBtn = toast.querySelector('.toast__close');
  closeBtn?.addEventListener('click', () => removeToast(toast));

  toastContainer.appendChild(toast);

  setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast: HTMLElement): void {
  toast.style.animation = 'slideOut 0.3s ease forwards';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    to {
      transform: translateX(120%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
