import { PROMOS_URL } from "../constants";
import { apiSlice } from "./api";

export const promosURLApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPromos: builder.query({
			query: () => ({
				url: PROMOS_URL
			}),
			providesTags: ["Promo"],
			keepUnusedDataFor: 5
		}),
		createPromo: builder.mutation({
			query: () => ({
				url: `${PROMOS_URL}`,
				method: "POST"
			}),
			invalidatesTags: ["Promo"]
		}),
		deletePromo: builder.mutation({
			query: (promoId) => ({
				url: `${PROMOS_URL}/${promoId}`,
				method: "DELETE"
			})
		}),
		getPromoDetails: builder.query({
			query: (promoId) => ({
				url: `${PROMOS_URL}/${promoId}`
			}),
			keepUnusedDataFor: 5
		}),
		updatePromo: builder.mutation({
			query: (data) => ({
				url: `${PROMOS_URL}/${data.promoId}`,
				method: "PUT",
				body: data
			}),
			invalidatesTags: ["Promo"]
		}),
		checkPromoCode: builder.mutation({
			query: (code) => ({
				url: `${PROMOS_URL}/check`,
				method: "POST",
				body: { code }
			})
		}),
		usePromoCode: builder.mutation({
			query: (code) => ({
				url: `${PROMOS_URL}/use`,
				method: "POST",
				body: { code }
			}),
			invalidatesTags: ["Promo"]
		})
	})
});

export const {
	useGetPromosQuery,
	useCreatePromoMutation,
	useDeletePromoMutation,
	useGetPromoDetailsQuery,
	useUpdatePromoMutation,
    useCheckPromoCodeMutation,
	useUsePromoCodeMutation
} = promosURLApiSlice;
