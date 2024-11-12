import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/LayoutUser";
import LayoutAdmin from "./layouts/LayoutAdmin";
import "./i18n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/configureStore";
import { useTranslation } from "react-i18next";
import { setCommision } from "./store/commision/commisionSlice";
import { setCollab } from "./store/collab/collabSlice";
import { setSatify } from "./store/satisfy/satisfySlice";
import { api } from "./api";
import { CollabType, CommisionType, SatisfyType } from "./type";
import ListKeyAdminPage from "./pages/admin/ListKeyAdminPage";
import { CloudAdminPage } from "./pages/admin/CloudAdminPage";
import { CloudDetailAdminPage } from "./pages/admin/CloudDetailAdminPage";
const RechargePage = lazy(() => import("./pages/user/RechargePage"));
const AccountDetailPage = lazy(() => import("./pages/admin/AccountDetailPage"));
const CashPage = lazy(() => import("./pages/user/CashPage"));
const FogotPassword = lazy(() => import("./pages/FogotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PackPage = lazy(() => import("./pages/admin/PackPage"));
const ActionPackPage = lazy(() => import("./pages/admin/ActionPackPage"));
const AccountAdminPage = lazy(() => import("./pages/admin/AccountAdminPage"));
const ServerAdminPage = lazy(() => import("./pages/admin/ServerAdminPage"));
const ServerDetailAdminPage = lazy(
  () => import("./pages/admin/ServerDetailAdminPage")
);
const KeyAdminPage = lazy(() => import("./pages/admin/KeyAdminPage"));
const CashAdminPage = lazy(() => import("./pages/admin/CashAdminPage"));
const CommisionAdminPage = lazy(
  () => import("./pages/admin/CommisionAdminPage")
);
const ExtendPlanPage = lazy(() => import("./pages/admin/ExtendPlanPage"));
const TransactionPage = lazy(() => import("./pages/user/TransactionPage"));
const DashboardAdminPage = lazy(
  () => import("./pages/admin/DashboardAdminPage")
);
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
// const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardUserPage = lazy(() => import("./pages/user/DashboardUserPage"));
const AccountPage = lazy(() => import("./pages/user/AccountPage"));
const PlanPage = lazy(() => import("./pages/user/PlanPage"));
const OrderPage = lazy(() => import("./pages/user/OrderPage"));
const InvitePage = lazy(() => import("./pages/user/InvitePage"));
const AndroidGuidePost = lazy(
  () => import("./pages/user/post/AndroidGuidePost")
);
const TiTokIphoneGuide = lazy(
  () => import("./pages/user/post/TiTokIphoneGuide")
);
const QuestionPost = lazy(() => import("./pages/user/post/QuestionPost"));
const KeyDetailAdminPage = lazy(
  () => import("./pages/admin/KeyDetailAdminPage")
);

function App() {
  const lang = useSelector((state: RootState) => state.lang);
  const { _id } = useSelector((state: RootState) => state.auth);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (_id)
        try {
          const [
            { data: dataSatify },
            { data: dataCommision },
            { data: dataCollab },
          ] = await Promise.all([
            api.get<SatisfyType>(`/satisfy/${_id}`),
            api.get<CommisionType>("/commisions"),
            api.get<CollabType>("/collab"),
          ]);
          dispatch(
            setSatify({
              cash: dataSatify.cash[0]?.money || 0,
              rose: dataSatify.rose[0]?.money || 0,
              currentMoney: dataSatify.currentMoney,
              numberIntoduce: dataSatify.numberIntoduce,
              transaction: dataSatify.transaction[0]?.money || 0,
              discount: dataSatify.discount[0]?.totalAdjustedMoney || 0,
            })
          );
          dispatch(
            setCommision({ value: dataCommision.value, min: dataCommision.min })
          );
          dispatch(
            setCollab({
              level1: dataCollab.level1,
              level2: dataCollab.level2,
              level3: dataCollab.level3,
              minLevel1: dataCollab.minLevel1,
              minLevel2: dataCollab.minLevel2,
              minLevel3: dataCollab.minLevel3,
            })
          );
        } catch (error) {
          console.log("error - ", error);
        }
    })();
  }, [_id, dispatch]);
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);
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
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route element={<LayoutAdmin />}>
            <Route path="/admin/dashboard" element={<DashboardAdminPage />} />
            <Route path="/admin/pack" element={<PackPage />} />
            <Route path="admin/pack/extend-plan" element={<ExtendPlanPage />} />
            <Route path="/admin/pack/add" element={<ActionPackPage />} />
            <Route
              path="/admin/pack/edit/:packId"
              element={<ActionPackPage />}
            />
            <Route path="/admin/account" element={<AccountAdminPage />} />
            <Route
              path="/admin/account/:accountId"
              element={<AccountDetailPage />}
            />
            <Route path="/admin/server" element={<ServerAdminPage />} />
            <Route path="/admin/key/:keyId" element={<KeyDetailAdminPage />} />
            <Route
              path="/admin/server/:serverId"
              element={<ServerDetailAdminPage />}
            />
            <Route path="/admin/key" element={<KeyAdminPage />} />
            <Route path="/admin/list-key" element={<ListKeyAdminPage />} />
            <Route path="/admin/cash" element={<CashAdminPage />} />
            <Route path="/admin/commision" element={<CommisionAdminPage />} />
            <Route path="/admin/cloud" element={<CloudAdminPage />} />
            <Route
              path="/admin/cloud/:cloudId"
              element={<CloudDetailAdminPage />}
            />
          </Route>
          <Route element={<LayoutUser />}>
            <Route path="/user/dashboard" element={<DashboardUserPage />} />
            <Route path="/user/account" element={<AccountPage />} />
            <Route path="/user/plan" element={<PlanPage />} />
            <Route path="/user/order" element={<OrderPage />} />
            <Route path="/user/invite" element={<InvitePage />} />
            <Route path="/user/transaction" element={<TransactionPage />} />
            <Route path="/user/cash" element={<CashPage />} />
            <Route path="/user/recharge" element={<RechargePage />} />
            <Route
              path="/user/dashboard/post/android-vi_outline-phone-guide"
              element={<AndroidGuidePost />}
            />
            <Route
              path="/user/dashboard/post/tiktok-iphone-guide"
              element={<TiTokIphoneGuide />}
            />
            <Route
              path="/user/dashboard/post/questions"
              element={<QuestionPost />}
            />
          </Route>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<FogotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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
