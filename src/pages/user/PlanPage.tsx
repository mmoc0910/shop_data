import { useEffect, useState } from "react";
import { PricingItem } from "../../components/home/PricingBox";
import { PlanType } from "../../type";
import { api } from "../../api";
import { v4 as uuidv4 } from "uuid";
import RequireAuthPage from "../../components/common/RequireAuthPage";

const PlanPage = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<PlanType[]>("/plans");
        setPlans(result.data.filter((item) => item.status === 1).sort((a, b) => b.numberPurchase - a.numberPurchase));
      } catch (error) {
        console.log("error - ", error);
      }
    })();
  }, []);
  if (plans.length > 0)
    return (
      <RequireAuthPage rolePage={[2]}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9 w-full px-5">
          {plans.map((plan) => (
            <PricingItem key={uuidv4()} plan={plan} />
          ))}
        </div>
      </RequireAuthPage>
    );
};

export default PlanPage;
