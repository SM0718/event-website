
import {create} from 'zustand';

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  userInfo: null,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserInfo: (user) => set({ userInfo: user }),
  clearUserInfo: () => set({ userInfo: null, isLoggedIn: false }),
}));

