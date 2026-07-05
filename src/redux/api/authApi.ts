import type { Institute } from "@/types";
import { baseApi } from "./baseApi";

export type TAuthUser = {
  id: number;
  name: string;
  organization: string;
  designation: string;
  address: string;
  upazila: string;
  district: string;
  division: string;
  mobile: string;
  email: string;
  avatar?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type TInstitutesResponse = {
  payload: {
    data: {
      total: number;
      institutes: Institute[];
    };
  };
};

type TProfileResponse = {
  payload: {
    data: {
      status: string;
      user: TAuthUser;
    };
  };
};

type TInstituteDetailResponse = {
  payload: {
    data: Institute;
  };
};

export type TDayCollection = {
  date: string;
  amount: number;
};

export type TTransactionsData = {
  from: string;
  to: string;
  totalAmount: number;
  data: TDayCollection[];
};

type TTransactionsResponse = {
  payload: {
    data: TTransactionsData;
  };
};

export type TGetTransactionsParams = {
  id: number;
  from: string;
  to: string;
};

export type TGetInstitutesParams = {
  search?: string;
  status?: string;
  layer_level?: string;
  layer_value?: string;
};

export type TProfileChangeRequest = {
  id: number;
  observer_id: number;
  changes: Record<string, string>;
  original: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  reviewed_by: number | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

type TSubmitChangeRequestResponse = {
  payload: {
    data: {
      status: string;
      message: string;
      request: TProfileChangeRequest;
    };
  };
};

type TChangeRequestsResponse = {
  payload: {
    data: TProfileChangeRequest[];
  };
};

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/observer/login",
        method: "POST",
        body: data,
      }),
    }),
    logOutUser: builder.mutation<unknown, void>({
      query: () => ({
        url: "/observer/logout",
        method: "POST",
      }),
    }),
    getInstituteInfo: builder.query<Institute[], TGetInstitutesParams | void>({
      query: (params) => ({
        url: "/observer/institutes",
        params: params ?? undefined,
      }),
      transformResponse: (res: TInstitutesResponse) =>
        res.payload.data.institutes,
      providesTags: ["Institute"],
      keepUnusedDataFor: 300,
    }),
    getInstituteDetail: builder.query<Institute, number>({
      query: (id) => `/observer/institutes/${id}`,
      transformResponse: (res: TInstituteDetailResponse) => res.payload.data,
      providesTags: (_result, _error, id) => [{ type: "Institute", id }],
    }),
    getInstituteTransactions: builder.query<TTransactionsData, TGetTransactionsParams>({
      query: ({ id, from, to }) => ({
        url: `/observer/institutes/${id}/transactions`,
        params: { from, to },
      }),
      transformResponse: (res: TTransactionsResponse) => res.payload.data,
    }),
    getProfile: builder.query<TAuthUser, void>({
      query: () => "/observer/profile",
      transformResponse: (res: TProfileResponse) => res.payload.data.user,
      providesTags: ["AuthUser"],
    }),
    submitProfileChangeRequest: builder.mutation<
      { status: string; message: string; request: TProfileChangeRequest },
      FormData
    >({
      query: (formData) => ({
        url: "/observer/profile/change-request",
        method: "POST",
        body: formData,
      }),
      transformResponse: (res: TSubmitChangeRequestResponse) => res.payload.data,
      invalidatesTags: ["ProfileChangeRequest"],
    }),
    getProfileChangeRequests: builder.query<TProfileChangeRequest[], void>({
      query: () => "/observer/profile/change-requests",
      transformResponse: (res: TChangeRequestsResponse) => res.payload.data,
      providesTags: ["ProfileChangeRequest"],
    }),
    forgotPassword: builder.mutation<unknown, { email: string }>({
      query: ({ email }) => {
        const formData = new FormData();
        formData.append("email", email);
        return {
          url: "/observer/forgot-password",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLogOutUserMutation,
  useGetInstituteInfoQuery,
  useGetInstituteDetailQuery,
  useLazyGetInstituteTransactionsQuery,
  useGetProfileQuery,
  useSubmitProfileChangeRequestMutation,
  useLazyGetProfileChangeRequestsQuery,
  useForgotPasswordMutation,
} = authApi;
