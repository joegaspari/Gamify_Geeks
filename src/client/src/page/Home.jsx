import React from "react";
import Landing from "./Landing";
import { useAuth } from "../context/AuthContext";
import DashBoard from "./DashBoard";
import ClassOverview from "./ClassOverview";

export default function Home() {
    const { user } = useAuth();

    if (!user) {
        return <Landing />;
    }

    if (user.userRoleId == 3) {
        return <ClassOverview />;
    }

    return <DashBoard />;
}
