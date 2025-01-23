import { fetchPosts } from "./api";

const loadPosts = async () => {
  try {
    const posts = await fetchPosts();
    const postContainer = document.getElementById("posts");
    postContainer.innerHTML = "";

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <textarea placeholder="Add a comment"></textarea>
      <button class="add-comment-btn">Add comment</button>
      <hr/>
      `;
      postContainer.appendChild(postElement);

      const addCommentBtn = postElement.querySelector(".add-comment-btn");
      addCommentBtn.addEventListener("click", async () => {
        const comment = postElement.querySelector("textarea").value;
        console.log(`Comment for post ${post.id}: ${comment}`);
      });
    });
  } catch (error) {
    console.error("Error loading posts:", error);
  }
};

loadPosts();
