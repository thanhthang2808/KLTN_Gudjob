import { Outlet } from "react-router-dom";
import backgroundImage from "@/assets/welcome-bg.jpg"; // Thay đổi đường dẫn cho phù hợp

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Left Side - Welcome Section */}
      <div
        className="hidden lg:flex items-center justify-center bg-cover bg-center w-1/2 px-12"
        style={{ backgroundImage: `url(${backgroundImage})` }} // Sử dụng hình ảnh đã import
      >
        <div className="max-w-md space-y-6 text-center text-white bg-black bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to Gudjob!
          </h1>
          <p className="text-lg leading-relaxed mt-4">
            Your journey to a better career starts here. Join us and find the
            best opportunities tailored just for you.
          </p>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 shadow-lg">
        <div className="w-full max-w-md space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
