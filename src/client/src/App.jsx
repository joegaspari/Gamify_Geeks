import React, { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useLocation } from "react-router-dom";
import { useData } from "./context/DataContext";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import Tooltip from "./components/Tooltip";
import { useHelpMode } from "./context/HelpModeContext";
import { useToggle } from "./hook/useToggle";
import MenuIcon from "./components/icon/MenuIcon";
import { usePopup } from "./context/PopupContext";
import LandingNavbar from "./components/LandingNavbar";
import TooltipItems from "./components/TooltipItems";
import { useProfile } from "./context/ProfileContext";

const queryClient = new QueryClient();

function App(props) {
  const { getTooltipItems } = useData();
  const [tooltipItems, setTooltipItems] = useState(null);
  const { isHelpModeActive } = useHelpMode();

  useEffect(() => {
    getTooltipItems().then((i) => setTooltipItems(i));
  }, [getTooltipItems]);

  /// /////////////////////////////////////////////
  //  Below Code Work for logout pop up
  /// ///////////////////////////////////////////////
  const { popups, closePopup } = usePopup();

  const { user, logout } = useAuth();
  const { discardData } = useProfile();

  const onLogOut = () => {
    logout();
    discardData();
    closePopup("logOutButton");
  };

  /// //////////////////////////////////////////////////////////////

  /// /////////////////////////////////////////////////////////////
  // Below Code Work for Navbar function
  /// ///////////////////////////////////////////////////////////////

  const [isToggled, toggle] = useToggle(false);

  const location = useLocation();
  useEffect(() => {
    isToggled && toggle();
  }, [location]);

  //when user opened navbar and clicked outside of the navbar, then close the navbar
  const [isCoursesPopupOpen, setIsCoursesPopupOpen] = useState(false);
  const handleCoursePopupOpen = (value) => {
    setIsCoursesPopupOpen(value);
  };

  const navbarRef = useRef(null);
  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (isCoursesPopupOpen) return;

      if (!navbarRef.current || navbarRef.current.contains(event.target)) {
        return;
      }
      isToggled && toggle();
    };

    window.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      window.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [toggle, isCoursesPopupOpen]);

  //When navbar is opened with toggle, then to focus on the navbar, block user to scroll other content
  useEffect(() => {
    const mainContent = document.getElementById("mainContent");
    const sideContent = document.getElementById("sideContent");

    if (isToggled) {
      if (mainContent) {
        mainContent.style.overflow = "hidden";
      }
      if (sideContent) {
        sideContent.style.overflow = "hidden";
      }
    } else {
      if (mainContent) {
        mainContent.style.overflow = "auto";
      }
      if (sideContent) {
        sideContent.style.overflow = "auto";
      }
    }

    // Clean up function
    return () => {
      if (mainContent) {
        mainContent.style.overflow = "auto";
      }
      if (sideContent) {
        sideContent.style.overflow = "auto";
      }
    };
  }, [toggle]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    const mainContent = document.getElementById("mainContent");
    const sideContent = document.getElementById("sideContent");

    const resizeDebounced = debounce(handleResize, 250);

    window.addEventListener("resize", resizeDebounced);

    if (windowWidth >= 1280 || !isToggled) {
      if (mainContent) {
        mainContent.style.overflow = "auto";
      }
      if (sideContent) {
        sideContent.style.overflow = "auto";
      }

      isToggled && toggle();
    } else {
      if (mainContent) {
        mainContent.style.overflow = "hidden";
      }
      if (sideContent) {
        sideContent.style.overflow = "hidden";
      }
    }

    return () => {
      window.removeEventListener("resize", resizeDebounced);

      if (mainContent) {
        mainContent.style.overflow = "";
      }
      if (sideContent) {
        sideContent.style.overflow = "";
      }
    };
  }, [toggle, windowWidth]);

  // ...

  const debounce = useCallback((func, delay) => {
    let timerId;
    return (...args) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func(...args);
        timerId = null;
      }, delay);
    };
  }, []);

  /// ///////////////////////////////////////////////////////////////////////////////

  /// /////////////////////////////////////////////////////////////////////

  // Render Components
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <div className={` bg-beige1 overflow-hidden ${isHelpModeActive && "overlay"}`} style={{ fontfamily: "Poppins" }}>
          <div
            className={`
            relative 
            ${
              user &&
              `flex flex-row  h-screen 
            `
            }`}
          >
            {/* <div className="absolute w-full h-full border-2 border-black z-[3]"></div> */}

            {user ? (
              <>
                <header
                  data-tooltip-id="sidebar-tooltip"
                  className={`
                        ${!isToggled && "hidden"} 
                        ${isHelpModeActive && "hasHelp"}
                                
                        overflow-y-scroll scroll-hidden
                        xl:block
                        xl:sticky xl:top-0
                        absolute z-[51]
                        
                        min-w-[300px] h-full
                        
                        bg-blue1 text-white1
                        `}
                >
                  <Navbar handleClose={toggle} navbarRef={navbarRef} handleCoursePopupOpen={handleCoursePopupOpen} />
                </header>
                {tooltipItems && <Tooltip id="sidebar" tooltip={<TooltipItems items={tooltipItems.sidebar} />} forHelpMode />}
              </>
            ) : (
              <header>
                <LandingNavbar />
              </header>
            )}

            <div id="mainContent" className={`${user && " w-full h-screen bg-offWhite2 overflow-y-scroll"} `}>
              {user && (
                <div
                  className={`
                          xl:hidden
                          sticky top-0 z-[1]
                          w-full h-16
                          bg-blue1 text-white1
                          flex flex-row items-center
                          px-2
                        `}
                >
                  <button
                    onClick={toggle}
                    className={`
                          flex justify-center items-cente
                          p-0.5 m-1
                          rounded-lg 
                          hover:bg-bgBlue1 hover:scale-110
                          transition-all duration-150
                          `}
                  >
                    <MenuIcon />
                  </button>
                </div>
              )}

              <div>
                <Outlet />
              </div>
            </div>
          </div>

          {popups.logOutButton && (
            <div
              id="logOutOverlay"
              onClick={() => closePopup("logOutButton")}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
              <div
                id="logOutPopup-container"
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 px-10 rounded-xl shadow-2xl flex flex-col gap-5 justify-center items-center"
              >
                <p className="text-2xl text-black1 font-extrabold">Log Out?</p>
                <button
                  id="onLogOut"
                  onClick={(e) => onLogOut()}
                  className="text-base text-white1 bg-bgGreen1 px-16 py-3 rounded-lg font-semibold active:bg-green-800 hover:scale-110 transition-all duration-150"
                >
                  Yes, Log Me Out
                </button>
                <button
                  id="cancelLogOut"
                  onClick={() => closePopup("logOutButton")}
                  className="text-sm text-black2 font-semibold hover:bg-white3 px-10 py-1 rounded-lg transition-all duration-150 hover:scale-110 active:bg-gray-700"
                >
                  No, Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
