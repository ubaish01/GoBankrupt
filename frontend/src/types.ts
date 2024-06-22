export type userType = {
  name: string;
  _id: string;
  email?: string;
  email_verified?: boolean;
  role: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  last_activity: Date;
} | null;

export type walletType = {
  balance: number;
  _id: string;
};
