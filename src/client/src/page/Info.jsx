import React, { useEffect, useState } from 'react';

import ContentHeader from '../components/ContentHeader';
import HelpIcon from '../components/icon/HelpIcon';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ContentBox from './ContentBox';
import { useData } from '../context/DataContext';
import InfoQuestionBox from '../components/InfoQuestionBox';


export default function Info(props) {
  const { getQuestionCategories } = useData();
  const [infoCategories, setInfoCategories] = useState(null);
  const [selectedCategory, setSelectCategory] = useState(null);

  useEffect(() => {

    getQuestionCategories()
      .then(i => {
        setInfoCategories(i);
        setSelectCategory(i[0]);

      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, [getQuestionCategories]);

  const handleClickCategory = (category) => {
    setSelectCategory(category);
  }


  return (
    <ContentBox id={'infoCenter'}>
      <MainContent styles="gap-8">
        <ContentHeader
          title="Information Center"
          subtitle="What do you need help with?"
          icons={[{ id: 1, tag: <HelpIcon /> }]}
          className="text-black-1"
          subtitleClassName="text-black-2"
          style={{ fontFamily: 'Poppins' }}
        />

        <div id={`${selectedCategory && selectedCategory.title}-questions`} className="rounded-[20px] p-base bg-white1 shadow-standard flex flex-col gap-sm">
          <h1 className="text-[28px] font-semibold">{selectedCategory && selectedCategory.title}</h1>
          {selectedCategory && selectedCategory.questions && selectedCategory.questions.map((item) => (
            <InfoQuestionBox key={item.id} item={item} />
          ))}
        </div>


      </MainContent>

      <Sidebar>
        <h1 className="text-[28px] font-semibold">Topics</h1>
        <div className="flex flex-col gap-2 ">
          {infoCategories && infoCategories.map((item, index) => (
            <div
              onClick={() => handleClickCategory(item)}
              id={`${item.title}-category`} key={item.id}
              className={`
              categoryCard flex gap-2 justify-between items-center bg-white shadow-standard p-base border border-white3 rounded-[10px]
              cursor-pointer
              hover:scale-105 transition-all duration-200 ease-in
              `}
            >
              <h1 className="text-xl">
                {item.title}
              </h1>
              <div className={`font-semibold text-base text-bgGreen1 bg-bgGreen3 p-2 rounded-[5px]`}>
                {item.questions.length}
              </div>
            </div>
          ))}

        </div>
      </Sidebar>
    </ContentBox>
  );
}
