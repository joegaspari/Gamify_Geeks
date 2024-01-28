import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginTextInput from '../components/InputBox/LoginInput/LoginTextInput';
import LoginBackground from '../components/background/loginBackground/LoginBackground';

import LandingContentBox from './LandingContentBox';
import { useAuth } from '../context/AuthContext';
import Tooltip from '../components/Tooltip';
import PasswordPopup from '../components/PasswordPopup';
import { useLoading } from '../hook/useLoading';


const regex = {
  username: /^[a-zA-Z0-9._-]{1,20}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/,
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
  // username: "Username can only contain up to 20 characters including alphanumeric characters, periods, underscores, and hyphens.",
  // email: "Please provide a valid email address (maximum 50 characters).",
  // password: "Password must be between 8 and 24 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).",
  username: "Invalid username or email",
  email:"Invalid username or email",
  password: "Invalid user or password",
};


export default function Login(props) {




  const {signin } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const validateUsername = validateField(regex.username, setUsernameError, setUsernameErrorMessage, errorMessages.username);
  const validateEmail = validateField(regex.email, setUsernameError, setUsernameErrorMessage, errorMessages.email);
  const validatePassword = validateField(regex.password, setPasswordError, setPasswordErrorMessage, errorMessages.password);

  const setters = {
    username: setUsername,
    password: setPassword,

    usernameError: setUsernameError,
    passwordError: setPasswordError,

    usernameErrorMessage: setUsernameErrorMessage,
    passwordErrorMessage: setPasswordErrorMessage,

  };

  const onChange = (stateName) => (value) => {
    const setter = setters[stateName];
    const errorSetter = setters[`${stateName}Error`];
    if (setter) {
      setter(value);

      if (errorSetter) {
        errorSetter(false);
      }
    }
  };

  const {isLoading, startLoading, stopLoading} = useLoading({});

  const handleSign = (e) => {
    e.preventDefault();

    startLoading();

    const _username = !username.includes('@') && username
    const _email = username.includes('@') && username

    if(_username === "" || _email === "") {
      setUsernameError(true);
      setUsernameErrorMessage("Username or Email is required");
    }

    if(password === "") {
      setPasswordError(true);
      setPasswordErrorMessage("Password is required");
    }

    if ( _username === "" || _email === ""|| password === "") {
      stopLoading();
      return
    }

    //TODO:need to uncomment to validate username, email and password
    // const isUsernameValid = _username && validateUsername(_username);
    // const isEmailValid = _email && validateEmail(_email);
    // const isPasswordValid = validatePassword(password);

    // const isError = _username ? (!isUsernameValid || !isPasswordValid): (!isEmailValid || !isPasswordValid);


    // console.log(isError);

    // if (isError) {
    //     return;
    // }

    signin( _username , password, _email)
    .catch(error => {
      console.log(error.message);
      const messages = JSON.parse(error.message);

      Object.keys(messages).forEach(field => {
        const message = messages[field];

        const setError = setters[`${field}Error`];
        const setErrorMessage = setters[`${field}ErrorMessage`];

        if(field === 'password') {
          setPasswordError(true);
          setPasswordErrorMessage("Invalid user or password");
        } else if (field === 'username' || field === 'email'){
          setUsernameError(true);
          setUsernameErrorMessage(message);
        } else {
          if (setError) {
            setError(true);
          }

          if (setErrorMessage) {
              setErrorMessage(message);
          }
        }

        
      });

    })
    .finally(() => {
      stopLoading();
    });


  }


  return (
    <LandingContentBox>
      <div className="w-0 md:w-full">
        <LoginBackground />
      </div>
      <form className=" w-full h-full  bg-beige1 p-16 overflow-y-auto ">
        <div className={`flex justify-between items-center pb-24 `}>
          <h1 className={`font-bold text-7xl `}>{'Sign In'}</h1>
        </div>
        <div className={`w-full grid grid-cols-1 flex-col gap-8`}>
          <LoginTextInput onChange={onChange('username')} value={username} label="Email or Username" placeholder={'What\'s your Email or Username'} type={"text"}  error={usernameError} errorMessage={usernameErrorMessage} />
          <LoginTextInput 
            onChange={onChange('password')} 
            value={password} label="Password"
            placeholder={'What\'s Your Password?'} 
            type="password" 
            autocomplete={'current-password'} 
            tooltip={{
              id: "password",
              element: <Tooltip id="password" tooltip={<PasswordPopup/>} place='bottom' offset={10}/>
            }}
            error={passwordError}
            errorMessage={passwordErrorMessage}
          />
          
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
          id='needAccountBtn'
          className={`
            text-base	font-semibold
            cursor-pointer
            hover:underline
            transition-all
            duration-150
            rounded-xl
            px-2 
            `}
          to="/accounts/signup"
        >
          Don't Have An Account?
        </Link>
          <button
            id='submitBtn'
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
  );
}