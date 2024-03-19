/* eslint-disable @next/next/no-img-element */
import {  useState } from 'react';
import ToastBox from '@/components/ui/ToastBox';
import { useAppDispatch } from '@/components/redux/store';
import Input from '@/components/ui/Input';
import LoadingButton from '@/components/ui/LoadingButton';
import Logout from './Logout';
import { useAuth } from '../useAuth';
import { linkWithEmail, useIsLinkWithEmailLoading } from '../redux/auth/linkWithEmail';
import { useRouter } from 'next/router';

const AddEmailModal = () => {
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const isEmailLinkingLoading = useIsLinkWithEmailLoading();


    const linkEmail = async () => {
        dispatch(
            linkWithEmail({
                auth,
                email,
                password,
                router
            })
        );
    }


    return (
        <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 ">
                <div>
                    <img
                        className="w-auto h-12 mx-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="max-w-xl w-full rounded overflow-hidden shadow-lg py-2 px-4">
                    <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                       <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Add email"
                            type="text"
                        />
                         <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Set password"
                            type="password"
                        />
                        <LoadingButton
                            onClick={linkEmail}
                            loading={isEmailLinkingLoading}
                            loadingText="Signing you in..."
                        >
                            Login
                        </LoadingButton>
                    </div>
                    <div className="flex w-full flex-col">
                        <Logout />
                    </div>

                </div>
            </div>
            <ToastBox />
        </div>
    );
};

export default AddEmailModal;
