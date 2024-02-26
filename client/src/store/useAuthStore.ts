import { create } from 'zustand';

interface AuthState {
    accessToken: string | null;
    userType: string | null;
}

interface AuthActions {
    setAccessToken: (accessToken: string | null) => void;
    setUserType: (userType: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    accessToken: localStorage.getItem('accessToken'),
    userType: localStorage.getItem('userType'),

    setAccessToken: (accessToken: string | null) => {
        set({ accessToken });
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        else localStorage.removeItem('accessToken');
    },

    setUserType: (userType: string | null) => {
        set({ userType });
        if (userType) localStorage.setItem('userType', userType);
        else localStorage.removeItem('userType');
    },

    clearAuth: () => {
        set({ accessToken: null, userType: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('user');
    }
}));
