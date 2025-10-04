import { API_BASE_URL } from "@/config/api";
import type {
  AddAddressParams,
  AddressState,
  DeleteAddressParams,
  EditAddressParams,
} from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: AddressState = {
  isLoading: false,
  addressList: [],
};

/* export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/address/add",
      formData
    );

    return response.data;
  }
); */

// Fixed async thunks with proper typing
/* export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (params: AddAddressParams) => {
    const { userId, formData } = params;
    const response = await axios.post(
      `http://localhost:5000/api/shop/address/add`,
      {
        userId,
        ...formData,
      }
    );
    return response.data;
  }
); */
/* 
export const addNewAddress = createAsyncThunk(
  "address/addNewAddress",
  async (payload: any, { rejectWithValue }) => {
    try {
      console.log(
        "📤 [Thunk:addNewAddress] Final payload to backend:",
        payload
      );

      const response = await axios.post(
        "http://localhost:5000/api/shop/address/add",
        payload
      );

      console.log("✅ [Thunk:addNewAddress] Backend response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ [Thunk:addNewAddress] Error response:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
); */
export const addNewAddress = createAsyncThunk(
  "address/addNewAddress",
  async (payload: any, { rejectWithValue }) => {
    try {
      // console.log("📤 [Thunk:addNewAddress] Payload received:", payload);

      // Extract the nested formData and spread it with userId
      const requestBody = {
        userId: payload.userId,
        ...payload.formData, // Spread the formData properties
      };

      // console.log("📤 [Thunk:addNewAddress] Sending to backend:", requestBody);

      const response = await axios.post(
        `${API_BASE_URL}/api/shop/address/add`, // ✅ Fixed URL
        requestBody // ✅ Flattened payload
      );

      // console.log("✅ [Thunk:addNewAddress] Backend response:", response.data);
      return response.data;
    } catch (error: any) {
      /*  console.error(
        "❌ [Thunk:addNewAddress] Error:",
        error.response?.data || error.message
      ); */
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/shop/address/get/${userId}`
    );

    return response.data;
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }: EditAddressParams) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }: DeleteAddressParams) => {
    const response = await axios.delete(
      `${API_BASE_URL}/api/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);
// Create the slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
