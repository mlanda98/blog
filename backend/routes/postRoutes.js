const express = require("express");
const prisma = require("../prisma");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/", async (req, res) => {
  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    return res.status(400).json({ error: "Title, authorId, and content are required" });
  }

  try {
    const newPost = await prisma.post.create({
      data: { title, content, authorId },
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { content },
    });
    res.json(post);
  } catch (err) {
    res.status(404).json({ error: "Post not found" });
  }
});

router.delete("/:id", async (req, res) => {
  const {id}= req.params;

  try{
    await prisma.post.delete({
      where: {id: parseInt(id)},
    });
    res.status(204).send();
  } catch (err){
    res.status(404).json({error: "Posts not found"});
  }
})

module.exports = router;
