const express = require("express");
const prisma = require("../prisma");
const authenticateUser = require("../controller/authUser");

const router = express.Router();

const authenticateAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin){
    return res.status(403).send("Access denied");
  }
  next();
}

router.get("/admin", authenticateUser, authenticateAdmin, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: {createdAt: "desc"},
      include: { author: { select: { username: true } } },
    });

    res.render("posts", { posts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch posts", details: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: { select: { username: true } } },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.render("single-post", { post });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching post", details: error.message });
  }
});

router.post("/create", authenticateUser, async (req, res) => {
  const {title, content, published} = req.body;

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        published: published === "on",
        createdAt: new Date(),
        authorId: req.user.id,
      },
    });

    res.redirect("/auth/admin-dashboard");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating post", details: error.message });
  }
});

router.post("/edit/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content, published } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post || post.authorId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.post.update({
      where: { id: postId },
      data: { title, content, published: published === "on", updatedAt: new Date(), },
    });

    res.redirect("/posts/${postId");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating post", details: error.message });
  }
});

router.post("/delete/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const post = await prisma.post.findUnique({where: {id: postId}})
    if (!post || (post.authorId !== req.user.id && !req.user.isAdmin
    )) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.post.delete({ where: { id: postId } });
    res.redirect("/posts");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting post", details: error.message });
  }
});

module.exports = router;
