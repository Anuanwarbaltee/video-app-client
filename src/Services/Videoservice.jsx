import { ExecuteGet, ExecutePost, ExecutePostForm } from "./ApiService"

export const Videoservice = {

    async UploadVideo(data) {
        let response = await ExecutePostForm(`video/upload-video`, data, true)
        return response;
    },

    async getVideoList(data) {
        let response = await ExecuteGet(`video/list?sortType=${data.sortType}&sortBy=${data.sortBy}&limit=${data.limit}&page=${data.page}&search=${data.search}`, data)
        return response;
    },
    async getVideo(id) {
        let response = await ExecuteGet(`video/${id}`)
        return response;
    },

    async incrementViews(id) {
        let response = await ExecutePost(`video/${id}/view`)
        return response;
    }

}