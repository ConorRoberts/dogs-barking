import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Auth } from "aws-amplify";
import User from "@typedefs/User";
import axios from "axios";

/**
 * @description Signs the user in
 */
export const signIn = createAsyncThunk("auth/signIn", async () => {
  try {
    const res = await Auth.currentAuthenticatedUser();
    const token = res.signInUserSession.accessToken.jwtToken;

    try {
      const { data } = await axios.get(`/api/user/`, { headers: { Authorization: `Bearer ${token}` } });

      return { ...res.attributes, ...data, token };
    } catch (error) {
      const { data } = await axios.post(`/api/user/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      return { ...res.attributes, ...data, token };
    }
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
    setToken: (state, action) => {
      state.token = action.payload;
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

export const { setToken } = auth.actions;
export default auth.reducer;
