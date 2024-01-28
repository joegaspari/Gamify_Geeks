import React, { useState } from "react";
import ContentBox from "./ContentBox";
import ContentHeader from "../components/ContentHeader";
import HelpIcon from "../components/icon/HelpIcon";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ResetBox from "../components/InputBox/ResetBox";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useLoading } from "../hook/useLoading";

const regex = {
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/,
    emailVerificationCode: /^[0-9]{6}$/,
};

const errorMessages = {
    password:
        "Password must be between 8 and 24 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).",
    confirmPassword: "Passwords do not match. Please confirm again.",
    emailVerificationCode: "Please provide a valid email verification code.",
};

export default function ResetPassword() {
    const { sendVerification, updatePassword } = useAuth();
    const { profile } = useProfile();

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [paasswordErrorMessage, setPasswordErrorMessage] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

    const [emailVerificationCode, setEmailVerificationCode] = useState("");
    const [emailVerificationCodeError, setEmailVerificationCodeError] = useState(false);
    const [emailVerificationCodeErrorMessage, setEmailVerificationCodeErrorMessage] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);

    const [isError, setIsError] = useState(false);
    const [updatePasswordMsg, setUpdatePasswordMsg] = useState("");
    const [intervalId, setIntervalId] = useState(null);

    const { isLoading, startLoading, stopLoading } = useLoading({});

    const onSendCodeBtnClick = () => {
        setIsCodeSent(true);
        sendVerification(profile.email.toLowerCase())
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleChangeEmailVerificationCode = (value) => {
        setEmailVerificationCode(value);
        setEmailVerificationCodeError(false);
        setEmailVerificationCodeErrorMessage("");
    };

    const handleChangePassword = (value) => {
        setPassword(value);
        setPasswordError(false);
        setPasswordErrorMessage("");
    };

    const handleChangeConfirmPassword = (value) => {
        setConfirmPassword(value);
    };

    const handleResetPassword = () => {
        if (!regex.emailVerificationCode.test(emailVerificationCode)) {
            setEmailVerificationCodeError(true);
            setEmailVerificationCodeErrorMessage(errorMessages.emailVerificationCode);
            return;
        }

        if (!regex.password.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage(errorMessages.password);
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage("Password does not match");
            return;
        }
        console.log("reset password");

        startLoading();
        updatePassword(password, emailVerificationCode, profile.email.toLowerCase())
            .then(() => {
                console.log("password updated");
                setUpdatePasswordMsg("Password updated!");
                if (intervalId) {
                    clearInterval(intervalId);
                }
                const newIntervalId = setInterval(() => {
                    setUpdatePasswordMsg("");
                    setIsError(false);
                }, 3000);
                setIntervalId(newIntervalId);
            })
            .catch((error) => {
                console.error(error);

                console.log(error);
                // Parse the error message if it's a stringified JSON.
                let parsedError = error;
                if (typeof error === "string") {
                    try {
                        parsedError = JSON.parse(error);
                    } catch (e) {
                        console.error("Error while parsing the error message:", e);
                    }
                }

                setEmailVerificationCodeError(true);
                setEmailVerificationCodeErrorMessage(parsedError.emailVerificationCode);

                setIsError(true);
                setUpdatePasswordMsg("Failed to update password");
                if (intervalId) {
                    clearInterval(intervalId);
                }
                const newIntervalId = setInterval(() => {
                    setUpdatePasswordMsg("");
                    setIsError(false);
                }, 3000);
                setIntervalId(newIntervalId);
            })
            .finally(() => {
                stopLoading();
            });
    };

    return (
        <ContentBox id={"resetPasswordPage"}>
            <MainContent styles="gap-8">
                <ContentHeader
                    title="Reset Password"
                    subtitle="Don't worry, we'll help you get back into your account."
                    icons={[{ id: 1, tag: <HelpIcon /> }]}
                />
                <div className="flex flex-col gap-base">
                    <div className="bg-white1 rounded-lg p-base flex flex-col gap-base shadow-md">
                        <p className="text-[18px]">We'll send you a code to your email!</p>
                        <div
                            className={`
                  flex justify-center items-center gap-1
                  rounded-md px-4 py-1
                  bg-white1 border border-black2
                  active:bg-white3 active:shadow-inner
                  hover:bg-slate-200 transition-all duration-150 ease-in
                  cursor-pointer text-center align-middle
                  `}
                            onClick={onSendCodeBtnClick}
                        >
                            <p className="text-xs">{isCodeSent ? "Resend Code" : "Send Code"}</p>
                        </div>
                        <ResetBox
                            value={emailVerificationCode}
                            onChange={handleChangeEmailVerificationCode}
                            id="emailVerificationCode"
                            title="Email Verification Code"
                            error={emailVerificationCodeError}
                            errorMessage={emailVerificationCodeErrorMessage}
                        />
                        <ResetBox
                            value={password}
                            type={"password"}
                            onChange={handleChangePassword}
                            id="password"
                            title="Password"
                            error={passwordError}
                            errorMessage={paasswordErrorMessage}
                        />
                        <ResetBox
                            value={confirmPassword}
                            type={"password"}
                            onChange={handleChangeConfirmPassword}
                            id="confirmPassword"
                            title="Confirm Password"
                            error={confirmPasswordError}
                            errorMessage={confirmPasswordErrorMessage}
                        />
                        <button
                            className={`bg-green-500 text-white1 rounded-[20px] px-5 py-2
                        hover:bg-green-400 transition-all ease-in duration-150 active:bg-green-600
                        `}
                            onClick={handleResetPassword}
                        >
                            {isLoading ? "Loading..." : "Reset Password"}
                        </button>
                        {updatePassword && <p className={`text-sm w-full text-center ${isError ? "text-bgRed1" : "text-bgGreen1"}`}>{updatePasswordMsg}</p>}
                    </div>
                </div>
            </MainContent>

            <Sidebar></Sidebar>
        </ContentBox>
    );
}
