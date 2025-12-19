
import { ExecuteGet, ExecutePost } from "../Services/ApiService"

export const UserService = {
    async logInUser(data) {
        let response = await ExecutePost("user/login", data)
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

}