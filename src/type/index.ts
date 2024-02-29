import { AuthState } from "../store/auth/authSlice";

export type ServerType = {
  _id: string;
  serverId: string;
  location: string;
  apiUrl: string;
  fingerPrint: string;
  name: string;
  metricsEnabled: boolean;
  createdTimestampMs: number;
  version: string;
  portForNewAccessKeys: number;
  hostnameForAccessKeys: string;
  numberRecomendKey: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
  listKeys?: KeySeverType[];
};

export type KeySeverType = {
  _id: string;
  keyId: string;
  name: string;
  password: string;
  port: number;
  method: string;
  accessUrl: string;
  enable: boolean;
  dataLimit: number;
  dataUsage: number;
  serverId: ServerType;
  userId: AuthState;
  account: string;
  startDate: Date;
  endDate: Date;
  status: 1 | 0;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export type PlanType = {
  _id: string;
  name: string;
  price: number;
  type: string;
  description: string[];
  day: number;
  bandWidth: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CashType = {
  _id: string;
  userId: AuthState;
  money: number;
  approve: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 0 | 1 | 2;
  description: string;
  //2:pending, 1:approve, 0:reject
  __v: 0;
};

export type GistType = {
  _id: string;
  gistId: string;
  userId: AuthState;
  planId: PlanType;
  keyId: KeySeverType;
  fileName: string;
  extension: string;
  status: number;
  money: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export type TransactionType = {
  _id: string;
  userId: AuthState;
  gistId: GistType;
  planId?: PlanType;
  extendPlanId?: ExtendPlanType;
  description: string;
  amount: number;
  money: number;
  createdAt: Date;
  updatedAt: Date;
  discount: number;
  __v: 0;
};

export type RoseType = {
  _id: string;
  reciveRoseId: AuthState;
  introducedId: AuthState;
  plan: string;
  price: number;
  percent: number;
  recive: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export type ExtendPlanType = {
  _id: string;
  name: string;
  price: number;
  bandWidth: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export type SatisfyType = {
  cash: [
    {
      _id: string;
      money: number;
    }
  ];
  rose: [
    {
      _id: string;
      money: number;
    }
  ];
  transaction: [
    {
      _id: string;
      money: number;
    }
  ];
  currentMoney: number;
  numberIntoduce: number;
};
export type CommisionType = {
  _id: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};
export type CollabType = {
  level1: number;
  level2: number;
  level3: number;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
