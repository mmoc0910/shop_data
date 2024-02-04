import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/LayoutUser";
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardUserPage = lazy(() => import("./pages/user/DashboardUserPage"));
const AccountPage = lazy(() => import("./pages/user/AccountPage"));
const PlanPage = lazy(() => import("./pages/user/PlanPage"));
const OrderPage = lazy(() => import("./pages/user/OrderPage"));
const InvitePage = lazy(() => import("./pages/user/InvitePage"));

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-screen h-screen">
            loading
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<LayoutUser />}>
            <Route path="/user/dashboard" element={<DashboardUserPage />} />
            <Route path="/user/account" element={<AccountPage />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/invite" element={<InvitePage />} />
          </Route>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center w-screen h-screen text-3xl font-semibold">
                404 Page Not Found
              </div>
            }
          />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
