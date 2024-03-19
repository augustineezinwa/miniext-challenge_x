import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useAppDispatch } from '../redux/store';
import LoadingButton from './LoadingButton';
import Input from './Input';
import { loginWithPhoneNumber, useIsLoginWithPhoneNumberLoading, useVerifyOTPLoading, verifyOTP } from '../redux/auth/loginWithPhoneNumber';
import { RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebaseAuth';
import { showToast } from '../redux/toast/toastSlice';
import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';

interface SignUpModalProps {
    open: boolean;
    setOpen: (show: boolean) => void;
}
const SignUpWithPhoneModal = (props: SignUpModalProps) => {
    const dispatch = useAppDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
    const [recaptchaResolved, setRecaptchaResolved] = useState(false);
    const [shouldShowOTP, setShouldShowOTP] = useState(false);
    const [OTPCode, setOTPCode] = useState('');
    const isPhoneNumberLoading = useIsLoginWithPhoneNumberLoading();
    const isVerifyOTPLoading = useVerifyOTPLoading();
    const auth = useAuth();
    const router = useRouter();



        // Sending OTP and storing id to verify it later
        const sendOTP = async () => {
            dispatch(
                loginWithPhoneNumber({
                    auth: firebaseAuth,
                    phoneNumber,
                    recaptcha,
                    recaptchaResolved,
                    callback: (result) => {
                        if (result.type === 'error') {
                            setRecaptchaResolved(false);
                            return;
                        }

                        (window as any).verification = result.confirmationResult;
                        setShouldShowOTP(true);
                        
                    },
                })
            );
        };

        const validateOtp = async () => {
            dispatch(
                verifyOTP({
                    auth,
                    OTPCode,
                    confirmationResult: (window as any).verification,
                    callback: (result) => {
                        console.log(result);
                        if (result.type === 'error') {
                            dispatch(
                                showToast({
                                    message: result.message,
                                    type: 'error',
                                })
                            );
                            return;
                        }
                        dispatch(
                            showToast({
                                message: 'Phone Verified Successfully',
                                type: 'success',
                            })
                        );
                        (window as any).verification = null;
                        props.setOpen(false);
                        router.refresh();
                        
                    },
                })
            );
        }


        // generating the recaptcha on page render
        useEffect(() => {
            const captcha = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
                size: 'normal',
                callback: () => {
                    setRecaptchaResolved(true);
                },
    
                'expired-callback': () => {
                    setRecaptchaResolved(false);
                    dispatch(
                        showToast({
                            message: 'Recaptcha Expired, please verify it again',
                            type: 'info',
                        })
                    );
                },
            });
    
            captcha.render();
    
            setRecaptcha(captcha);
        }, []);
    

    return (
        <Modal show={props.open} setShow={props.setOpen}>
            <div className="max-w-md w-full bg-white py-6 rounded-lg">
                <h2 className="text-lg font-semibold text-center mb-10">Sign Up With Phone number</h2>
                <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter Phone Number"
                        name="phone"
                        type="text"
                    />
                        <LoadingButton
                            onClick={sendOTP}
                            loading={isPhoneNumberLoading}
                            loadingText="Sending OTP"
                        >
                            Send OTP
                        </LoadingButton>
                    <div id="recaptcha-container" />
                    </div>
                    


                </div>

                <Modal show={shouldShowOTP} setShow={setShouldShowOTP}>
                        <div className="max-w-xl w-full bg-white py-6 rounded-lg">
                            <h2 className="text-lg font-semibold text-center mb-10">
                                Enter Code to Verify
                            </h2>
                            <div className="px-4 flex items-center gap-4 pb-10">
                                <Input
                                    value={OTPCode}
                                    type="text"
                                    placeholder="Enter your OTP"
                                    onChange={(e) => setOTPCode(e.target.value)}
                                />

                                <LoadingButton
                                    onClick={validateOtp}
                                    loading={isVerifyOTPLoading}
                                    loadingText="Verifying..."
                                >
                                    Verify
                                </LoadingButton>
                            </div>
                        </div>
                    </Modal>
            
            
            
        </Modal>
  
    );
};

export default SignUpWithPhoneModal;
