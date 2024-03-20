import { createAsyncThunk } from '@reduxjs/toolkit';
import { Auth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import { useAppSelector } from '../store';
import { AuthContextType } from '@/components/useAuth';

export const loginWithPhoneNumber = createAsyncThunk(
    'loginWithPhoneNumber',
    async (args: {auth: Auth,phoneNumber: string,recaptchaResolved: boolean;
    recaptcha: RecaptchaVerifier | null;
    callback: (
        args:
            | { type: 'success'; confirmationResult: any }
            | {
                  type: 'error';
                  message: string;
              }
    ) => void; }, { dispatch }) => {
        try {

            if (!args.recaptchaResolved || !args.recaptcha) {
                dispatch(showToast({ message: 'First Resolved the Captcha', type: 'info' }));
                return;
            }
            if (args.phoneNumber.slice() === '' || args.phoneNumber.length < 10) {
                dispatch(
                    showToast({
                        message: 'Enter the Phone Number and provide the country code',
                        type: 'info',
                    })
                );
                return;
            }

            
               const confirmationResult = await signInWithPhoneNumber(args.auth, args.phoneNumber, args.recaptcha);


                dispatch(
                    showToast({
                        message: 'Verification Code has been sent to your Phone',
                        type: 'success',
                    })
                );
                
                if (args.callback) {
                args.callback({
                    type: 'success',
                    confirmationResult
                });
                }

            
        } catch (e: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                    type: 'error',
                })
            );
        }
    }
);

export const verifyOTP = createAsyncThunk(
    'verifyOTP',
    async (args: {auth: AuthContextType,OTPCode: string, confirmationResult: any;
    callback: (
        args:
            | { type: 'success' }
            | {
                  type: 'error';
                  message: string;
              }
    ) => void; }, { dispatch }) => {
        try {
            if (
                args.OTPCode === null
            ) {
                return;
            }

            await args.confirmationResult.confirm(args.OTPCode);


                dispatch(
                    showToast({
                        message: 'Phone Number Verified Successfully!',
                        type: 'success',
                    })
                );
              args.callback({ type: 'success'});
                
            
        } catch (e: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                    type: 'error',
                })
            );
        }
    }
);

export const useIsLoginWithPhoneNumberLoading = () => {
    const loading = useAppSelector((state) => state.loading.loginWithPhoneNumber);
    return loading;
};

export const useVerifyOTPLoading = () => {
    const loading = useAppSelector((state) => state.loading.verifyOTP);
    return loading;
};
