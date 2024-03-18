import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Mypage from './components/mypage';
import Header from './components/header';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <section>
          <Routes>
            <Route path="/join" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/updatepass" element={<UpdatePass />} /> {/* updatepass 컴포넌트와 경로 매핑 */}
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;