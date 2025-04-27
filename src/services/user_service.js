import apiClient from "./client";

const PATHS = {
    CREATE: '/users/',
    UPLOAD_PROFILE_PHOTO: '/upload/profile',
    UPLOAD_COMPANY_LOGO: '/upload/logo',
    UPLOAD_COVER_IMAGE: '/upload/cover',
  };
  
  // Auth services
  const userService = {
    create_user_card_route: async (user_card) => {
        const response = await apiClient.post(PATHS.CREATE, user_card);
        return response.data;
    },
    get_user_card_route: async (phoneNumber) => {
        const response = await apiClient.get(PATHS.CREATE + phoneNumber , {});
        return response.data;
    },
    update_user_card_route: async (phoneNumber, user_card) => {
        const response = await apiClient.put(PATHS.CREATE + phoneNumber, user_card);
        return response.data;
    },
    upload_profile_photo: async (phoneNumber) => {
      const response = await apiClient.post(phoneNumber + PATHS.UPLOAD_PROFILE_PHOTO, {});
      return response.data;
    },
    upload_company_logo: async (phoneNumber) => {
        const response = await apiClient.post(phoneNumber + PATHS.UPLOAD_COMPANY_LOGO, {});
        return response.data;
    },
    upload_cover_image: async (phoneNumber) => {
        const response = await apiClient.post(phoneNumber + PATHS.UPLOAD_COVER_IMAGE, {});
        return response.data;
    }
  };
  
  export default userService;