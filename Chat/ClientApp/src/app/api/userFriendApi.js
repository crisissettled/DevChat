import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userFriendApi = createApi({
    reducerPath:"userFriend",
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    tagTypes: ['userfriend'],
    endpoints: (build) => ({        
        getUserFriend: build.mutation({
            query: (body) => ({
                url: `/api/User/SearchFriend`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['userfriend'],
        }),
    }),
})

// Auto-generated hooks
export const { useGetUserFriendMutation } = userFriendApi

// Possible exports
export const { endpoints, reducerPath, reducer, middleware } = userFriendApi
// reducerPath, reducer, middleware are only used in store configuration
// endpoints will have:
// endpoints.getPosts.initiate(), endpoints.getPosts.select(), endpoints.getPosts.useQuery()
// endpoints.addPost.initiate(), endpoints.addPost.select(), endpoints.addPost.useMutation()
// see `createApi` overview for _all exports_