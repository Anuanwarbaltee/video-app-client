import { data } from "react-router-dom";
import { ExecuteGet, ExecutePost, ExecutePostForm, ExecutePatch } from "./ApiService"

export const Videoservice = {

    async UploadVideo(data) {
        let response = await ExecutePostForm(`video/upload-video`, data, true)
        return response;
    },

    async getVideoList(data) {
        let response = await ExecuteGet(`video/list?sortType=${data.sortType}&sortBy=${data.sortBy}&limit=${data.limit}&page=${data.page}&search=${data.search}`, data)
        return response;
    },

    async getVideo(data) {
        let response = await ExecuteGet(`video/${data.id}?userId=${data.userId}`)
        return response;
    },


    async getChanalVideos(data) {
        let response = await ExecuteGet(`video?id=${data.id}&page=${data.page}&limit=${data.limit}&search=${data.search}`)
        return response;
    },

    async incrementViews(id) {
        let response = await ExecutePost(`video/${id}/view`)
        return response;
    },

    async updateVideoFile(data) {
        let response = await ExecutePatch(`video/update-videofile`, data, true)
        return response;
    },

    async updateThumbnail(data) {
        let response = await ExecutePatch(`video/update-thumbnail`, data, true)
        return response;
    },

    async updateVideoMeta(data) {
        let response = await ExecutePatch(`video/update-video`, data)
        return response;
    }

}

