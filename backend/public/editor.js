import { fetchPosts, createPost, editPost, deletePost } from "./api.js";

const newPostForm = document.getElementById("new-post-form");
const postsList = document.getElementById("posts-list");

const loadEditorPosts = async () => {
  try {
    const posts = await fetchPosts();
    postsList.innerHTML = "";
  
    posts.forEach((post) => {
      const postElement = document.createElement("li");
      postElement.className = "post";
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <textarea>${post.content}</textarea>
        <button class="save-btn">Save</button>
        <button class="delete-btn">Delete</button>
        <hr/>
      `;
      postsList.appendChild(postElement);

      const saveBtn = postElement.querySelector(".save-btn");
      saveBtn.addEventListener("click", async () => {
        const updatedContent = postElement.querySelector("textarea").value;
        await editPost(post.id, updatedContent);
        alert("Post updated successfully!");
      });

      const deleteBtn = postElement.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", async () => {
        await deletePost(post.id);
        alert("Post deleted successfully!");
        loadEditorPosts();
      });
    });
  } catch (error) {
    console.error("Error loading editor posts:", error);
  }
};

newPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.querySelector("input").value.trim();
  const content = e.target.querySelector("textarea").value.trim();

  try {
    await createPost(title, content);
    alert("Post created successfully!");
    e.target.reset();
    loadEditorPosts();
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post")
  }
});

loadEditorPosts();
