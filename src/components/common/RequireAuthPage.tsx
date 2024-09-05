import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { useNavigate } from "react-router-dom";

const RequireAuthPage = ({
  children,
  rolePage,
}: {
  children: ReactNode;
  rolePage: (2 | 1 | 3)[];
}) => {
  const { _id, role } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigate();
  useEffect(() => {
    if (role) {
      // if (role !== rolePage && rolePage === 1) navigation("/user/dashboard");
      // if (role !== rolePage && rolePage === 2) navigation("/admin/dashboard");
      if (!rolePage.includes(role)) navigation("/");
    } else {
      navigation("/sign-in");
    }
  }, [_id, navigation, role, rolePage]);
  if (!_id) return null;
  return <>{children}</>;
};

export default RequireAuthPage;
