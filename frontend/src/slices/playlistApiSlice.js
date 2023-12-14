import { apiSlice } from "./apiSlice";
const PLAYLIST_URL = `${import.meta.env.VITE_REACT_API_URL}/api/userplaylist`;


export const playlistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        createPlaylist: builder.mutation({
            query: (data) => ({    
                url: `${PLAYLIST_URL}/createplaylist`,
                method: 'POST',
                body: data,
            })
        }),
        getPlaylists: builder.mutation({
            query: (data) => ({    
                url: `${PLAYLIST_URL}/getPlaylists/${data}`,
                method: 'GET',
            })
        }),
        deletePlaylist: builder.mutation({
            query: (data) =>({
                url: `${PLAYLIST_URL}/deleteplaylist`,
                method: 'DELETE',
                body: data,
            })
        }),
        addSongToPlaylist: builder.mutation({
            query: (data) =>({
                url: `${PLAYLIST_URL}/addsongtoplaylist`,
                method: 'POST',
                body: data,
            })
        }),
        removeSongFromPlaylist: builder.mutation({
            query:(data) =>({
                url: `${PLAYLIST_URL}/removesongfromplaylist`,
                method: 'DELETE',
                body: data,
            })
        }),
        getPlaylistSongs: builder.mutation({
            query: (data) => ({    
                url: `${PLAYLIST_URL}/getplaylistsongs/${data}`,
                method: 'GET',
            })
        }),
    })
})

export const {useCreatePlaylistMutation ,useDeletePlaylistMutation, useGetPlaylistsMutation, useAddSongToPlaylistMutation, useRemoveSongFromPlaylistMutation, useGetPlaylistSongsMutation} = playlistApiSlice;