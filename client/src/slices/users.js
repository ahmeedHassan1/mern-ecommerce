import { USERS_URL } from "../constants";
import { apiSlice } from "./api";

export const usersURLApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/auth`,
				method: "POST",
				body: data
			})
		}),
		register: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}`,
				method: "POST",
				body: data
			})
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: "POST"
			})
		}),
		profile: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/profile`,
				method: "PUT",
				body: data
			})
		}),
		getUsers: builder.query({
			query: () => ({
				url: USERS_URL
			}),
			providesTags: ["Users"],
			keepUnusedDataFor: 5
		}),
		deleteUser: builder.mutation({
			query: (userId) => ({
				url: `${USERS_URL}/${userId}`,
				method: "DELETE"
			})
		}),
		getUserDetails: builder.query({
			query: (userId) => ({
				url: `${USERS_URL}/${userId}`
			}),
			keepUnusedDataFor: 5
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/${data.userId}`,
				method: "PUT",
				body: data
			}),
			invalidatesTags: ["Users"]
		}),
		searchUsers: builder.query({
			query: ({ query = "", limit = 10 }) => ({
				url: `${USERS_URL}/search`,
				params: { query, limit }
			}),
			keepUnusedDataFor: 5
		}),
		getUsersByIds: builder.mutation({
			query: (userIds) => ({
				url: `${USERS_URL}/by-ids`,
				method: "POST",
				body: { userIds }
			})
		})
	})
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useProfileMutation,
	useGetUsersQuery,
	useDeleteUserMutation,
	useGetUserDetailsQuery,
	useUpdateUserMutation,
	useSearchUsersQuery,
	useGetUsersByIdsMutation
} = usersURLApiSlice;
