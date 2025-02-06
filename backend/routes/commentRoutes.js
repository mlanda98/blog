const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const authenticateUser = require("../controller/authUser");

router.post("/", authenticateUser, async (req, res) => {
  const { content } = req.body;
  const { postId } = req.body;

  if (req.user.isAdmin) {
    return res.status(403).send("Admins are not allowed to comment");
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: req.user.id,
        authorName: req.user.username,
      },
    });
    res.redirect("/auth/viewers-dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ details: error.message });
  }
});

router.get("/edit/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).send("Comment not found");
    }
    res.render("edit-comment", { comment });
  } catch (error) {
    console.error(error);
  }
});

router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).send("Unauthorized to edit this comment");
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.redirect("viewers-dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error editing comment");
  }
});

router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (comment.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).send("Unauthorized to delete this comment");
    }

    await prisma.comment.delete({ where: { id: parseInt(id) } });

    if (req.user.isAdmin){
    res.redirect("/auth/admin-dashboard")
    } else {
      res.redirect("/auth/viewers-dashboard");
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting comment");
  }
});

module.exports = router;
