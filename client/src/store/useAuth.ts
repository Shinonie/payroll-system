import { useAuthStore } from './useAuthStore';

export const useAuth = () => {
    const accessToken = useAuthStore((state) => state.accessToken);

    return { accessToken };
};
