import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom'

import SplitV from './Layout/ContainerSplitV'
import SplitH from './Layout/ContainerSplitH'
import Styles from './sectionCss.module.css'

import Card from './Components/Card';
import UsrPersp from './Components/UsrPerspectiveCard';
import CardLImgTxt from './Components/CardLeftImgTxt';
import RightImgTxt from './Components/RightImgTxt';
import ImgItem from './Components/ImgItem';
import ImgLayout from './Components/ImgLayout';

import SplitVC from './Layout/SplitVCustom';

import LayoutTxtSlot from './Layout/LayoutTitleSlot';
import Slot from './Components/Slot';

import Topic from './Components/Topic';

import MainTitle from './Components/mainTitle';

import RightContentM from './Components/RightContentMain';

import CardTopics from './Components/CardTopics';

import ImgFrame from './Components/imgFrame';

import NavBar from './Components/NavBar';
import MainPage from './page/main';
import Login from './page/login';
import SignUp from './page/signUp';
import Info from './page/Info';
import Contato from './page/contato';
import Footer from './Layout/FooterElment';
function App() {
  return (
    <div className="App">
      <Router>
        <NavBar></NavBar>
        <Routes>
          <Route path='/' element={<MainPage></MainPage>}></Route>
          <Route path='login' element={<Login></Login>}></Route>
          <Route path='signUp' element={<SignUp></SignUp>}></Route>
          <Route path='info' element={<Info></Info>}></Route>
          <Route path='contact' element={<Contato></Contato>}></Route>
        </Routes>
      </Router>
      <Footer></Footer>
    </div>
  );
}

export default App;
