import { createAsyncThunk,  createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createProfileAPI, editProfileAPI, getProfile } from './profileAPI';


export interface IProfile {
  message: string;
  profile: {
    user_id: number;
    profile_image: string;
    title: string;
  };
}

export interface IProfileState {
  profile: IProfile[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  editedprofileImage: string
}

const initialState: IProfileState = {
  profile: [],
  status: 'idle',
  error: null,
  editedprofileImage:""
};

export const fetchProfile = createAsyncThunk<IProfile[], { token: string; userID: number }>(
  'profiles/fetchProfile',
  async ({ token, userID }) => {
    if (!token) {
      throw new Error('Token not found');
    }
    try {
      const response = await getProfile(token, userID);
      return response;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      throw error;
    }
  }
);

export const createProfile = createAsyncThunk<IProfile[], { token: string; userID: number }>(
  'profiles/createProfile',
  async ({ token, userID }) => {
    if (!token) {
      throw new Error('Token not found');
    }
    try {
      const response = await createProfileAPI(token, userID);
      return response;
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  }
);

export const editProfileAsync = createAsyncThunk<IProfile, { token: string; formData: FormData }>(
  'profiles/editProfile',
  async ({ token, formData }) => {
    if (!token) {
      throw new Error('Token not found');
    }
    try {
      const response = await editProfileAPI(token, formData);
      return response;
    } catch (error) {
      console.error('Error in editProfileAsync:', error);
      throw error;
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error && action.error.message ? action.error.message : 'Unknown error';
      })
      .addCase(editProfileAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedProfile = action.payload.profile.profile_image;
        state.editedprofileImage = updatedProfile
      })
      .addCase(editProfileAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error && action.error.message ? action.error.message : 'Unknown error';
      });
  },
});



export const selectProfile = (state: RootState) => state.profile;
export const selectEditedImageProfile = (state: RootState) => state.editedprofileImage
export default profileSlice.reducer;