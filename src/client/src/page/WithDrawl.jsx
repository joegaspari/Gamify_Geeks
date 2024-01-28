import React, { useState } from "react";
import ContentBox from "./ContentBox";
import MainContent from "./MainContent";
import ContentHeader from "../components/ContentHeader";
import HelpIcon from "../components/icon/HelpIcon";
import Sidebar from "./Sidebar";
import ResetBox from "../components/InputBox/ResetBox";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const regex = {
    username: /^[a-zA-Z0-9._-]{1,20}$/,
};

const errorMessages = {
    username: "Username can only contain up to 20 characters including alphanumeric characters, periods, underscores, and hyphens.",
};

const WithDrawl = (props) => {
    const navigate = useNavigate();

    const { profile, discardData } = useProfile();
    const { deleteAccount, logout } = useAuth();

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

    const handleChangeUsername = (value) => {
        setUsername(value);
        setUsernameError(false);
        setUsernameErrorMessage("");
    };

    const handleDeleteAccount = () => {
        if (!regex.username.test(username)) {
            setUsernameError(true);
            setUsernameErrorMessage(errorMessages.username);
            return;
        }

        if (username !== profile.username) {
            setUsernameError(true);
            setUsernameErrorMessage("Username does not match");
            return;
        }
        console.log("delete account");
        // deleteAccount()
        //     .then(() => {
        //         discardData();
        //         window.location.href = "/accounts/login";
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
    };

    return (
        <ContentBox id={"withDrawlPage"}>
            <MainContent styles="gap-8">
                <ContentHeader title="Delete Account" subtitle="I am sorry to see you go.." icons={[{ id: 1, tag: <HelpIcon /> }]} />
                <div className="flex flex-col gap-base">
                    <h1 className="text-[28px] font-semibold">Are you sure you want to delete your account?</h1>
                    <div className="bg-white1 rounded-lg p-base flex flex-col gap-base shadow-md">
                        <p className="text-[18px]">This action cannot be undone.</p>
                        <p className="text-[18px]">Type your username to delete your account</p>
                        <ResetBox
                            value={username}
                            onChange={handleChangeUsername}
                            id="username"
                            title="Username"
                            error={usernameError}
                            errorMessage={usernameErrorMessage}
                        />
                        <button
                            className={`bg-red-500 text-white1 rounded-[20px] px-5 py-2
                        hover:bg-red-400 transition-all ease-in duration-150 active:bg-red-600
                        `}
                            onClick={handleDeleteAccount}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </MainContent>

            <Sidebar></Sidebar>
        </ContentBox>
    );
};

export default WithDrawl;
