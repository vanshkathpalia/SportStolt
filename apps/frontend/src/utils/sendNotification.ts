import axios from 'axios';
import { BACKEND_URL } from '../config'; // Adjust path as needed

export const sendFollowNotification = async (receiverId: number) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await axios.post(`${BACKEND_URL}/api/v1/notification/send-all`, {
      type: 'FOLLOW',
      receiverId,
      message: 'started following you!',
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Failed to send follow notification:', err);
  }
};
