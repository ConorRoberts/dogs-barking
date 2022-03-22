import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Auth } from "aws-amplify";
import UserAttributes from "@typedefs/CognitoUser";

/**
 * @description Signs the user in
 */
export const signIn = createAsyncThunk("auth/signIn", async () => {
  try {
    const res = await Auth.currentAuthenticatedUser();

    return res.attributes as UserAttributes;
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
  user: UserAttributes | null;
  loading: boolean;
}

export const auth = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
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

export default auth.reducer;
