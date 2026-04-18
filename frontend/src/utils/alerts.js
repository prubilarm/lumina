import Swal from 'sweetalert2';

const commonConfig = {
  background: '#ffffff',
  color: '#0f172a',
  customClass: {
    popup: 'alert-popup',
    title: 'alert-title',
    confirmButton: 'alert-confirm-btn',
    cancelButton: 'alert-cancel-btn'
  }
};

export const alerts = {
  success: (title, text) => {
    return Swal.fire({
      ...commonConfig,
      icon: 'success',
      title,
      text,
      timer: 2000,
      showConfirmButton: false,
      iconColor: '#10b981',
    });
  },
  error: (title, text) => {
    return Swal.fire({
      ...commonConfig,
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#1e3a8a',
      iconColor: '#ef4444',
    });
  },
  loading: (title) => {
    Swal.fire({
      ...commonConfig,
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },
  close: () => {
    Swal.close();
  },
  confirm: (title, text, confirmText = 'Sí, continuar') => {
    return Swal.fire({
      ...commonConfig,
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e3a8a',
      cancelButtonColor: '#64748b',
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar',
      iconColor: '#f59e0b',
    });
  }
};
