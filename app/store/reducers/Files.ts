import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Files } from "@/app/models/file.model";

type FilesState = {
  files: Files[];
  loading: boolean;
  error: string;
};

const initialState: FilesState = {
  files: [],
  loading: false,
  error: "",
};

const FoldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Files[]>) => {
      state.files = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  }
});

export default FoldersSlice.reducer;
export const { set, setLoading, setError } = FoldersSlice.actions;
