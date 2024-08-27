import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

axios.defaults.withCredentials = true;

export const useGroupStore = create((set) => ({
  group: null,
  userGroups: [],
  groupMembers: [],
  error: null,
  isLoading: false,
  message: null,
  newVideoUrl: "",
  selectedMember: null,
  isDefaultGroup: false,

  createGroup: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/group`, { name });
      set({
        group: res.data.group,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Creating Group",
        isLoading: false,
      });
      throw error;
    }
  },

  getGroup: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/group/${code}`);
      set({
        group: res.data.group,
        isLoading: false,
        groupMembers: res.data.group.members,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Fetching Group",
        isLoading: false,
      });
      throw error;
    }
  },

  getGroupsForUser: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/group`);
      set({ userGroups: res.data.groups, isLoading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Fetching Groups",
        isLoading: false,
      });
      throw error;
    }
  },
}));
