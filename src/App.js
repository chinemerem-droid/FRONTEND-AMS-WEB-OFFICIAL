import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Amsweb/pages/LoginPage/LoginPage';
import Managepeople from './Amsweb/pages/ManagePeoplePage/managepeople';
import History from './Amsweb/pages/History/history';
import Notification from './Amsweb/pages/NotificationPage/notification';
import Layout from './Components/Layout';
import HomePage from './Amsweb/pages/HomePage/HomePage';

function App() {
  return (
    <>
      <Router>
        {/* <Sidebar> */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="" element={<Layout />}>
            <Route path='/home' element={<HomePage />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/managepeople" element={<Managepeople />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
        {/* </Sidebar> */}
      </Router>
    </>

  );
}

export default App;
