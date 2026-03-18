
export interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: { name: string };
  isActive: boolean;
  createdAt: string;
}

export interface DeleteModalProps {
  isDark: boolean;
  user: StaffUser;
  onClose: () => void;
  onSuccess: () => void;
}


export interface AddUserModalProps {
  isDark: boolean;
  role:string | undefined;
  onClose: () => void;
  onSuccess: () => void;
}

export interface UserStats {
  total:number,
  inactive:number,
  active:number
}


