import { createSlice } from '@reduxjs/toolkit';
import { loginWithEmail } from '../auth/loginWithEmail';
import { sendVerificationCode, verifyPhoneNumber } from '../auth/verifyPhoneNumber';
import { loginWithPhoneNumber, verifyOTP } from '../auth/loginWithPhoneNumber';
import { linkWithEmail } from '../auth/linkWithEmail';

export interface LoadingStates {
    [key: string]: boolean;
}

const initialState: LoadingStates = {
    loginWithEmail: false,
    loginWithPhoneNumber: false,
    sendVerificationCode: false,
    verifyPhoneNumber: false,
    verifyOTP: false,
    linkWithEmail: false,
    verifyEmail: false,
};

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginWithEmail.pending, (state) => {
            state.loginWithEmail = true;
        });
        builder.addCase(loginWithEmail.fulfilled, (state) => {
            state.loginWithEmail = false;
        });
        builder.addCase(loginWithEmail.rejected, (state) => {
            state.loginWithEmail = false;
        });
        // Send Verify Phone Number
        builder.addCase(sendVerificationCode.pending, (state) => {
            state.sendVerificationCode = true;
        });
        builder.addCase(sendVerificationCode.fulfilled, (state) => {
            state.sendVerificationCode = false;
        });
        builder.addCase(sendVerificationCode.rejected, (state) => {
            state.sendVerificationCode = false;
        });
        // Verify Phone Number
        builder.addCase(verifyPhoneNumber.pending, (state) => {
            state.verifyPhoneNumber = true;
        });
        builder.addCase(verifyPhoneNumber.fulfilled, (state) => {
            state.verifyPhoneNumber = false;
        });
        builder.addCase(verifyPhoneNumber.rejected, (state) => {
            state.verifyPhoneNumber = false;
        });
        // Login with Phone Number
        builder.addCase(loginWithPhoneNumber.pending, (state) => {
            state.loginWithPhoneNumber = true;
        });
        builder.addCase(loginWithPhoneNumber.fulfilled, (state) => {
            state.loginWithPhoneNumber = false;
        });
        builder.addCase(loginWithPhoneNumber.rejected, (state) => {
            state.loginWithPhoneNumber = false;
        });

        // Verify OTP
        builder.addCase(verifyOTP.pending, (state) => {
            state.verifyOTP = true;
        });
        builder.addCase(verifyOTP.fulfilled, (state) => {
            state.verifyOTP = false;
        });
        builder.addCase(verifyOTP.rejected, (state) => {
            state.verifyOTP = false;
        });

        // Link with Email
        builder.addCase(linkWithEmail.pending, (state) => {
            state.linkWithEmail = true;
        });
        builder.addCase(linkWithEmail.fulfilled, (state) => {
            state.linkWithEmail = false;
        });
        builder.addCase(linkWithEmail.rejected, (state) => {
            state.linkWithEmail = false;
        });

    },
});

export const loadingReducer = loadingSlice.reducer;
