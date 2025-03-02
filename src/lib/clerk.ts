import { currentUser } from "@clerk/nextjs/server";

export const getCurrentUser = async () => {
    const user = await currentUser();
    if (!user) throw Error("User not found");
    return user;
};
