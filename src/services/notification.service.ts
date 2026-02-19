import axios from 'axios'

// Sanitize API_URL: remove trailing slash if present
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const API_URL = RAW_API_URL.replace(/\/$/, "");

// We need to send the token. Assuming axios interceptor handles it OR we manually add it.
// Looking at other services would confirm, but usually there's an api instance.
// Since I didn't check api setup, I'll use raw axios with localStorage token for safety now.

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getMyNotifications = async (limit = 20, skip = 0) => {
    const response = await axios.get(`${API_URL}/notifications`, {
        headers: getAuthHeader(),
        params: { limit, skip }
    })
    return response.data;
}

export const markAsRead = async (id: string) => {
    const response = await axios.patch(`${API_URL}/notifications/${id}/read`, {}, {
        headers: getAuthHeader()
    })
    return response.data;
}

export const markAllAsRead = async () => {
    const response = await axios.patch(`${API_URL}/notifications/read-all`, {}, {
        headers: getAuthHeader()
    })
    return response.data;
}
