import Header from "../components/header/Header";
import HomeBox from "../components/home/HomeBox";
import RegisterBox from "../components/home/RegisterBox";
import CTVBox from "../components/home/CTVBox";
import AboutBox from "../components/home/AboutBox";
import PricingBox from "../components/home/PricingBox";

const HomePage = () => {

  return (
    <div>
      <Header />
      <div className="">
        <HomeBox />
        <PricingBox />
        <RegisterBox />
        <div
          className="text-white bg-cover bg-center relative"
          style={{
            background:
              "url('https://images.unsplash.com/photo-1544207916-df3b3a131e35?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover",
          }}
        >
          <div className="absolute inset-0 bg-[#000000ae]" />
          <div className="relative z-10 py-10">
            <CTVBox />
            <AboutBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
