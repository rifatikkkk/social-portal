const { prisma } = require("../prisma/prisma.client");

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const { userId } = req.user;

    if (followingId === userId)
      return res
        .status(500)
        .json({ error: "You cannot subscribe to yourself!" });

    try {
      const existingSubscribe = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: userId }, { followingId }],
        },
      });

      if (existingSubscribe)
        return res.status(400).json({ error: "You are already subscribed!" });

      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } },
        },
      });

      res.status(201).json({ message: "Subscription successfully created!" });
    } catch (error) {
      console.error("Error in follow", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
  unfollowUser: async (req, res) => {
    const { followingId } = req.body;
    const { userId } = req.user;

    try {
      const follows = await prisma.follows.findFirst({
        where: { AND: [{ followerId: userId }, { followingId }] },
      });

      if (!follows)
        return res.status(404).json({ error: "You are not subscribed!" });

      await prisma.follows.delete({
        where: { id: follows.id },
      });

      res.status(201).json({ message: "You have successfully unsubscribed!" });
    } catch (error) {
      console.error("Error in unfollow", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
};

module.exports = FollowController;
