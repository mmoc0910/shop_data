import RequireAuthPage from "../../components/common/RequireAuthPage";

const DashboardAdminPage = () => {
  return (
    <RequireAuthPage rolePage={1}>
      <div>DashboardAdminPage</div>
    </RequireAuthPage>
  );
};

export default DashboardAdminPage;
