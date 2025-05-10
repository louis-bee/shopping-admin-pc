import './Entrance.scss';
import Login from './login/Login.jsx'
import Register from './register/Register.jsx';
import { useState } from 'react';

const Entrance = () => {
  const [ tab, setTab ] = useState('login')
  return (
    <div className="login">
      {tab==='login' ? <Login setTab={setTab} /> : <Register setTab={setTab} />}
      <a className='icp' href="https://beian.miit.gov.cn/" target="_blank">浙B2-20080101</a>
    </div>
  );
};

export default Entrance;