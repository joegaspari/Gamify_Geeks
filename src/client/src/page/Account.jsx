import React, { useEffect, useState } from "react";
import ContentHeader from "../components/ContentHeader";
import { useData } from "../context/DataContext";
import HexagonImage from "../components/HexagonImage/HexagonImage";
import ResetBox from "../components/InputBox/ResetBox";
import CheckBox from "../components/InputBox/CheckBox";
import notiCategory from "../data/notiCategory.json";
import showMeCategory from "../data/showMeCategory.json";
import infoItems from "../data/infoItem.json";
import HelpIcon from "../components/icon/HelpIcon";
import PersonIcon from "../components/icon/PersonIcon";
import PictureIcon from "../components/icon/PictureIcon";
import KeyIcon from "../components/icon/KeyIcon";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ContentBox from "./ContentBox";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../hook/useLoading";
import { useProfile } from "../context/ProfileContext";
import FloatingSelectBox from "../components/InputBox/Select/FloatingSelectBox";

const icons = [<PersonIcon />, <PictureIcon />, <KeyIcon />, <PersonIcon />, <PictureIcon />, <KeyIcon />];

const regex = {
    name: /^[A-Za-z]{1,20}$/,
    username: /^[a-zA-Z0-9._-]{1,20}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/,
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
};

const errorMessages = {
    firstName: "First Name can only contain up to 20 alphabetical characters.",
    lastName: "Last Name can only contain up to 20 alphabetical characters.",
    username: "Username can only contain up to 20 characters including alphanumeric characters, periods, underscores, and hyphens.",
    email: "Please provide a valid email address (maximum 50 characters).",
    password:
        "Password must be between 8 and 24 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).",
    confirmPassword: "Passwords do not match. Please confirm again.",
};

const infoDescription = infoItems.slice(0, 3).map((i, index) => ({
    ...i,
    icon: icons[index],
}));

export default function Account() {
    const { getShowMeChecked, getNotiChecked, getBadgeTitles } = useData();
    const { updateProfileInfo } = useAuth();
    const { profile, updateProfile } = useProfile();

    const [badgeTitles, setBadgeTitles] = useState([]);

    useEffect(() => {
        getBadgeTitles().then((i) => {
            const userTitles = i.map((data) => {
                return {
                    id: data.badgeId,
                    title: data.title,
                };
            });

            // TODO: Fix once getBadgeTitles API is fixed
            userTitles.push({
                id: 2,
                title: "Tester",
            });

            setBadgeTitles(userTitles);
        });
    }, [getBadgeTitles]);

    const [userTitle, setUserTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [initialUserTitle, setInitialUserTitle] = useState("");
    const [initialFirstName, setInitialFirstName] = useState("");
    const [initialLastName, setInitialLastName] = useState("");
    const [initialUsername, setInitialUsername] = useState("");
    const [initialEmail, setInitialEmail] = useState("");
    // const [phoneNumber, setPhoneNUmber] = useState('');

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    //When is valid, return true
    const validateFirstName = validateField(regex.name, setFirstNameError, setFirstNameErrorMessage, errorMessages.firstName);
    const validateLastName = validateField(regex.name, setLastNameError, setLastNameErrorMessage, errorMessages.lastName);
    const validateUsername = validateField(regex.username, setUsernameError, setUsernameErrorMessage, errorMessages.username);
    const validateEmail = validateField(regex.email, setEmailError, setEmailErrorMessage, errorMessages.email);

    const setters = {
        firstName: setFirstName,
        lastName: setLastName,
        username: setUsername,
        email: setEmail,
        // phoneNumber: setPhoneNUmber,

        firstNameError: setFirstNameError,
        lastNameError: setLastNameError,
        usernameError: setUsernameError,
        emailError: setEmailError,

        firstNameErrorMessage: setFirstNameErrorMessage,
        lastNameErrorMessage: setLastNameErrorMessage,
        usernameErrorMessage: setUsernameErrorMessage,
        emailErrorMessage: setEmailErrorMessage,
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

    const [isClickable, setIsClickable] = useState(true);

    useEffect(() => {
        if (
            (firstName === initialFirstName &&
                lastName === initialLastName &&
                username.toLowerCase() === initialUsername.toLowerCase() &&
                email.toLowerCase() === initialEmail.toLowerCase() &&
                userTitle === initialUserTitle) ||
            firstNameError ||
            lastNameError ||
            usernameError ||
            emailError
        ) {
            setIsClickable(false);
        } else {
            setIsClickable(true);
        }
    }, [
        userTitle,
        firstName,
        lastName,
        username,
        email,
        firstNameError,
        lastNameError,
        usernameError,
        emailError,
        initialUserTitle,
        initialFirstName,
        initialLastName,
        initialUsername,
        initialEmail,
    ]);

    const [notiChecked, setNotiChecked] = useState(null);
    const [showMeChecked, setShowMeChecked] = useState(null);

    useEffect(() => {
        console.log("Refreshed");
        if (profile) {
            const { firstName, lastName, username, email, titleId } = profile;

            if (userTitle == "") {
                setUserTitle(titleId);
            }

            setFirstName(firstName);
            setLastName(lastName);
            setUsername(username);
            setEmail(email);
            // setPhoneNUmber(phoneNumber);

            // setProfile(user);
            setInitialUserTitle(titleId);
            setInitialFirstName(firstName);
            setInitialLastName(lastName);
            setInitialUsername(username);
            setInitialEmail(email);
        }

        // });
    }, [profile]);

    useEffect(() => {
        getNotiChecked().then((i) => {
            const result = i.reduce((acc, cur) => {
                acc[cur.id] = cur.checked;
                return acc;
            }, {});
            setNotiChecked(result);
        });

        getShowMeChecked().then((i) => {
            const result = i.reduce((acc, cur) => {
                acc[cur.id] = cur.checked;
                return acc;
            }, {});
            setShowMeChecked(result);
        });
    }, [getNotiChecked, getShowMeChecked]);

    const [updated, setUpdated] = useState(false);
    const [failed, setFailed] = useState(false);
    const { isLoading, startLoading, stopLoading } = useLoading({});

    const handleUpdateButton = () => {
        setFirstNameError(false);
        setLastNameError(false);
        setUsernameError(false);
        setEmailError(false);

        startLoading();

        const isValid = [validateFirstName(firstName), validateLastName(lastName), validateUsername(username), validateEmail(email)];

        const isError = isValid.some((error) => error === false);

        if (isError) {
            stopLoading();
            return;
        }

        updateProfileInfo({
            username: username.toLowerCase(),
            firstName,
            lastName,
            email: email.toLowerCase(),
            usernameChanged: username.toLowerCase() !== initialUsername.toLowerCase(),
            emailChanged: email.toLowerCase() !== initialEmail.toLowerCase(),
            firstNameChanged: firstName !== initialFirstName,
            lastNameChanged: lastName !== initialLastName,
            userTitle: userTitle,
        })
            .then(() => {
                setInitialUserTitle(userTitle);
                setInitialFirstName(firstName);
                setInitialLastName(lastName);
                setInitialUsername(username.toLowerCase());
                setInitialEmail(email.toLowerCase());

                updateProfile({ ...profile, firstName, lastName, username: username.toLowerCase(), email: email.toLowerCase() });
                setUpdated(true);
                setTimeout(() => {
                    setUpdated(false);
                }, 3000);
            })
            .catch((error) => {
                const messages = JSON.parse(error.message);

                Object.keys(messages).forEach((field) => {
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
                setFailed(true);
                setTimeout(() => {
                    setFailed(false);
                }, 3000);
            })
            .finally(() => {
                stopLoading();
            });
    };

    const handleUserTitleChange = (id) => {
        console.log(id);
        setUserTitle(id);
    };

    return (
        <ContentBox id={"account"}>
            <MainContent styles="gap-7">
                <ContentHeader title="Account Settings" subtitle="Need Some things changed?" icons={[{ id: 1, tag: <HelpIcon /> }]} />

                <div className="flex flex-col p-base gap-5 rounded-[20px] shadow-standard bg-white1">
                    <div className="flex gap-4 p-6 text-black1 rounded-[10px] border border-white3 items-center ">
                        <HexagonImage profileImg={profile ? profile.profileImg : ""} resize={1} />
                        <div className="text-black1border border-black">
                            <h1 className="text-2xl font-semibold">{`${firstName} ${lastName}`}</h1>
                            {profile.userRoleId != 3 && (
                                <div className="flex items-center gap-2.5">
                                    <FloatingSelectBox options={badgeTitles} selectedOption={userTitle} onChange={handleUserTitleChange} />
                                    {/* <p className="text-base	">{profile ? profile.title : ""}</p>
                                    <div className="flex justify-center items-center w-7 h-7 rounded-full cursor-pointer hover:bg-bgBlue2 transition-all duration-150 active:bg-blue2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="7" fill="none">
                                            <path
                                                fill="#000"
                                                d="M12.878.769 6.821 6.866a.453.453 0 0 1-.642 0L.122.77A.459.459 0 0 1 .446 0a.453.453 0 0 1 .318.123L6.5 5.896 12.236.123A.453.453 0 0 1 13 .449a.459.459 0 0 1-.122.32Z"
                                            />
                                        </svg>
                                    </div> */}
                                </div>
                            )}
                        </div>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-base text-black1 rounded-[10px] border border-white3">
                        <h1 className="text-[28px]	text-black1 font-semibold col-spn-1 md:col-span-2">Personal Information</h1>
                        <ResetBox
                            value={firstName}
                            onChange={onChange("firstName")}
                            id="firstName"
                            title="First Name"
                            error={firstNameError}
                            errorMessage={firstNameErrorMessage}
                        />
                        <ResetBox
                            value={lastName}
                            onChange={onChange("lastName")}
                            id="lastName"
                            title="Last Name"
                            error={lastNameError}
                            errorMessage={lastNameErrorMessage}
                        />
                        <ResetBox
                            value={username}
                            onChange={onChange("username")}
                            id="username"
                            title="Username"
                            error={usernameError}
                            errorMessage={usernameErrorMessage}
                        />
                        <ResetBox value={email} onChange={onChange("email")} id="email" title="Email" error={emailError} errorMessage={emailErrorMessage} />
                        {/* <ResetBox value={phoneNumber} onChange={onChange('phoneNumber')} id="phoneNumber" title="Phone Number" /> */}
                        <ResetBox value="Request Password Change" id="password" title="Password" confidential link={"/accounts/password/reset"} />
                        <ResetBox value="Try to delete your account?" id="withdrawal" title="Delete Account" confidential link={"/accounts/withdrawal"} />
                    </form>
                    <form className="w-full  p-6 text-black1 rounded-[10px] border border-white3">
                        <h1 className="text-[28px]	text-black1 font-semibold col-span-2">Notification</h1>
                        <CheckBox initial={notiChecked} categories={notiCategory} title="notification" />
                    </form>
                    <form className="w-full  p-6 text-black1 rounded-[10px] border border-white3">
                        <h1 className="text-[28px]	text-black1 font-semibold col-span-2">Show me on Leaderboard</h1>
                        <CheckBox initial={showMeChecked} categories={showMeCategory} title="showMe" />
                    </form>

                    <div className="w-full lg:hidden block">
                        <ButtonForProfileUpdate
                            id={"smallUpdateAccountBtn"}
                            updated={updated}
                            failed={failed}
                            handleUpdateButton={handleUpdateButton}
                            isClickable={isClickable}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </MainContent>

            <Sidebar>
                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-sm">
                        {infoDescription &&
                            infoDescription.map((i) => (
                                <div key={i.id} className=" w-full gap-5 flex flex-row rounded-[10px]	bg-white1 border border-white3 p-5">
                                    <div className="pt-1">{i.icon}</div>
                                    <div className="flex flex-col gap-1.5">
                                        <h1 className="text-black1 text-lg font-medium	">{i.title}</h1>
                                        <p className="text-black2 text-sm leading-4 break-words">{i.description}</p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* When browser screen become narrow, this button disapear from sidebar and appear on main content since it, otherwise, placed at the bottom */}
                    <div className="w-full hidden lg:block">
                        <ButtonForProfileUpdate
                            id={"largeUpdateAccountBtn"}
                            updated={updated}
                            failed={failed}
                            handleUpdateButton={handleUpdateButton}
                            isClickable={isClickable}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </Sidebar>
        </ContentBox>
    );
}

function ButtonForProfileUpdate({ id, updated, failed, handleUpdateButton, isClickable, isLoading }) {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-2">
            {/* loding effct needs */}
            {updated && (
                <p id="updateSuccessful" className="text-bgGreen1">
                    Updated successfully!
                </p>
            )}
            {failed && (
                <p id="updateFailed" className="text-bgRed1">
                    Update Failed...
                </p>
            )}
            <button
                id={id}
                onClick={handleUpdateButton}
                className={`
      w-full text-2xl font-semibold flex items-center justify-center bg-bgGreen1 text-white1 py-4 rounded-[10px] shadow-md  transition-all ease-in duration-150 active:bg-green-700
      ${!isClickable ? "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-bgGreen1 active:bg-bgGreen1" : "hover:scale-105"}
      ${isLoading && "opacity-50 cursor-not-allowed"}
      `}
                disabled={!isClickable}
            >
                {isLoading ? "\u00A0\u00A0Loading...\u00A0\u00A0" : "Update Account"}
            </button>
        </div>
    );
}
