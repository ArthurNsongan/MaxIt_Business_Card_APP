import apiClient, { apiClientV2 } from "./client";

export const PATHS = {
    GET_ALL_ACTIVE_PLANS: '/api/subscription_plan/',
    SUBSCRIPTION_API: '/api/subscription/',
  };
  
  // Auth services
  const subscriptionService = {
    get_all_active_subscriptions_route: async () => {
        const response = await apiClient.get(PATHS.GET_ALL_ACTIVE_PLANS);
        return response.data;
    },
    post_subscription_route: async (subscription) => {
        const response = await apiClientV2.post(PATHS.SUBSCRIPTION_API, subscription);
        console.log("apiClientV2", response)
        return response;
    },
  };
  
  export default subscriptionService;