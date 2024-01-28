import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import HexagonImage from './HexagonImage/HexagonImage';
import Searchbar from './InputBox/Searchbar';
import RenewIcon from './icon/RenewIcon';
import { useProfile } from '../context/ProfileContext';

export default function StudentsTable({ rowOnClick, selectedId }) {
  const { getStudents } = useData();
  const { mainCourse } = useProfile();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!mainCourse) {
      return
    }

    getStudents({ classId: mainCourse.classId, search })
      .then((i) => {
        setStudents(i)
      });
  }, [getStudents, mainCourse, search]);

  const [students, setStudents] = useState([]);



  const onSearchChange = (search) => {
    setSearch(search);
  };


  const handleRowOnClick = (student) => {
    if (rowOnClick) {
      rowOnClick(student)
    }
  }


  return (
    <>
      <div className="px-base pt-base flex justify-between items-center bg-offWhite2 rounded-t-[20px] mb-base">
        <h1 className="font-medium text-xl	text-black1">{students ? students.length : 0} Class Students Found</h1>
        <div className="flex gap-4 items-center">
          <div className="rounded-lg bg-white1 shadow-standard aspect-square h-9 flex justify-center items-center border border-white3">
            <RenewIcon />
          </div>
          <Searchbar title="Students" search={search} onSearchChange={onSearchChange} size="small" placeholder="Search a Student" showLabel={false} />
        </div>
      </div>
      <div className="flex flex-col grow overflow-hidden bg-white1">
        <div className="flex flex-col h-full pb-base">
          <div className='h-full scroll-hidden overflow-y-scroll grow bg-white1'>
            <table className="w-full text-base text-center align-baseline relative border-collapse bg-white1">
              <thead>
                <tr className="px-base w-full bg-offWhite2 sticky top-0 z-50 h-[32px]">
                  <th className="font-normal text-start pl-base p-0 pb-2">User</th>
                  <th className="font-normal text-start p-0 pb-2">Complete | Attempted | Hasn't Started</th>
                  <th className="font-normal text-center pr-base p-0 pb-2">Study Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='bg-white3 h-[1px] z-50 sticky top-[32px]' colSpan={3}></td>
                </tr>
                <tr>
                  <td className='bg-white1 h-2 z-50 sticky top-[34px]' colSpan={3}></td>
                </tr>
                {
                  students && students.map((student) => (
                    <tr key={student.id} onClick={() => handleRowOnClick(student)}
                      className={`
                    w-full text-base bg-white1
                    ${student.id == selectedId ? 'bg-bgBlue3' : 'bg-white1 hover:bg-bgBlue2 active:bg-blue-400'}
            
                    transition-all ease-out duration-200
                    cursor-pointer
                    `}
                    >

                      <td className="pl-base font-medium flex justify-start items-center gap-4 py-2">
                        <HexagonImage profileImg={student.img ? student.img : 'https://via.placeholder.com/40'} resize={1 / 2} />
                        <p>{student.name}</p>
                      </td>
                      <td className="w-7/12 ">
                        <div className="flex gap-6 items-center w-full">
                          <div className="flex gap-1 w-full h-3">
                            <div className="w-5 bg-bgGreen1 rounded-full" style={{ width: `${student.completed}%` }} />
                            <div className="w-5 bg-bgBlue1 rounded-full" style={{ width: `${student.attempted}%` }} />
                            <div className="w-5 bg-bgRed1 rounded-full" style={{ width: `${student.unAttempted}%` }} />
                          </div>
                          <div className="flex text-black1 after:text-black1">
                            <p className="after:content-['|'] after:px-1">
                              {`${student.completed}%`}
                            </p>
                            <p className="after:content-['|'] after:px-1">
                              {`${student.attempted}%`}
                            </p>
                            <p className="">
                              {`${student.unAttempted}%`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="pr-base">{student.studyTime}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </>
  );
}
