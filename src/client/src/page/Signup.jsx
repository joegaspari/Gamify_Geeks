import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LandingContentBox from './LandingContentBox';
import LoginBackground from '../components/background/loginBackground/LoginBackground';
import LoginTextInput from '../components/InputBox/LoginInput/LoginTextInput';
import Tooltip from '../components/Tooltip';
import SmallToggleButton from '../components/SmallToggleButton';
import PasswordPopup from '../components/PasswordPopup';
import InstitutionCodePopup from '../components/InstitutionCodePopup';
import { useLoading } from '../hook/useLoading';


const regex = {
    name: /^[A-Za-z]{1,20}$/,
    username: /^[a-zA-Z0-9._-]{1,20}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/,
    emailVerificationCode: /^[0-9]{6}$/,
};

// When is valid, return true
const validateField = (regex, setter, messageSetter, errorMessage) => (value) => {
    if (!regex.test(value)) {
        setter(true);
        messageSetter(errorMessage);
        return false;
    } else {
        setter(false);
        messageSetter("");
        return true;
    }
}

const errorMessages = {
    firstName: "First Name can only contain up to 20 alphabetical characters.",
    lastName: "Last Name can only contain up to 20 alphabetical characters.",
    username: "Username can only contain up to 20 characters including alphanumeric characters, periods, underscores, and hyphens.",
    email: "Please provide a valid email address (maximum 50 characters).",
    password: "Password must be between 8 and 24 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).",
    confirmPassword: "Passwords do not match. Please confirm again.",
    emailVerificationCode: "Please provide a valid email verification code.",
};

const Signup = (props) => {

    const { signup, sendVerification } = useAuth();

    const [userRoleId, setUserRoleId] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [emailVerificationCode, setEmailVerificationCode] = useState('');
    const [isEmailTyped, setIsEmailTyped] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [codeError, setCodeError] = useState(false);
    const [emailVerificationCodeError, setEmailVerificationCodeError] = useState(false);

    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [codeErrorMessage, setCodeErrorMessage] = useState('');
    const [emailVerificationCodeErrorMessage, setEmailVerificationCodeErrorMessage] = useState('');



    //When is valid, return true
    const validateFirstName = validateField(regex.name, setFirstNameError, setFirstNameErrorMessage, errorMessages.firstName);
    const validateLastName = validateField(regex.name, setLastNameError, setLastNameErrorMessage, errorMessages.lastName);
    const validateUsername = validateField(regex.username, setUsernameError, setUsernameErrorMessage, errorMessages.username);
    const validateEmail = validateField(regex.email, setEmailError, setEmailErrorMessage, errorMessages.email);
    const validatePassword = validateField(regex.password, setPasswordError, setPasswordErrorMessage, errorMessages.password);
    const validateEmailVerificationCode = validateField(regex.emailVerificationCode, setEmailVerificationCodeError, setEmailVerificationCodeErrorMessage, errorMessages.emailVerificationCode);

    const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage(errorMessages.confirmPassword);
            return false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage("");
            return true;
        }
    };



    const setters = {
        firstName: setFirstName,
        lastName: setLastName,
        username: setUsername,
        email: setEmail,
        password: setPassword,
        confirmPassword: setConfirmPassword,
        code: setCode,
        emailVerificationCode: setEmailVerificationCode,

        firstNameError: setFirstNameError,
        lastNameError: setLastNameError,
        usernameError: setUsernameError,
        emailError: setEmailError,
        passwordError: setPasswordError,
        confirmPasswordError: setConfirmPasswordError,
        codeError: setCodeError,
        emailVerificationCodeError: setEmailVerificationCodeError,

        firstNameErrorMessage: setFirstNameErrorMessage,
        lastNameErrorMessage: setLastNameErrorMessage,
        usernameErrorMessage: setUsernameErrorMessage,
        emailErrorMessage: setEmailErrorMessage,
        passwordErrorMessage: setPasswordErrorMessage,
        confirmPasswordErrorMessage: setConfirmPasswordErrorMessage,
        codeErrorMessage: setCodeErrorMessage,
        emailVerificationCodeErrorMessage: setEmailVerificationCodeErrorMessage,

    };

    const onChange = (stateName) => (value) => {
        const setter = setters[stateName];
        const errorSetter = setters[`${stateName}Error`];
        if (setter) {
            setter(value);

            if (stateName === 'email') {

                if (value === '') {
                    setIsEmailTyped(false);
                } else {
                    setIsEmailTyped(true);
                }

                if (isCodeSent) {

                    setIsCodeSent(false);
                }
            }

            if (errorSetter) {
                if (stateName === 'confirmPassword') {
                    const isError = value == password ? false : true;
                    isError && setConfirmPasswordErrorMessage(errorMessages.confirmPassword);
                    errorSetter(isError);
                } else {
                    errorSetter(false);
                    if (stateName === 'password') {
                        const isError = value == confirmPassword ? false : true;
                        isError && setConfirmPasswordErrorMessage(errorMessages.confirmPassword);
                        setConfirmPasswordError(isError);
                    }
                }
            }
        }
    };

    const { isLoading, startLoading, stopLoading } = useLoading({});

    const handleSign = (e) => {
        e.preventDefault();

        startLoading();

        // validate fields
        const isValid = [
            validateFirstName(firstName),
            validateLastName(lastName),
            validateUsername(username),
            validateEmail(email),
            validatePassword(password),
            validateConfirmPassword(password, confirmPassword),
            validateEmailVerificationCode(emailVerificationCode),
        ]

        const isError = isValid.some(error => error === false);


        if (isError) {
            stopLoading();
            return;
        }

        signup({ username: username.toLowerCase(), firstName, lastName, password, email: email.toLowerCase(), userRoleId, institutionCode: code, emailVerificationCode })
            .catch(error => {
                console.log(error.message);
                const messages = JSON.parse(error.message);

                Object.keys(messages).forEach(field => {
                    const message = messages[field];

                    const setError = setters[`${field}Error`];
                    const setErrorMessage = setters[`${field}ErrorMessage`];


                    if (setError) {
                        setError(true);
                    }

                    if (setErrorMessage) {
                        setErrorMessage(message);
                    }
                });
            })
            .finally(() => {
                stopLoading();
            });

    };


    const handleToggle = () => {
        setUserRoleId(userRoleId === 1 ? 3 : 1);
    }

    const handleSendCode = () => {
        const isEmailValidate = validateEmail(email);
        if (!isEmailValidate) {
            return;
        }
        setIsCodeSent(true);
        sendVerification(email.toLowerCase())
            .then((res) => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            });
    }



    return (
        <LandingContentBox>
            <div className="w-0 md:w-full">
                <LoginBackground />
            </div>
            <form className=" w-full h-full  bg-beige1 p-16 overflow-y-auto ">
                <div className={`flex justify-between items-center pb-24 ${userRoleId === 3 && "pb-[70px]"}`}>
                    <h1 className={`font-bold text-7xl `}>{'Sign Up'}</h1>
                    <SmallToggleButton titles={["Student", "Instructor"]} handleToggle={handleToggle} />
                </div>
                <div className={`w-full grid grid-cols-1 xl:grid-cols-2 flex-col gap-8`}>

                    <LoginTextInput onChange={onChange('firstName')} value={firstName} label="First Name" placeholder={'What\'s Your First Name?'} type="text" required error={firstNameError} errorMessage={firstNameErrorMessage} />
                    <LoginTextInput onChange={onChange('lastName')} value={lastName} label="Last Name" placeholder={'What\'s Your Last Name?'} type="text" required error={lastNameError} errorMessage={lastNameErrorMessage} />
                    <LoginTextInput onChange={onChange('username')} value={username} label="Userame" placeholder={'What\'s Your Username?'} type="text" required error={usernameError} errorMessage={usernameErrorMessage} />
                    <LoginTextInput onChange={onChange('email')} value={email} label="Email" placeholder={'What\'s Your Email?'} type="email" required error={emailError} errorMessage={emailErrorMessage} isEmailTyped={isEmailTyped} handleSendCode={handleSendCode} isCodeSent={isCodeSent} />
                    {isCodeSent && <LoginTextInput onChange={onChange('emailVerificationCode')} value={emailVerificationCode} label="Email Verification Code" placeholder={'Verify Your Email by Code.'} type="text" required error={emailVerificationCodeError} errorMessage={emailVerificationCodeErrorMessage} />}

                    <LoginTextInput
                        onChange={onChange('password')}
                        value={password} label="Password"
                        placeholder={'What\'s Your Password?'}
                        type="password"
                        autocomplete={'new-password'}
                        required
                        tooltip={{
                            id: "password",
                            element: <Tooltip id="password" tooltip={<PasswordPopup />} place='bottom' offset={10} />
                        }}
                        error={passwordError}
                        errorMessage={passwordErrorMessage}
                    />

                    <LoginTextInput onChange={onChange('confirmPassword')} value={confirmPassword} label="Confirm Password" placeholder="Confirm Your Password." type="password" utocomplete="new-password" required error={confirmPasswordError} errorMessage={confirmPasswordErrorMessage} />


                    {userRoleId === 3 && (
                        <LoginTextInput
                            onChange={onChange('code')}
                            value={code}
                            label="Institution Code"
                            placeholder={'What\'s Institution Code?'}
                            type="text"
                            required
                            tooltip={{
                                id: "institutionCode",
                                element: <Tooltip id="institutionCode" tooltip={<InstitutionCodePopup />} place='bottom' offset={10} />
                            }}
                            error={codeError}
                            errorMessage={codeErrorMessage}
                        />
                    )}
                </div>
                <div className={`
                        flex xl:flex-row flex-col 
                        xl:justify-between xl:items-end 
                        justify-center items-start
                        xl:mt-12 x1:gap-5
                        mt-5 gap-14
                        `}
                >
                    <Link
                        id='hasAccountBtn'
                        className={`
                        text-base	font-semibold
                        cursor-pointer
                        hover:underline
                        transition-all
                        duration-150
                        rounded-xl
                        px-2 
                        `}
                        to='/accounts/login'
                    >
                        Already Have An Account?
                    </Link>


                    <button
                        onClick={e => handleSign(e)}
                        className={`
                        font-bold text-lg
                        text-white1 bg-bgBlue1
                        px-12 xl:px-16 
                        py-2
                        w-full xl:w-fit
                        rounded-xl
                        hover:bg-blue-400 active:bg-blue2
                        transition-all duration-150
                        ${isLoading && 'opacity-50 cursor-not-allowed'}
                        `}
                        disabled={isLoading}
                    >
                        {isLoading ? '\u00A0\u00A0Loading...\u00A0\u00A0' : 'Get Started'}
                    </button>
                </div>

            </form>

            <div />

        </LandingContentBox>
    )
}

export default Signup;