import React from 'react';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger' 
}) => {
  if (!isOpen) return null;

  const getButtonStyle = (isConfirm = false) => {
    const baseStyle = {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.3s ease',
    };

    if (isConfirm) {
      return {
        ...baseStyle,
        backgroundColor: type === 'danger' ? '#e74c3c' : '#3498db',
        color: '#fff',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: '#95a5a6',
      color: '#fff',
    };
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          color: '#2c3e50',
          fontSize: '18px',
          fontWeight: '600',
        }}>
          {title}
        </h3>
        
        <p style={{
          margin: '0 0 24px 0',
          color: '#7f8c8d',
          lineHeight: '1.5',
        }}>
          {message}
        </p>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onCancel}
            style={getButtonStyle(false)}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={getButtonStyle(true)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 