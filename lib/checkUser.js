import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No user found in Clerk.");
    return null;
  }

  try {
    console.log("Checking if user exists in DB...");
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      console.log("User already exists:", loggedInUser);
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    console.log("Creating a new user...");
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    console.log("User created successfully:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
