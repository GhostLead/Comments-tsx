import React, { useState } from "react";
import Reply from "./Reply";

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

interface CommentType {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: ReplyType[];
}

interface CommentProps {
  comment: CommentType;
  currentUser: User;
  onReply: (commentId: number, replyText: string) => void;
  onDelete: (commentId: number, isReply: boolean, replyId?: number) => void;
  onEdit: (commentId: number, isReply: boolean, newText: string, replyId?: number) => void;
}

function Comment({ comment, currentUser, onReply, onDelete, onEdit }: CommentProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyBox(false);
    }
  };

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(comment.id, false, editText);
      setIsEditing(false);
    }
  };

  const canEditOrDelete = currentUser.username === comment.user.username;

  return (
    <div className="comment">
      <div className="comment-header">
        <img src={comment.user.image.png} alt={comment.user.username} />
        <span>{comment.user.username}</span>
        <span>{comment.createdAt}</span>
      </div>

      {!isEditing ? (
        <p>{comment.content}</p>
      ) : (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        ></textarea>
      )}

      <div className="comment-actions">
        <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>
        {canEditOrDelete && (
          <>
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button onClick={() => onDelete(comment.id, false)}>Delete</button>
          </>
        )}
      </div>

      {isEditing && (
        <button onClick={handleEdit} className="save-button">
          Save
        </button>
      )}

      {showReplyBox && (
        <div className="reply-box">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          ></textarea>
          <button onClick={handleReply}>Send</button>
        </div>
      )}

      <div className="replies">
        {comment.replies.map((reply) => (
          <Reply
            key={reply.id}
            reply={reply}
            currentUser={currentUser}
            onDelete={() => onDelete(comment.id, true, reply.id)}
            onEdit={(newText: string) => onEdit(comment.id, true, newText, reply.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Comment;
