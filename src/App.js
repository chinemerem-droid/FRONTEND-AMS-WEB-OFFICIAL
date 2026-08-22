import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import Notification from './pages/NotificationPage/notification';
import Managepeople from './pages/ManagePeoplePage/managepeople';
import History from './pages/History/history';
import AddNewUser from './pages/AddNewUser/addNewUser';
import ResetPassword from './pages/PasswordReset/ResetPassword';
import NewToken from './pages/PasswordReset/token';
import NewPassword from './pages/PasswordReset/newpassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/new-token" element={<NewToken />} />
        <Route path="/new-password" element={<NewPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/managepeople" element={<Managepeople />} />
            <Route path="/add-new-user" element={<AddNewUser />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
