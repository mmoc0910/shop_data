import { Dayjs } from "dayjs";
import { AuthState } from "../store/auth/authSlice";

export type CoutryType = "en" | "vi" | "ci";

export type LocationType = {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export type RoseExtendType = {
  _id: string;
  level1: number;
  level2: number;
  level3: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export interface UserState {
  canMigrate: boolean;
  level: number;
  email: string;
  role: 1 | 2;
  phone: string;
  country: string;
  purpose: number;
  money: number;
  transaction: number;
  cash: number;
  _id: string;
  introduceCode: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export type ServerType = {
  _id: string;
  remark?: string;
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
  defaultBandWidth: number;
  totalBandWidth: number;
  numberKey: number;
  __v: 0;
  listKeys?: KeySeverType[];
  isConnectKuma: 0 | 1;
  cloudManagerId: string;
};

type AWSType = {
  _id: string;
  awsId: string;
  fileName: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
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
  serverId: ServerType | string;
  awsId: AWSType;
  userId: AuthState;
  account: string;
  startDate: Date;
  endDate: Date;
  status: 1 | 0 | 2;
  dataExpand: number;
  endExpandDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  realtimeDataUsage: number;
  __v: 0;
};

export type PlanType = {
  key: string;
  _id: string;
  name: string;
  price: number;
  type: string;
  description: string[];
  day: number;
  bandWidth: number;
  createdAt: Date;
  updatedAt: Date;
  numberPurchase: number;
  display: 0 | 1;
  status: 0 | 1;
  enable: 0 | 1; // 1:enable - 0: disable
};

export type CashType = {
  _id: string;
  userId: UserState;
  money: number;
  approve: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 0 | 1 | 2;
  description: string;
  type: 0 | 1;
  content?: string;
  code: string;
  //2:pending, 1:approve, 0:reject
  __v: 0;
};

export type GistType = {
  _id: string;
  code: string;
  gistId: string;
  userId: AuthState;
  planId: PlanType;
  keyId: KeySeverType;
  fileName: string;
  extension: string;
  status: 0 | 1 | 2;
  money: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export type TransactionType = {
  _id: string;
  code: string;
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
  reciveRoseId: UserState;
  introducedId: UserState;
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
  level1: number;
  level2: number;
  level3: number;
  createdAt: Date;
  updatedAt: Date;
  status: 0 | 1;
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
  discount: [
    {
      _id: null;
      totalAdjustedMoney: number;
    }
  ];
  currentMoney: number;
  numberIntoduce: number;
};
export type CommisionType = {
  _id: string;
  value: number;
  min: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};
export type CollabType = {
  level1: number;
  level2: number;
  level3: number;
  minLevel1: number;
  minLevel2: number;
  minLevel3: number;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type KeyDetailType = {
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
  dataExpand: number;
  serverId: ServerType;
  userId: string;
  awsId: AWSType;
  account: string;
  startDate: Dayjs;
  endDate: Dayjs;
  status: 0 | 1 | 2;
  historyKey: KeySeverType[];
  createdAt: Dayjs;
  updatedAt: Dayjs;
  __v: 0;
  gist: GistType;
  arrayDataUsage?: number[];
  migrateDate?: Date;
  endExpandDate?: Date;
};

export type CloudManagerType = {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 0 | 1;
  cloudId: string;
  providerId: string;
  key: string;
  price: number;
  remark: string;
  isDelete: 1 | 0;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
  remain: number;
  server: number;
  dieDate?: Date | Dayjs;
  live: number;
  valid: number;
};

export type NewCashType = {
  _id: string;
  code: string;
  userId: string;
  money: number;
  content: string;
  status: 1 | 0 | 2;
  type: 1 | 0;
  description: string;
  createByAdmin: 1;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
  user: [UserState];
};

export type BuyPlanTodayType = {
  _id: string;
  code: string;
  userId: string;
  gistId: string;
  planId: string;
  description: string;
  amount: number;
  discount: number;
  money: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
  user: [UserState];
  plan: [PlanType];
  extendPlan: [ExtendPlanType];
};

export type KeyExpriredTodayType = {
  _id: string;
  keyId: string;
  name: string;
  password: string;
  port: string;
  method: string;
  accessUrl: string;
  enable: boolean;
  enableByAdmin: boolean;
  dataLimit: number;
  dataUsageYesterday: number;
  dataUsage: number;
  arrayDataUsage: number[];
  dataExpand: number;
  serverId: string;
  userId: string;
  awsId: string;
  account: string;
  startDate: string;
  endDate: string;
  status: 1 | 0 | 2;
  createDate: Date;
  migrateDate: Date;
  counterMigrate: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
  server: [ServerType];
  user: [UserState];
  aws: [
    {
      _id: string;
      awsId: string;
      fileName: string;
      status: number;
      createdAt: Date;
      updatedAt: Date;
      __v: 0;
    }
  ];
};

export type HistoryExpandKeyType = {
  _id: string;
  code: string;
  userId: AuthState;
  gistId: GistType;
  extendPlanId: ExtendPlanType;
  description: string;
  amount: number;
  discount: number;
  money: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};
export type HistoryUpgradeKeyType = {
  _id: string;
  code: string;
  userId: UserState;
  gistId: GistType;
  planId: PlanType;
  description: string;
  amount: number;
  discount: number;
  money: number;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};
