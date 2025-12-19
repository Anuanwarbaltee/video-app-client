import { ExecutePatch, ExecutePost, ExecuteDelete } from "./ApiService"

const CommentService = {
    async addcomment(data) {
        let response = await ExecutePost("comment/", data)
        return response;
    },
    async getCommentList(data) {
        let response = await ExecutePost("comment/list/", data)
        return response;
    },

    async updateComment(data) {
        let response = await ExecutePatch(`comment/update/${data.commentId}`, data)
        return response;
    },

    async deleteComment(data) {
        let response = await ExecuteDelete(`comment/delete/${data.commentId}`)
        return response;
    }
}

export default CommentService