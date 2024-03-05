import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { foldersService } from "@/app/services/client/flodersService";
import { Folders } from "@/app/models/folder.model";

type FoldersState = {
  folders: Folders[];
  loading: boolean;
  error: string;
};

const initialState: FoldersState = {
  folders: [],
  loading: false,
  error: "",
};

export const init = createAsyncThunk(
  "folders/fetch",
  async (userId: string) => {
    const result = await foldersService.getFoldersByUserId(userId);
    const folders = result as unknown as Folders[];

    return folders;
  }
);

const FoldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Folders[]>) => {
      state.folders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(init.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(init.fulfilled, (state, action) => {
      state.folders = action.payload;
      state.loading = false;
    });

    builder.addCase(init.rejected, (state, action) => {
      state.loading = false;
      state.error = `There was an error loading, this is what our server says: ${action.payload}`;
    });
  },
});

export default FoldersSlice.reducer;
export const { set, setLoading, setError } = FoldersSlice.actions;
