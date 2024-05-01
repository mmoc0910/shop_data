import classNames from "../../utils/classNames";

const Loading = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={classNames(
        "w-screen h-screen bg-[#0000002f] flex items-center justify-center fixed inset-0 z-[5000]",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full border-4 border-primary border-r-transparent animate-spin" />
    </div>
  );
};

export default Loading;
