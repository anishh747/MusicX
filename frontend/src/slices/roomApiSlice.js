import { apiSlice } from "./apiSlice";
const ROOM_URL = 'http://localhost:5000/api/room';


export const roomApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        createRoom: builder.mutation({
            query: (data) => ({    
                url: `${ROOM_URL}/createRoom`,
                method: 'POST',
                body: data,
            })
        }),
        roomInfo: builder.mutation({
            query: (data) => ({    
                url: `${ROOM_URL}/roomInfo/${data}`,
                method: 'GET',
            })
        }),
        joinRoom: builder.mutation({
            query: (data) =>({
                url: `${ROOM_URL}/joinRoom`,
                method: 'POST',
                body: data,
            })
        }),
        inviteRoom: builder.mutation({
            query: (data) =>({
                url: `${ROOM_URL}/inviteRoom`,
                method: 'POST',
                body: data,
            })
        }),
        endRoom: builder.mutation({
            query:(data) =>({
                url: `${ROOM_URL}/endRoom`,
                method: 'DELETE',
                body: data,
            })
        }),
    })
})

export const {useCreateRoomMutation ,useEndRoomMutation, useInviteRoomMutation, useJoinRoomMutation, useRoomInfoMutation} = roomApiSlice;