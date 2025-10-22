import {create} from 'zustand';

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}

interface UserState {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (email: string) => void;
}

export const useUserStore = create<UserState>((set) => {
    return {
        users: [],
        setUsers: (users) => set({users}),
        addUser: (user) => set((state) => ({users: [...state.users, user]})),
        removeUser: (email) => set((state) => ({users: state.users.filter(user => user.email !== email)}))
    }
})