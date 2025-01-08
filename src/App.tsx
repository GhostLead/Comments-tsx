import React, { useEffect, useState } from "react";
import Comment from "./components/Comment";
import DeleteConfirmation from "./components/DeleteConfirmation";

interface User {
  image: { png: string; webp: string };
  username: string;
}

interface Reply {
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
  replies: Reply[];
}

function App() {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    commentId: number;
    isReply: boolean;
    replyId?: number;
  } | null>(null);

  // Fetch data.json when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json"); // Adjust the path if necessary
        const data = await response.json();
        setComments(data.comments);
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleReply = (commentId: number, replyText: string) => {
    if (!currentUser) return;

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        comment.replies.push({
          id: Math.random(),
          content: replyText,
          createdAt: "just now",
          score: 0,
          replyingTo: comment.user.username,
          user: currentUser,
        });
      }
      return comment;
    });

    setComments(updatedComments);
  };

  const handleDelete = (commentId: number, isReply: boolean, replyId?: number) => {
    setShowDeleteModal(true);
    setDeleteTarget({ commentId, isReply, replyId });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      const { commentId, isReply, replyId } = deleteTarget;

      if (isReply) {
        // Handle deleting a reply
        const updatedComments = comments.map((comment) => {
          if (comment.replies.some((reply) => reply.id === replyId)) {
            comment.replies = comment.replies.filter((reply) => reply.id !== replyId);
          }
          return comment;
        });
        setComments(updatedComments);
      } else {
        // Handle deleting a comment
        const updatedComments = comments.filter((comment) => comment.id !== commentId);
        setComments(updatedComments);
      }

      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleEdit = (commentId: number, isReply: boolean, newText: string, replyId?: number) => {
    if (isReply) {
      // Handle editing a reply
      const updatedComments = comments.map((comment) => {
        if (comment.replies.some((reply) => reply.id === replyId)) {
          comment.replies = comment.replies.map((reply) =>
            reply.id === replyId ? { ...reply, content: newText } : reply
          );
        }
        return comment;
      });
      setComments(updatedComments);
    } else {
      // Handle editing a comment
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, content: newText } : comment
      );
      setComments(updatedComments);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>; // Display a loading message until data is fetched
  }

  return (
    <div className="app">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          onReply={handleReply}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}

      {showDeleteModal && (
        <DeleteConfirmation onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
}

export default App;
