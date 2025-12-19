import { ExecuteGet, ExecutePost } from "./ApiService"

const SubscriptionService = {
    async getSubscribers(id) {
        let response = await ExecuteGet(`subscriptions/c/${id}`)
        return response;
    },
    async toggleSubscription(id) {
        let response = await ExecutePost(`subscriptions/c/${id}`)
        return response;
    },
}

export default SubscriptionService