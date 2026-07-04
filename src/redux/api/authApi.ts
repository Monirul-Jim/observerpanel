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

export type TGetInstitutesParams = {
  search?: string;
  status?: string;
  layer_level?: string;
  layer_value?: string;
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
    getProfile: builder.query<TAuthUser, void>({
      query: () => "/observer/profile",
      transformResponse: (res: TProfileResponse) => res.payload.data.user,
      providesTags: ["AuthUser"],
    }),
    updateProfile: builder.mutation<
      { payload: { data: { user: TAuthUser } } },
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/observer/update-profile/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AuthUser"],
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
  useGetProfileQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
} = authApi;
