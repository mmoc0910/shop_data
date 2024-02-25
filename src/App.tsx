import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/LayoutUser";
import LayoutAdmin from "./layouts/LayoutAdmin";
import PackPage from "./pages/admin/PackPage";
import ActionPackPage from "./pages/admin/ActionPackPage";
import AccountAdminPage from "./pages/admin/AccountAdminPage";
import ServerAdminPage from "./pages/admin/ServerAdminPage";
import ServerDetailAdminPage from "./pages/admin/ServerDetailAdminPage";
import KeyAdminPage from "./pages/admin/KeyAdminPage";
import CashAdminPage from "./pages/admin/CashAdminPage";
import CommisionAdminPage from "./pages/admin/CommisionAdminPage";
import ExtendPlanPage from "./pages/admin/ExtendPlanPage";
import DashboardAdminPage from "./pages/admin/DashboardAdminPage";
import { useSelector } from "react-redux";
import { RootState } from "./store/configureStore";
import TransactionPage from "./pages/user/TransactionPage";
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardUserPage = lazy(() => import("./pages/user/DashboardUserPage"));
const AccountPage = lazy(() => import("./pages/user/AccountPage"));
const PlanPage = lazy(() => import("./pages/user/PlanPage"));
const OrderPage = lazy(() => import("./pages/user/OrderPage"));
const InvitePage = lazy(() => import("./pages/user/InvitePage"));

function App() {
  const { _id, role } = useSelector((state: RootState) => state.auth);
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
          {_id ? (
            <>
              {role === 1 ? (
                <Route element={<LayoutAdmin />}>
                  <Route
                    path="/admin/dashboard"
                    element={<DashboardAdminPage />}
                  />
                  <Route path="/admin/pack" element={<PackPage />} />
                  <Route
                    path="admin/extend-plan"
                    element={<ExtendPlanPage />}
                  />
                  <Route path="/admin/pack/add" element={<ActionPackPage />} />
                  <Route
                    path="/admin/pack/edit/:packId"
                    element={<ActionPackPage />}
                  />
                  <Route path="/admin/account" element={<AccountAdminPage />} />
                  <Route path="/admin/server" element={<ServerAdminPage />} />
                  <Route
                    path="/admin/server/:serverId"
                    element={<ServerDetailAdminPage />}
                  />
                  <Route path="/admin/key" element={<KeyAdminPage />} />
                  <Route path="/admin/cash" element={<CashAdminPage />} />
                  <Route
                    path="/admin/commision"
                    element={<CommisionAdminPage />}
                  />
                </Route>
              ) : null}
              {role === 2 ? (
                <Route element={<LayoutUser />}>
                  <Route
                    path="/user/dashboard"
                    element={<DashboardUserPage />}
                  />
                  <Route path="/user/account" element={<AccountPage />} />
                  <Route path="user/plan" element={<PlanPage />} />
                  <Route path="user/order" element={<OrderPage />} />
                  <Route path="user/invite" element={<InvitePage />} />
                  <Route
                    path="user/transaction"
                    element={<TransactionPage />}
                  />
                </Route>
              ) : null}
            </>
          ) : (
            <>
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
            </>
          )}

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
