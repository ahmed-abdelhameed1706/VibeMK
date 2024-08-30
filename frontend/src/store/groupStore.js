import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:5001/api";

axios.defaults.withCredentials = true;

export const useGroupStore = create((set, get) => ({
  group: null,
  userGroups: [],
  groupMembers: [],
  error: null,
  joinGroupError: null,
  createGroupError: null,
  isLoading: false,
  message: null,
  newVideoUrl: "",
  selectedMember: null,
  defaultGroupCode: localStorage.getItem("defaultGroupCode") || "",
  defaultGroupName: localStorage.getItem("defaultGroupName") || "",

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
        createGroupError: error.response.data.message || "Error Creating Group",
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

  toggleDefaultGroup: async (groupCode) => {
    set({ isLoading: true, error: null });

    try {
      const currentDefaultGroupCode = get().defaultGroupCode;

      if (currentDefaultGroupCode === groupCode) {
        // Remove from local storage and Zustand store
        localStorage.removeItem("defaultGroupCode");
        localStorage.removeItem("defaultGroupName"); // Remove name as well
        set({ defaultGroupCode: "", defaultGroupName: "", isLoading: false });
      } else {
        // Set the group code and name to local storage and Zustand store
        const res = await axios.get(`${API_URL}/group/${groupCode}`);
        const groupName = res.data.group.name;

        localStorage.setItem("defaultGroupCode", groupCode);
        localStorage.setItem("defaultGroupName", groupName); // Store name as well

        set({
          defaultGroupCode: groupCode,
          defaultGroupName: groupName,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response.data.message || "Error Toggling Default Group",
        isLoading: false,
      });
      throw error;
    }
  },

  joinGroup: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/group/join`, { code });
      set({
        message: res.data.message,
        isLoading: false,
        group: res.data.group,
      });
    } catch (error) {
      set({
        joinGroupError: error.response.data.message || "Error Joining Group",
        isLoading: false,
      });
      throw error;
    }
  },

  leaveGroup: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/group/${groupId}/leave`);
      set((state) => ({
        userGroups: state.userGroups.filter((group) => group._id !== groupId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response.data.message || "Error Leaving Group",
        isLoading: false,
      });
      throw error;
    }
  },
  inviteToGroup: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/group/${code}/invite`, { email });
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Inviting to Group",
        isLoading: false,
      });
      throw error;
    }
  },
}));
