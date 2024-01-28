import React, { createContext, useState, useContext, useMemo, useEffect } from "react";
import { useData } from "./DataContext";
import { useLoading } from "../hook/useLoading";
import { useAuth } from "./AuthContext";

const imageUrls = [
  "data:image/jpeg;base64,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",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3NdS5tXnPRWtZbLGtuagKWphUYHHbq3K4pw&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRwkCYt_O1nSklYssElNwJ3q6gfU02iUPFxg&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRForYSfhEDE0TB5ugx734-uuHSdzoQU1MFLg&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS71HOoAeaPsLFtpcW8tka5P22fJnd17NvePQ&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRstL3ZNZRxIqh0TBG5UsHJKjEV-YA92A3p9w&usqp=CAU",
];

function getRandomImageUrl() {
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
}

export const ProfileContext = createContext({});

export function ProfileProvider({ children }) {
  const defaultImg = getRandomImageUrl();

  const { isLoading, stopLoading, loadingComponent } = useLoading({ initialValue: true });
  const { getProfile, getClasses } = useData();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [courses, setCourses] = useState([]);

  //need coursesForPopup to be a separate state because courseForPopup needs to be filtered by search
  const [coursesForPopup, setCoursesForPopup] = useState([]);
  const [isValidClass, setIsValidClass] = useState(false);

  const [mainCourse, setMainCourse] = useState(null);

  useEffect(() => {
    if (courses.length == 0) return;

    const storedMainCourseId = localStorage.getItem("mainCourseId");
    if (storedMainCourseId) {
      const course = courses.find((i) => i.classId == storedMainCourseId);
      setMainCourse(course ? course : courses[0]);
    } else {
      setMainCourse(courses[0]);
    }
  }, [courses]);

  const updateProfile = (value) => {
    setProfile(value);
  };

  const updateClassesForPopup = async () => {
    getClasses("").then((i) => {
      setCoursesForPopup(i);
      setCourses(i);
    });
  };

  const searchClasses = async (search) => {
    getClasses(search).then((i) => setCoursesForPopup(i));
  };

  const updateClasses = (value) => {
    setCourses(value);
    setCoursesForPopup(value);
  };

  const discardData = () => {
    setProfile(null);
    setCourses([]);
    setCoursesForPopup([]);
    setMainCourse(null);
    setIsValidClass(false);
  };

  const updateMainCourse = (course) => {
    localStorage.setItem("mainCourseId", course.classId);
    setMainCourse(course);
  };

  const path = window.location.pathname;
  const pathParts = path.split("/");

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await getProfile();
      // setProfile(profileData);
      setProfile({ ...profileData, profileImg: defaultImg });

      const classesData = await getClasses();
      setCourses(classesData);
      setCoursesForPopup(classesData);

      if (pathParts[1] === "class" && classesData) {
        const classId = pathParts[2];
        const valid = classesData.some((i) => i.classId === Number(classId));
        setIsValidClass(valid);
      } else {
        setIsValidClass(true);
      }

      stopLoading();
    };

    if (user) {
      fetchData();
    } else {
      stopLoading();
    }
  }, [getProfile, getClasses, user]);

  const context = useMemo(
    () => ({
      profile,
      courses,
      coursesForPopup,
      mainCourse,
      updateClasses,
      updateMainCourse,
      updateProfile,
      discardData,
      updateClassesForPopup,
      searchClasses,
      isValidClass,
    }),
    [
      profile,
      courses,
      coursesForPopup,
      mainCourse,
      updateClasses,
      updateMainCourse,
      updateProfile,
      discardData,
      updateClassesForPopup,
      searchClasses,
      isValidClass,
    ]
  );

  if (isLoading) {
    return loadingComponent;
  }

  return <ProfileContext.Provider value={context}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);
