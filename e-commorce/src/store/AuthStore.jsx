// store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: '',
      refreshToken: '',
      email: '',
      name: '',
      status: '',
      uid: '',
      role: '',
      employeeRef: '',

      // Set login data
      setLoginData: (data) => set(() => ({
        token: data.token,
        refreshToken: data.refreshToken,
        email: data.email,
        name: data.name,
        status: data.status,
        uid: data.uid,
        role: data.role || '',
        employeeRef: data.EmployeeRef || '',
      })),

      // Clear login data
      logout: () => set(() => ({
        token: '',
        refreshToken: '',
        email: '',
        name: '',
        status: '',
        uid: '',
        role: '',
        employeeRef: '',
      })),
    }),

    {
      name: "auth-storage",  // key for localStorage
       getStorage: () => localStorage, 
    }

  )
);

export default useAuthStore;
