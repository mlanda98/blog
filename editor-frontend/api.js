import { getToken } from "../viewer-frontend/auth";

const API_URL = "http://localhost:3000";

export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

export const createPost = async (title, content) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const editPost = async (title, content) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Failed to update post");
  return response.json();
};

export const deletePost = async (id) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete post");
  return response.json();
};
