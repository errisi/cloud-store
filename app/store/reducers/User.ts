import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "@/app/services/client/authService";
import { accessTokenService } from "@/app/services/client/accessTokenService";
import { Users } from "@/app/models/user.model";

interface UserData {
  user: Users;
  accessToken: string;
}

type UserState = {
  user: Users | null;
  loading: boolean;
  error: string;
  checked: boolean;
  accessToken: string | null;
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: "",
  checked: false,
  accessToken: null,
};

export const init = createAsyncThunk(
  "user/fetch",
  async ({ email, password }: { email: string; password: string }) => {
    const result = await authService.login(email, password);
    const data = result as unknown as UserData;

    accessTokenService.save(data.accessToken);

    return data;
  }
);

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.refresh();
      const data = result as unknown as UserData;

      accessTokenService.save(data.accessToken);

      return data;
    } catch (error) {
      return rejectWithValue("User is not authenticated");
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  await authService.logout();
  accessTokenService.remove();

  return null;
});

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Users>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setChecked: (state, action: PayloadAction<boolean>) => {
      state.checked = action.payload;
    },
    updateUser: (state, action: PayloadAction<Users>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(init.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(init.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.loading = false;
    });

    builder.addCase(init.rejected, (state, action) => {
      state.loading = false;
      state.error = `${action.error.code}`;
    });

    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.loading = false;
      state.checked = true;
    });

    builder.addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.checked = true;
    });

    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
    });

    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = `Logout failed: ${action.error.message}`;
    });
  },
});

export default UserSlice.reducer;
export const { set, setLoading, setError, setChecked, updateUser } =
  UserSlice.actions;
