
import { ExecuteGet, ExecutePatch, ExecutePost } from "../Services/ApiService"

export const UserService = {
    async logInUser(data) {
        let response = await ExecutePost("user/login", data)
        return response;
    },
    async LougOutUser() {
        let response = await ExecutePost("user/logout")
        return response;
    },
    async addWatchHistory(data) {
        let response = await ExecutePost("user/add-history", data)
        return response;
    },
    async geHistory(id) {
        let response = await ExecuteGet(`user/watch-history/${id}`)
        return response;
    },
    async getUserChannelProfile(user) {
        let response = await ExecuteGet(`user/user-profile/${user}`)
        return response;
    },

    async updateAvatar(user) {
        let response = await ExecutePatch(`user/update-avatar`, user, true)
        return response;
    },
    async updateCoverImage(user) {
        let response = await ExecutePatch(`user/update-coverImage`, user, true)
        return response;
    },
    async updateUserData(user) {
        let response = await ExecutePatch(`user/update-user`, user)
        return response;
    },

}