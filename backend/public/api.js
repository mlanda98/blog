import { getToken } from "./auth";

const API_URL = "http://localhost:3000";

export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch (error) {
    console.error("error decoding token:", error);
    return null;
  }
}
export const createPost = async (title, content) => {
  const authId = getUserIdFromToken();
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ title, content, authorId: authId }),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const editPost = async (id, content) => {
  const response = await fetch(`${API_URL}/${id}`, {
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
