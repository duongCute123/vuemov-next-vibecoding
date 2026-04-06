import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getFavorites, addFavorite as addFavoriteApi, removeFavorite as removeFavoriteApi, 
  checkFavorite as checkFavoriteApi,
  getHistory, addHistory as addHistoryApi, removeHistory as removeHistoryApi, clearHistory as clearHistoryApi,
  getComments, addComment as addCommentApi, deleteComment as deleteCommentApi
} from '../api-service';

interface Comment {
  id: string;
  slug: string;
  userId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface MoviesState {
  favorites: string[];
  history: Array<{ slug: string; watchedAt: string }>;
  comments: Record<string, Comment[]>;
  loadingFavorites: boolean;
  loadingHistory: boolean;
  loadingComments: boolean;
}

const initialState: MoviesState = {
  favorites: [],
  history: [],
  comments: {},
  loadingFavorites: false,
  loadingHistory: false,
  loadingComments: false,
};

export const fetchFavorites = createAsyncThunk('movies/fetchFavorites', async () => {
  return await getFavorites();
});

export const addFavorite = createAsyncThunk('movies/addFavorite', async (slug: string) => {
  await addFavoriteApi(slug);
  return slug;
});

export const removeFavorite = createAsyncThunk('movies/removeFavorite', async (slug: string) => {
  await removeFavoriteApi(slug);
  return slug;
});

export const checkFavorite = createAsyncThunk('movies/checkFavorite', async (slug: string) => {
  const isFavorite = await checkFavoriteApi(slug);
  return { slug, isFavorite };
});

export const fetchHistory = createAsyncThunk('movies/fetchHistory', async () => {
  return await getHistory();
});

export const addHistory = createAsyncThunk('movies/addHistory', async (slug: string) => {
  await addHistoryApi(slug);
  return slug;
});

export const removeHistory = createAsyncThunk('movies/removeHistory', async (slug: string) => {
  await removeHistoryApi(slug);
  return slug;
});

export const clearHistory = createAsyncThunk('movies/clearHistory', async () => {
  await clearHistoryApi();
});

export const fetchComments = createAsyncThunk('movies/fetchComments', async (slug: string) => {
  const comments = await getComments(slug);
  return { slug, comments };
});

export const addComment = createAsyncThunk(
  'movies/addComment',
  async ({ slug, content, rating }: { slug: string; content: string; rating: number }) => {
    const comment = await addCommentApi(slug, content, rating);
    return { slug, comment };
  }
);

export const deleteComment = createAsyncThunk(
  'movies/deleteComment',
  async ({ commentId, slug }: { commentId: string; slug: string }) => {
    await deleteCommentApi(commentId, slug);
    return { commentId, slug };
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loadingFavorites = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loadingFavorites = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.loadingFavorites = false;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (!state.favorites.includes(action.payload)) {
          state.favorites.push(action.payload);
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(f => f !== action.payload);
      })
      .addCase(fetchHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state) => {
        state.loadingHistory = false;
      })
      .addCase(addHistory.fulfilled, (state, action) => {
        const existing = state.history.find(h => h.slug === action.payload);
        if (!existing) {
          state.history.unshift({ slug: action.payload, watchedAt: new Date().toISOString() });
        } else {
          existing.watchedAt = new Date().toISOString();
        }
      })
      .addCase(removeHistory.fulfilled, (state, action) => {
        state.history = state.history.filter(h => h.slug !== action.payload);
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.history = [];
      })
      .addCase(fetchComments.pending, (state) => {
        state.loadingComments = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loadingComments = false;
        state.comments[action.payload.slug] = action.payload.comments;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.loadingComments = false;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (action.payload.comment && state.comments[action.payload.slug]) {
          state.comments[action.payload.slug].unshift(action.payload.comment);
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        if (state.comments[action.payload.slug]) {
          state.comments[action.payload.slug] = state.comments[action.payload.slug].filter(
            c => c.id !== action.payload.commentId
          );
        }
      });
  },
});

export const { clearComments } = moviesSlice.actions;
export default moviesSlice.reducer;