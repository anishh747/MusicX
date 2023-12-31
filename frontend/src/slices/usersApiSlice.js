import { apiSlice } from "./apiSlice";
const USERS_URL = `${import.meta.env.VITE_REACT_API_URL}/api/users`;


export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            })
        }),
        logout: builder.mutation({
            query: () =>({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            })
        }),
        register: builder.mutation({
            query: (data) =>({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            })
        }),
        updatePassword: builder.mutation({
            query: (data) =>({
                url: `${USERS_URL}/update`,
                method: 'PUT',
                body: data,
            })
        })
    })
})

export const {useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdatePasswordMutation} = usersApiSlice;