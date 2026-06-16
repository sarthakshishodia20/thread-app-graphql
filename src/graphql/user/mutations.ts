import { prismaClient } from "../../lib/db.js";

export const mutations = {
    createUser: async (
        _: unknown,
        { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }
    ) => {
        await prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                salt: "randomSALT",
            }
        });
        return true;
    }
};