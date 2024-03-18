import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import OCR from './OCR'; // OCR 컴포넌트 임포트
import Search from './Search'; // Search 컴포넌트 임포트
import InBody from './InBody';
import Calender from './Calender';
import Log from './Log';
import Setting from './Setting';
//import AuthButtons from './AuthButtons'; // AuthButtons 컴포넌트를 임포트합니다.
//import NavigationButtons from './NavigationButtons';
import ChangePw from './ChangePw';
import DeleteAccount from './DeleteAccount';
import { FoodProvider } from './FoodContext';
import './App.css';
import Header from './header';
import Login from './login';
import Mypage from './mypage';
import Register from './register';
import UpdatePass from './updatepass';
import InbodyOcr from './InbodyOcr';


function App() {
  return (
    <FoodProvider>
    <Router>
      <div className="app">
        <Header/>
        <section>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ocr" element={<OCR />} />
          <Route path="/search" element={<Search />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/InbodyOcr" element={<InbodyOcr />} />
          <Route path="/log" element={<Log />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/changepw" element={<ChangePw />} />
          <Route path="/deleteaccount" element={<DeleteAccount />} />
          <Route path="/update-password" element={<UpdatePass />} /> 
          <Route path="/inbody" element={<InBody />} />
        </Routes>
        </section>
      </div>
    </Router>
    </FoodProvider>
  );
}

export default App;
