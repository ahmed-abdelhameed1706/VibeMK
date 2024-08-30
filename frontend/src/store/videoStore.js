import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:5001/api";

axios.defaults.withCredentials = true;

export const useVideoStore = create((set, get) => ({
  video: null,
  userVideos: [],
  videoError: null,
  videoIsLoading: false,
  starredVideos: [],
  selectedUserVideos: [],

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
      set({ selectedUserVideos: res.data.videos, videoIsLoading: false });
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
  getVideo: async (videoId) => {
    set({ videoIsLoading: true, videoError: null });
    try {
      const res = await axios.get(`${API_URL}/video?videoId=${videoId}`);
      set({ video: res.data.video, videoIsLoading: false });
    } catch (error) {
      set({
        videoError: error.response.data.message || "Error Fetching Video",
        videoIsLoading: false,
      });
      throw error;
    }
  },
  deleteVideo: async (videoId) => {
    set({ videoIsLoading: true, videoError: null });
    try {
      await axios.delete(`${API_URL}/video/delete/${videoId}`);
      set({
        userVideos: get().userVideos.filter((video) => video._id !== videoId),
        videoIsLoading: false,
      });
    } catch (error) {
      set({
        videoError: error.response.data.message || "Error Deleting Video",
        videoIsLoading: false,
      });
      throw error;
    }
  },
  updateVideo: async (videoId, updatedUrl) => {
    set({ videoIsLoading: true, videoError: null });
    try {
      const response = await axios.put(`${API_URL}/video/update/${videoId}`, {
        updatedUrl,
      });
      const updatedVideo = response.data.video;

      // Get the current starred videos from state
      const { starredVideos } = get();
      const starredVideoIds = starredVideos.map((video) => video._id);

      set((state) => ({
        userVideos: state.userVideos.map((video) =>
          video._id === videoId
            ? {
                ...updatedVideo,
                starred: starredVideoIds.includes(videoId), // Preserve star status
                seenBy: video.seenBy, // Preserve seenBy
              }
            : video
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

  starVideo: async (videoId) => {
    set({ videoIsLoading: true, videoError: null });
    try {
      const response = await axios.put(`${API_URL}/video/star/${videoId}`);
      const starredVideos = response.data.starredVideos; // Full video objects

      set((state) => {
        // Extract starred video IDs
        const newStarredVideoIds = starredVideos.map((video) => video._id);

        return {
          starredVideos, // Store full video objects
          userVideos: state.userVideos.map((video) => ({
            ...video,
            starred: newStarredVideoIds.includes(video._id),
            seenBy: video.seenBy, // Update starred status
          })),
          videoIsLoading: false,
        };
      });
    } catch (error) {
      set({
        videoError: error.response?.data?.message || "Error Starring Video",
        videoIsLoading: false,
      });
      throw error;
    }
  },
  getStarredVideos: async () => {
    set({ videoIsLoading: true, videoError: null });
    try {
      const response = await axios.get(`${API_URL}/video/starred`);
      // Store full video objects
      const starredVideos = response.data.starredVideos;
      set((state) => ({
        starredVideos, // Update to store full video objects
        userVideos: state.userVideos.map((video) => ({
          ...video,
          starred: starredVideos.some(
            (starredVideo) => starredVideo._id === video._id
          ),
          seenBy: video.seenBy,
        })),
        videoIsLoading: false,
      }));
    } catch (error) {
      set({
        videoError:
          error.response?.data?.message || "Error Fetching Starred Videos",
        videoIsLoading: false,
      });
      throw error;
    }
  },

  getUserVideos: async (selectedUserId, groupId) => {
    set({ videoIsLoading: true, videoError: null });
    try {
      const response = await axios.get(`${API_URL}/video/user`, {
        params: { selectedUserId, groupId },
      });
      const { starredVideos } = get();
      const starredVideoIds = starredVideos.map((video) => video._id);
      set({
        userVideos: response.data.userVideos.map((video) => ({
          ...video,
          starred: starredVideoIds.includes(video._id),
          seenBy: video.seenBy,
        })),
        videoIsLoading: false,
      });
    } catch (error) {
      set({
        videoError:
          error.response?.data?.message || "Error Fetching User Videos",
        videoIsLoading: false,
      });
      throw error;
    }
  },
}));
