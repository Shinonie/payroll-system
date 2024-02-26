import { create } from 'zustand';

interface UserState {
    userId: string; // Add userId field
    email: string;
    fullname: string;
    setUserDetails: (userId: string, email: string, fullname: string) => void; // Modify setUserDetails function
}

export const useUserStore = create<UserState>((set) => {
    const storedUserDetails = localStorage.getItem('user');

    const initialState: UserState = storedUserDetails
        ? JSON.parse(storedUserDetails)
        : { userId: '', email: '', fullname: '' }; // Include userId in the initial state

    return {
        userId: initialState.userId,
        email: initialState.email,
        fullname: initialState.fullname,
        setUserDetails: (userId, email, fullname) => {
            set({ userId, email, fullname });
            localStorage.setItem('user', JSON.stringify({ userId, email, fullname }));
        }
    };
});
