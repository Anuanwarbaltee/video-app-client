import { ExecuteGet, ExecutePost } from "./ApiService"

const LikeService = {
    async getlikes(id) {
        let response = await ExecuteGet(`like/${id}`)
        return response;
    },
    async getCommentlikes(id) {
        let response = await ExecuteGet(`like/c/${id}`)
        return response;
    },
    async toggleLikes(id) {
        let response = await ExecutePost(`like/video/toggle/${id}`)
        return response;
    },

    async toggleCommentLikes(id) {
        let response = await ExecutePost(`like/comment/toggle/${id}`)
        return response;
    },

    async getLikedVideos(data) {
        let response = await ExecuteGet(`like/liked-videos/${data.id}?limit=${data.limit}&page=${data.page}`, data)
        return response;
    },
}

export default LikeService