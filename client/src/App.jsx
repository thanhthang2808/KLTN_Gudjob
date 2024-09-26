import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminTransactions from "./pages/admin-view/transactions";
import UserLayout from "./components/user-view/layout";
import NotFound from "./pages/not-found";
import UserHome from "./pages/user-view/home";
import UserAccount from "./pages/user-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "./components/ui/skeleton";
import Info from "./pages/user-view/info";
import AdminUsers from "./pages/admin-view/dashboard";
function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-full h-full" />
  ;

  return (
    <div className="flex flex-col max-h-screen w-screen overflow-hidden bg-white">
      

      {/* Main Content */}
      <main className="flex flex-1 w-full">
        <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />
          {/* Auth Layout */}
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          {/* Admin Layout */}
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route
            path="/user"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <UserLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<UserHome />} />
            <Route path="account" element={<UserAccount />} />
            <Route path="info" element={<Info />} />
            
          </Route>
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/" element={<AuthLogin />} /> */}
        </Routes>
      </main>

      {/* Footer (Optional) */}
      {/* <footer className="bg-gray-800 text-white p-4 w-full">
          <p className="text-center">© 2024 Your Company. All rights reserved.</p>
        </footer> */}
    </div>
  );
}

export default App;
