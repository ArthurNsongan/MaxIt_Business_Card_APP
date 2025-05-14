import apiClient from "./client";

export const PATHS = {
    CREATE: '/api/cards/',
    UPLOAD_PROFILE_PHOTO: '/api/cards/{phoneNumber}/upload/profile',
    UPLOAD_COMPANY_LOGO: '/api/cards/{phoneNumber}/upload/logo',
    UPLOAD_COVER_IMAGE: '/api/cards/{phoneNumber}/upload/cover',
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
    upload_profile_photo: async (phoneNumber, formData) => {
      const response = await apiClient.post(PATHS.UPLOAD_PROFILE_PHOTO.replace("{phoneNumber}",phoneNumber), formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
      });
      return response.data;
    },
    upload_company_logo: async (phoneNumber,formData) => {
        const response = await apiClient.post(PATHS.UPLOAD_COMPANY_LOGO.replace("{phoneNumber}",phoneNumber), formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    },
    upload_cover_image: async (phoneNumber,formData) => {
        const response = await apiClient.post(PATHS.UPLOAD_COVER_IMAGE.replace("{phoneNumber}",phoneNumber), formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    }
  };
  
  export default userService;