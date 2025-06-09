import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup/Signup';
import Login from './Login/Login';
import Layout from './Layout';
import Home from './Home';
import AdminPage from './Admin/AdminPage';
import AdminBoards from './Admin/AdminBoards';
import BoardManagement from './Admin/Boards/BoardManagement';
import BoardStatistics from './Admin/Boards/BoardStatistics';
import BoardList from './Board/BoardList';
import BoardView from './Board/BoardView';
import BoardWrite from './Board/BoardWrite';
import BoardEdit from './Board/BoardEdit';
import FindId from './FindIdAndPassword/FindId';
import FindPassword from './FindIdAndPassword/FindPassword';
import BeforeModifyUI from './Modify/ModifyUserInfo';
import ModifyUserUI from './Modify/RealModify';
import ModifyAdminPw from './Modify/ModifyAdminPw';
import UserInfoPrint from './Admin/UserInfoSearch';
import UserInfoDetail from './Admin/UserInfoDetail';
import UserStatics from './Admin/UserStatics';
import AdminMember from './Admin/AdminMember';
import ModifyAdminInfo from './Modify/ModifyAdminInfo';
import RealModifyAdmin from './Modify/RealModifyAdmin';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Layout-included routes */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/board/list" element={<BoardList />} />
                    <Route path="/board/view/:id" element={<BoardView />} />
                    <Route path="/board/write" element={<BoardWrite />} />
                    <Route path="/board/edit/:id" element={<BoardEdit />} />
                    <Route path="/admin/boards/Manage" element={<BoardManagement />} />
                    <Route path="/admin/boards/Statistics" element={<BoardStatistics />} />
                    <Route path="/admin/page" element={<AdminPage />} />
                    <Route path="/admin/boards" element={<AdminBoards />} />
                    <Route path="/admin/members" element={<AdminMember />} />
                </Route>
                
                {/* Layout-excluded routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/findid" element={<FindId />} />
                <Route path="/findpw" element={<FindPassword />} />
                <Route path="/beforemodify" element={<BeforeModifyUI />} />
                <Route path="/modify" element={<ModifyUserUI />} />
                <Route path="/modifyadminpw" element={<ModifyAdminPw />} />
                <Route path="/userinfoprint" element={<UserInfoPrint />} />
                <Route path="/userinfodetail" element={<UserInfoDetail />} />
                <Route path="/userstatics" element={<UserStatics />} />

                {/* 새로 추가한 페이지 */}
                <Route path="/modifyadmininfo" element={<ModifyAdminInfo />} />
                <Route path="/modifyadmin" element={<RealModifyAdmin />} />
            </Routes>
        </BrowserRouter>
    );
};