import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="w-full h-full flex item-center">
        <div className="w-full mx-auto h-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
