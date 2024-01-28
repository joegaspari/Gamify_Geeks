import React, { useEffect, useState } from "react";

import ContentHeader from "../components/ContentHeader";
import HelpIcon from "../components/icon/HelpIcon";
import MainContent from "./MainContent";
import ContentBox from "./ContentBox";
import { useData } from "../context/DataContext";
import InfoQuestionBox from "../components/InfoQuestionBox";

import userManual from "../data/userManual.json";

export default function Info(props) {
    const { getInfoQuestion, getInfoCategories } = useData();

    const [infoCategories, setInfoCategories] = useState(null);
    const [infoQuestion, setInfoQuestion] = useState(userManual);
    const [categoryIndex, setCategoryIndex] = useState(0);

    return (
        <ContentBox id={"help"}>
            <MainContent styles="gap-8">
                <ContentHeader
                    title="Tutorial Guide"
                    subtitle="New to Gamify-geeks? Don't worry we have got you covered!"
                    icons={[{ id: 1, tag: <HelpIcon /> }]}
                    className="text-black-1"
                    subtitleClassName="text-black-2"
                    style={{ fontFamily: "Poppins" }}
                />

                <div className="rounded-[20px] p-base bg-white1 shadow-standard flex flex-col gap-sm">
                    {userManual && userManual.map((item) => <InfoQuestionBox key={item.id} item={item} />)}
                </div>
            </MainContent>
        </ContentBox>
    );
}
