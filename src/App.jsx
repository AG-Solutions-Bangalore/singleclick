import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import MemberList from "./pages/memberList/memberList";
import MemberView from "./pages/memberList/memberView";
import MemberEdit from "./pages/memberList/memberEdit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-image-crop/dist/ReactCrop.css";
import CategoryList from "./pages/master/category/CategoryList";
import SubCategoryList from "./pages/master/subCategory/SubCategoryList";
import SubCategoryAdd from "./pages/master/subCategory/SubCategoryAdd";
import CategoryAdd from "./pages/master/category/CategoryAdd";
import CategoryEdit from "./pages/master/category/CategoryEdit";
import SubCategoryEdit from "./pages/master/subCategory/SubCategoryEdit";
import UserList from "./pages/user/UserList";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/maintenance" element={<Maintenance />} />

        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/member-view/:id" element={<MemberView />} />
        <Route path="/member-edit/:id" element={<MemberEdit />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/sub-category" element={<SubCategoryList />} />
        <Route path="/add-subCategory" element={<SubCategoryAdd />} />
        <Route path="/add-category" element={<CategoryAdd />} />
        <Route path="/category-edit/:id" element={<CategoryEdit />} />
        <Route path="/sub-category-edit/:id" element={<SubCategoryEdit />} />
        <Route path="/user-list" element={<UserList />} />

        {/* <Route
          path="*"
          element={<ProtectedRoute element={<Navigate to="/" />} />}
        /> */}
      </Routes>
    </>
  );
};

export default App;
