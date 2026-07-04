import type { Institute } from "@/types";
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
  }),
});

export const {
  useLoginUserMutation,
  useLogOutUserMutation,
  useGetInstituteInfoQuery,
} = authApi;
