import React from "react";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation-box">
        <h3>Delete Comment</h3>
        <p>
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </p>
        <div className="delete-confirmation-actions">
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-button">
            I'm Sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
