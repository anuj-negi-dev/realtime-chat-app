export interface UserType {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createAt: Date;
  updateAt: Date;
}

export type LoginType = {
  email: string;
  password: string;
};

export type RegisterType = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};
