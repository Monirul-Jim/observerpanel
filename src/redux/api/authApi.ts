import type { Institute } from "@/types";
import type { TAuthUser } from "../feature/authSlice";
import { baseApi } from "./baseApi";

type TInstitutesResponse = {
  payload: {
    data: {
      total: number;
      institutes: Institute[];
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
    updateProfile: builder.mutation<
      { payload: { data: { user: TAuthUser } } },
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/observer/update-profile/${id}`,
        method: "POST",
        body: formData,
      }),
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
  useUpdateProfileMutation,
  useForgotPasswordMutation,
} = authApi;
