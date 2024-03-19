import { createAsyncThunk } from '@reduxjs/toolkit';
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import isEmail from 'validator/lib/isEmail';
import { useAppSelector } from '../store';
import { AuthContextType } from '@/components/useAuth';
import { LoadingStateTypes } from '../types';
import { NextRouter} from 'next/router';

export const linkWithEmail = createAsyncThunk(
    'linkWithEmail',
    async (args: { auth: AuthContextType, email: string, password: string, router: NextRouter}, { dispatch }) => {
        try {
            if (!isEmail(args.email)) {
                dispatch(
                    showToast({
                        message: 'Enter a valid email',
                        type: 'info',
                    })
                );
                return;
            }
            
            if (args.password.length < 6) {
                dispatch(
                    showToast({
                        message: 'Password should be at least 6 characters',
                        type: 'info',
                    })
                );
                return;
            }

            if (args.auth.type !== LoadingStateTypes.LOADED) return;

            const credential = EmailAuthProvider.credential(args.email, args.password);
            await linkWithCredential(args.auth.user, credential);
            

                dispatch(
                    showToast({
                        message: 'You are logged in!',
                        type: 'success',
                    })
                );
                args.router.reload();
                
            
        } catch (e: any) {
            console.error(e)
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                    type: 'error',
                })
            );
        }
    }
);


export const useIsLinkWithEmailLoading = () => {
    const loading = useAppSelector((state) => state.loading.linkWithEmail);
    return loading;
};

export const useIsVerifyEmailLoading = () => {
    const loading = useAppSelector((state) => state.loading.verifyEmail);
    return loading;
};
