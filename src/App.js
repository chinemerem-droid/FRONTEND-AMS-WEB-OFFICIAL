import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Amsweb/pages/LoginPage/LoginPage';
import Managepeople from './Amsweb/pages/ManagePeoplePage/managepeople';
import History from './Amsweb/pages/History/history';
import Notification from './Amsweb/pages/NotificationPage/notification';
import Layout from './Components/Layout';
import ResetPassword from './Amsweb/pages/Components20/ResetPassword';
import NewToken from './Amsweb/pages/Components20/token';
import NewPassword from './Amsweb/pages/Components20/newpassword';
import HomePage from './Amsweb/pages/HomePage/HomePage';
import Sub from './Amsweb/pages/NotificationPage/sub';

function App() {
  return (
    <>
      <Router>
  
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="" element={<Layout />}>
            <Route path='/home' element={<HomePage />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/managepeople" element={<Managepeople />} />
            <Route path="/reset" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} /> 
        <Route path="/new-token" element={<NewToken />} /> 
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
        
      </Router>
    </>

  ); //lhhhhhh
}

export default App;
