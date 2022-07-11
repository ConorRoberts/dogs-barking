import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Auth } from "aws-amplify";
import User from "@typedefs/User";
import axios from "axios";

/**
 * @description Signs the user in
 */
export const signIn = createAsyncThunk("auth/signIn", async () => {
  try {
    const { attributes } = await Auth.currentAuthenticatedUser();
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();

    try {
      // Find user in Neo4j. Throw error if we can't find the user
      const { data } = await axios.get(`/api/user/`, { headers: { Authorization: `Bearer ${token}` } });

      return { ...attributes, ...data, token };
    } catch (error) {
      // Could not find a user. Create one.
      const { data } = await axios.post(
        `/api/user/`,
        {
          email: attributes.email,
          birthdate: attributes.birthdate,
          name: attributes.name,
          sub: attributes.sub,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...attributes, ...data, token };
    }
  } catch (error) {
    // If all else fails, return null
    return null;
  }
});

export const refreshToken = createAsyncThunk("auth/refreshToken", async () => {
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    return token;
  } catch (error) {
    return null;
  }
});

/**
 * @description Signs the user out
 */
export const signOut = createAsyncThunk("auth/signOut", async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error(error);
  }
  return null;
});

export interface AuthState {
  user: User | null;
  loading: boolean;
  token: string | null;
}

export const auth = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    user: null,
    token: null,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = { ...state.user, payload };
    },
    setToken: (state, { payload }) => {
      if (state.getToken(user) !== payload) {
        state.user = { ...state.user, token: payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(signIn.pending, (state) => {
      state.user = null;
      state.loading = true;
    });
    builder.addCase(signOut.fulfilled, (state, { payload }) => {
      state.user = payload;
      state.loading = false;
    });
    builder.addCase(signOut.pending, (state) => {
      state.loading = true;
    });
  },
});

export const { setToken, setUser } = auth.actions;
export default auth.reducer;
