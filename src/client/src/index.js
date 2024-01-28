import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import TokenStorage from './db/token';
import HttpClient from './network/http';
import MockDataService from './service/mockData.js';
import AuthService from './service/auth';
import { AuthErrorEventBus, AuthProvider } from './context/AuthContext';
import NotFound from './page/NotFound';
import ProtectedRoute from './page/ProtectedRoute';
import Home from './page/Home';
import DashBoard from './page/DashBoard';
import Login from './page/Login';
import ResetPassword from './page/ResetPassword';
import Account from './page/Account';
import { DataProvider } from './context/DataContext';
import Explore from './page/Explore';
import Question from './page/Question';
import Analytics from './page/Analytics';
import Info from './page/Info';
import ModulesContainer from './page/ModulesContainer';
import Providers from './page/Providers';
import LoginContainer from './page/LoginContainer';
import DataService from './service/data';
import StudentsContainer from './page/StudentsContainer';
import Signup from './page/Signup';
import Help from './page/Help';
import ClassOverview from './page/ClassOverview';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WithDrawl from './page/WithDrawl';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080';
const tokenStorage = new TokenStorage();
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL, authErrorEventBus);
const mockDataService = new MockDataService(httpClient, tokenStorage);
const dataService = new DataService(httpClient, tokenStorage);
const authService = new AuthService(httpClient, tokenStorage);


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        path: '/',
        element: <Home />,

      },
      {
        path: '/help',
        element: <Help />,
      },
      {
        path: '/dashboard',
        children: [
          {
            index: true,
            path: '/dashboard',
            element: (
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/students/:studentId',
            element: (
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            )
          }
        ]
      },
      {
        path: '/classOverview',
        element:
          (
            <ProtectedRoute>
              <ClassOverview />
            </ProtectedRoute>
          ),
      },

      {
        path: '/explore',
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            path: '/explore',
            element: (
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            ),
          },
          {
            path: '/explore/question/:topicId',
            element: (
              <ProtectedRoute>
                <Question />
              </ProtectedRoute>
            ),
          },
        ],
      },

      {
        path: '/class/:classId',
        errorElement: <NotFound />,
        children: [
          {
            path: '/class/:classId/modules',
            element: (
              <ProtectedRoute>
                <ModulesContainer />
              </ProtectedRoute>
            ),

          },
          {
            path: '/class/:classId/students',
            element: (
              <ProtectedRoute>
                <StudentsContainer />
              </ProtectedRoute>
            ),
          },
          {
            path: '/class/:classId/analytics',
            element: (
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            ),
          },
          {
            path: '/class/:classId/analytics/:studentId',
            element: (
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            )
          },
          {
            path: '/class/:classId',
            element: <NotFound />,
          }

        ],
      },

      {
        path: '/accounts',
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            path: '/accounts',
            element:
              (
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              ),
          },
          {
            path: '/accounts/login',
            element:
              (
                <LoginContainer>
                  <Login />
                </LoginContainer>
              ),
          },
          {
            path: '/accounts/signup',
            element:
              (
                <LoginContainer>
                  <Signup />
                </LoginContainer>
              ),
          },
          {
            path: '/accounts/password/reset',
            element: (
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            ),
          },
          {
            path: '/accounts/withdrawal',
            element: (
              <ProtectedRoute>
                <WithDrawl />
              </ProtectedRoute>
            ),
          },

        ],
      },

      {
        path: '/info',
        element:
          (
            <ProtectedRoute>
              <Info />
            </ProtectedRoute>
          ),
      },

      {
        path: '/setting',
        element:
          (
            <ProtectedRoute>
              <Info />
            </ProtectedRoute>
          ),
      },

    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider
      authService={authService}
      authErrorEventBus={authErrorEventBus}
    >
      <DataProvider
        mockDataService={mockDataService}
        dataService={dataService}
      >
        <Providers>
          <RouterProvider router={router} />
          <ToastContainer />
        </Providers>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



