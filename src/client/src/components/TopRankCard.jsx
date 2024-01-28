import React from 'react';

const colors = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

const contrastColors = {
  gold: '#B8860B', // DarkGold
  silver: '#808080', // Gray
  bronze: '#8B4513', // SaddleBrown
};

export default function TopRankCard({ items, title }) {
  const styleItem = 'flex items-center p-2 w-full justify-center cursor-pointer shadow-standard hover:shadow-lg hover:text-2xl hover:scale-105 transition-all duration-150';

  return (
    <div className="mb-5 mt-16 flex flex-row justify-evenly items-center rounded-xl text-center h-16 bg-white1 shadow-standard ">
      <h1 className="lg:text-3xl font-semibold w-4/12 p-sm flex items-center justify-start">
        {title}
      </h1>
      {/* <ol className="flex flex-row justify-evenly w-8/12 lg:text-xl text-center h-full">

                {items && items.map(i =>
                    <li key={i.id} className={styleItem}>{i.title}</li>
                )}
            </ol> */}
      <div className="flex justify-center items-end h-full text-xl w-8/12 mb-2">
        <div className="h-[170%]   w-full">
          <p className={`
                    h-2/5  flex justify-center items-end
                    hover:scale-110 hover:-translate-y-1 
                    hover:text-2xl 
                    transition-all duration-200
                    cursor-pointer
                    `}
          >
            {items && items.length > 1 ? items[1].name : ''}
          </p>
          <div
            className="h-3/5 bg-bgBlue2 rounded-xl rounded-e-none flex justify-center items-start pt-2 "
            style={{ backgroundColor: colors.silver }}
          >
            <p
              className="text-white1  p-1 px-3 rounded-full shadow-inner"
              style={{ textShadow: '2px 2px 1px rgba(0, 0, 0, 0.5)', backgroundColor: contrastColors.silver }}
            >
              <span className="text-3xl  font-semibold">
                2
              </span>
              nd
            </p>
          </div>
        </div>

        <div className="h-[230%]   w-full">
          <p className={`
                    h-2/5  flex justify-center items-end
                    hover:scale-110 hover:-translate-y-1 
                    hover:text-2xl 
                    transition-all duration-200
                    cursor-pointer
                    `}
          >
            {items && items.length > 0 ? items[0].name : ''}
          </p>
          <div
            className="h-3/5 bg-bgBlue2 rounded-xl rounded-b-none flex justify-center items-start pt-2 "
            style={{ backgroundColor: colors.gold }}
          >
            <p
              className="text-white1 p-1 px-3 rounded-full shadow-inner"
              style={{ textShadow: '2px 2px 1px rgba(0, 0, 0, 0.5)', backgroundColor: contrastColors.gold }}
            >
              <span className="text-3xl  font-semibold">
                1
              </span>
              st
            </p>
          </div>
        </div>

        <div className="h-[120%]   w-full">
          <p className={`
                    h-2/5  flex justify-center items-end
                    hover:scale-110 hover:-translate-y-1 
                    hover:text-2xl 
                    transition-all duration-200
                    cursor-pointer
                    `}
          >
            {items && items.length > 2 ? items[2].name : ''}
          </p>
          <div
            className="h-3/5 bg-bgBlue2 rounded-xl rounded-s-none flex justify-center items-start"
            style={{ backgroundColor: colors.bronze }}
          >
            <p
              className="text-white1 p-1 px-3 rounded-full shadow-inner"
              style={{ textShadow: '2px 2px 1px rgba(0, 0, 0, 0.5)', backgroundColor: contrastColors.bronze }}
            >
              <span className="text-3xl  font-semibold">
                3
              </span>
              rd
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
