import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminTransactions from "./pages/admin-view/transactions";
import AdminManager from "./pages/admin-view/manager";
import CandidateLayout from "./components/user-view/candidate/layout";
import NotFound from "./pages/not-found";
import CandidateHome from "./pages/user-view/candidate/home";
import CandidateAccount from "./pages/user-view/candidate/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "./components/ui/skeleton";
import CandidateProfile from "./pages/user-view/candidate/profile";
import AdminUsers from "./pages/admin-view/users";
import CandidateNews from "./pages/user-view/candidate/news";
import RecruiterHome from "./pages/user-view/recruiter/home";
import PostJob from "./pages/user-view/recruiter/postjob";
import RecruiterLayout from "./components/user-view/recruiter/layout";
import MyPosts from "./pages/user-view/recruiter/mypost";
import JobDetails from "./pages/user-view/candidate/jobdetails";
import Application from "./pages/user-view/candidate/application";
import MyApplications from "./pages/user-view/candidate/myapplications";
import CandidateForum from "./pages/user-view/candidate/forum";
import HRForum from "./pages/user-view/recruiter/forum";
import ApplicationsFromCandidate from "./pages/user-view/recruiter/applications-from-candidate";
import RecruiterProfile from "./pages/user-view/recruiter/profile";
import MyWallet from "./pages/user-view/candidate/mywallet";
import SearchResults from "./pages/user-view/candidate/search-result";
import ApprovePosts from "./pages/admin-view/approve-post";
import PostManagement from "./pages/admin-view/post-manager";
import PostDetail from "./pages/admin-view/post-detail";
import UserList from "./pages/admin-view/user-list";
import UserDetail from "./pages/admin-view/user-detail";
import UpdateCV from "./pages/user-view/candidate/updatecv";
import RecruiterJobDetails from "./pages/user-view/recruiter/jobdetails";
import ConversationPage from "./pages/user-view/conversation";
import AssignTask from "./pages/user-view/recruiter/assign-task";
import TaskManager from "./pages/user-view/recruiter/task-mamager";
import TermsAndConditions from "./pages/user-view/terms-and-conditions";
import VerifyEmail from "./pages/auth/verify-email";
import MyTasks from "./pages/user-view/candidate/my-tasks";
import TaskDetails from "./pages/user-view/candidate/task-detail";
import MyWalletRecruiter from "./pages/user-view/recruiter/mywallet";
import MyCV from "./pages/user-view/candidate/my-cv";
import SavedJobs from "./pages/user-view/candidate/saved-jobs";
import CompaniesPage from "./pages/user-view/candidate/companies";
import CompanyInfo from "./pages/user-view/candidate/company-info";
import CandidateSecuritySettings from "./pages/user-view/candidate/security-settings";
import ForgotPassword from "./pages/user-view/forgot-password";
import ResetPassword from "./pages/user-view/reset-password";
import RecruiterSecuritySettings from "./pages/user-view/recruiter/security-settings";
import CandidateInfo from "./pages/user-view/recruiter/candidate-info";
import CompaniesList from "./pages/admin-view/companies-list";
import ReportManager from "./pages/admin-view/report-manager";
import TaskList from "./pages/admin-view/tasks-list";
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-full h-full" />;

  const shouldShowFooter = (!location.pathname.includes("conversation")&&!location.pathname.includes("auth")&&!location.pathname.includes("verify-email"));

  return (
    <div className="flex flex-col max-h-screen w-screen overflow-x-hidden">
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
            <Route path="managers" element={<AdminManager />} />
            <Route path="approve-post" element={<ApprovePosts />} />
            <Route path="post-manager" element={<PostManagement />} />
            <Route path="reports" element={<ReportManager />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="list-users" element={<UserList />} />
            <Route path="list-companies" element={<CompaniesList />} />
            <Route path="list-tasks" element={<TaskList />} />
            <Route path="user-detail/:id" element={<UserDetail />} />
            <Route path="post/:id" element={<PostDetail />} />
          </Route>
          <Route
            path="/candidate"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <CandidateLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<CandidateHome />} />
            <Route path="account" element={<CandidateAccount />} />
            <Route path="profile" element={<CandidateProfile />} />
            <Route path="security-settings" element={<CandidateSecuritySettings />} />
            <Route path="job/:id" element={<JobDetails />} />
            <Route path="application/:id" element={<Application />} />
            <Route path="myapplications" element={<MyApplications />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="news" element={<CandidateNews />} />
            <Route path="forum" element={<CandidateForum />} />
            <Route path="mywallet" element={<MyWallet />} />
            <Route path="search-results" element={<SearchResults />} />
            <Route path="update-cv" element={<UpdateCV />} />
            <Route path="my-cv" element={<MyCV />} />
            <Route path="company/:recruiterId" element={<CompanyInfo />} />
            <Route path="mytasks" element={<MyTasks />} />
            <Route path="task/:id" element={<TaskDetails />} />
          </Route>
          <Route
            path="/recruiter"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <RecruiterLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<RecruiterHome />} />
            <Route path="myposts" element={<MyPosts />} />
            <Route path="profile" element={<RecruiterProfile />} />
            <Route path="postjob" element={<PostJob />} />
            <Route path="candidate/:candidateId" element={<CandidateInfo />} />
            <Route path="security-settings" element={<RecruiterSecuritySettings />} />
            <Route path="forum" element={<HRForum />} />
            <Route path="job/:id" element={<RecruiterJobDetails />} />
            <Route path="assign-task/:id" element={<AssignTask />} />
            <Route path="task-manager" element={<TaskManager />} />
            <Route path="mywallet" element={<MyWalletRecruiter/>} />
            <Route
              path="candidate-applications"
              element={<ApplicationsFromCandidate />}
            />
          </Route>
          <Route
            path="/conversation"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ConversationPage />
              </CheckAuth>
            }
          >
            <Route path=":conversationId" element={<ConversationPage />} />
            <Route path="" element={<ConversationPage />} />
          </Route>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/" element={<AuthLogin />} /> */}
        </Routes>
      </main>

      {/* Footer (Optional) */}
      {shouldShowFooter && (
        <footer className="bg-gray-800 text-white p-4 w-full">
          <p className="text-center">
            © 2024 Gudjob Vietnam. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}

export default App;
