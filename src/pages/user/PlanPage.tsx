import { useEffect, useState } from "react";
import { PricingItem } from "../../components/home/PricingBox";
import { PlanType } from "../../type";
import { api } from "../../api";
import { v4 as uuidv4 } from "uuid";

const PlanPage = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/plans");
        setPlans(result.data);
      } catch (error) {
        console.log("error - ", error);
      }
    })();
  }, []);
  if (plans.length > 0)
    return (
      <div className="grid grid-cols-3 gap-9 w-full px-5">
        {plans.map((plan) => (
          <PricingItem key={uuidv4()} plan={plan} />
        ))}
      </div>
    );
};

export default PlanPage;
