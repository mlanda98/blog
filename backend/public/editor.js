import { fetchPosts, createPost, editPost, deletePost } from "./api.js";

const loadEditorPosts = async () => {
  try {
    const posts = await fetchPosts();
    const editContainer = document.getElementById("edit-posts");
    editContainer.innerHTML = "";

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <textarea>${post.content}</textarea>
        <button class="save-btn">Save</button>
        <button class="delete-btn">Delete</button>
        <hr/>
      `;
      editContainer.appendChild(postElement);

      const saveBtn = postElement.querySelector(".save-btn");
      saveBtn.addEventListener("click", async () => {
        const updateContent = postElement.querySelector("textarea").value;
        await editPost(post.id, updateContent);
        alert("Post updated successfully!");
      });

      const deleteBtn = postElement.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", async () => {
        await deletePost(post.id);
        alert("Post deleted successfully!");
        postElement.remove();
      });
    });
  } catch (error) {
    console.error("Error loading editor posts:", error);
  }
};

const createPostForm = document.querySelector("#create-post form");
createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.querySelector("input").value;
  const content = e.target.querySelector("textarea").value;

  try {
    await createPost(title, content);
    alert("Post created successfully!");
    loadEditorPosts();
    e.target.reset();
  } catch (error) {
    console.error("Error creating post:", error);
  }
});

loadEditorPosts();
