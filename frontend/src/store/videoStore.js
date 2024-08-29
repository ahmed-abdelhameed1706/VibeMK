import { create } from "zustand";
import axios from "axios";

const API_URL = "/api";

axios.defaults.withCredentials = true;

export const useVideoStore = create((set) => ({
  video: null,
  userVideos: [],
  videoError: null,
  videoIsLoading: false,

  addVideo: async (url, groupId) => {
    set({ videoIsLoading: true, videoError: null });
    try {
      const res = await axios.post(`${API_URL}/video/add`, { url, groupId });
      set({ video: res.data.video, videoIsLoading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Adding Video",
        isLoading: false,
      });
      throw error;
    }
  },

  getVideosForUser: async (selectedUserId, groupId) => {
    set({ videoIsLoading: true, videoError: null });
    try {
      const res = await axios.get(`${API_URL}/video/user`, {
        params: { requestedUserId: selectedUserId, groupId },
      });
      set({ userVideos: res.data.videos, videoIsLoading: false });
    } catch (error) {
      set({
        videoError: error.response.data.message || "Error Fetching Videos",
        videoIsLoading: false,
      });
      throw error;
    }
  },
  updateSeenBy: async (videoId) => {
    set({ videoIsLoading: true, videoError: null });
    try {
      const response = await axios.put(`${API_URL}/video/seen`, { videoId });
      const updatedVideo = response.data.videoViewers;

      // Update the local state
      set((state) => ({
        userVideos: state.userVideos.map((video) =>
          video._id === videoId ? { ...video, seenBy: updatedVideo } : video
        ),
        videoIsLoading: false,
      }));
    } catch (error) {
      set({
        videoError: error.response.data.message || "Error Updating Video",
        videoIsLoading: false,
      });
      throw error;
    }
  },
}));
