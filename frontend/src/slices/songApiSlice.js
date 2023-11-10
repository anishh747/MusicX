import { apiSlice } from "./apiSlice";
const MUSIC_URL = 'http://localhost:5000/api/music';


export const songsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        homePageData: builder.mutation({
            query: (data) => ({    
                url: `${MUSIC_URL}/home`,
                method: 'POST',
                body: data,
            })
        }),
        songData: builder.mutation({
            query: (data) =>({
                url: `${MUSIC_URL}/songs`,
                method: 'POST',
                body: data,
            })
        }),
        playlistData: builder.mutation({
            query: (data) =>({
                url: `${MUSIC_URL}/playlists`,
                method: 'POST',
                body: data,
            })
        }),
        albumsData: builder.mutation({
            query:(data) =>({
                url: `${MUSIC_URL}/albums`,
                method: 'POST',
                body: data,
            })
        }),
        searchQueryData: builder.mutation({
            query:(data) =>({
                url: `${MUSIC_URL}/albums`,
                method: 'POST',
                body: data,
            })
        }),
        artistData: builder.mutation({
            query:(data=>({
                url: `${MUSIC_URL}/artist`,
                method: 'POST',
                body: data
            }))
        })
    })
})

export const {useHomePageDataMutation ,useSongDataMutation, usePlaylistDataMutation, useAlbumsDataMutation, useSearchQueryDataMutation, useArtistDataMutation} = songsApiSlice;