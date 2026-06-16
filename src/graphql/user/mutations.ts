import UserService, { type CreateUserPayload } from "../../services/userService.js";

export const mutations = {
    createUser: async (
        _: unknown,
        payload: CreateUserPayload
    ) => {
        await UserService.createUser(payload);
        return true;
    }
};