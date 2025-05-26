import apiClient from "./client";

export const PATHS = {
    GET_ALL_ACTIVE_PLANS: '/api/subscription_plan/',
  };
  
  // Auth services
  const subscriptionService = {
    get_all_active_subscriptions_route: async () => {
        const response = await apiClient.get(PATHS.GET_ALL_ACTIVE_PLANS);
        return response.data;
    }
  };
  
  export default subscriptionService;