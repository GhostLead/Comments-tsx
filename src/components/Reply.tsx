import React, { useState } from "react";
import "./styles.css"

interface User {
  image: { png: string; webp: string };
  username: string;
}

interface ReplyType {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  user: User;
}

interface ReplyProps {
  reply: ReplyType;
  currentUser: User;
  onDelete: () => void;
  onEdit: (newText: string) => void;
}

function Reply({ reply, currentUser, onDelete, onEdit }: ReplyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(editText);
      setIsEditing(false);
    }
  };

  const canEditOrDelete = currentUser.username === reply.user.username;

  return (
    <div className="reply">
      <div className="reply-header">
        <img src={reply.user.image.png} alt={reply.user.username} />
        <span className="username">{reply.user.username}</span>
        <span className="createdat">{reply.createdAt}</span>
      </div>

      {!isEditing ? (
        <p>
          <strong>@{reply.replyingTo} </strong>
          {reply.content}
        </p>
      ) : (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        ></textarea>
      )}

      <div className="reply-actions">
        {canEditOrDelete && (
          <>
            <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button className="delete-button" onClick={onDelete}>Delete</button>
          </>
        )}
      </div>

      {isEditing && (
        <button onClick={handleEdit} className="save-button">
          Save
        </button>
      )}
    </div>
  );
}

export default Reply;
