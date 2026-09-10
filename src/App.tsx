import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Signin from './pages/Signin';
import Forum from './pages/Forum';
import Project from './pages/project';
import Post from './pages/Post';
import Login from './pages/Login';
import Impressum from './pages/Impressum';
import Footer from './components/Footer';
import Manage_account from './pages/Manage_account';
import CreatePost from './pages/CreatePost';
import Navbar_new from './components/Navbar_new';
import NotFound from './pages/404';
import Public_account from './pages/Public_account'

function App() {
  return (
    <BrowserRouter>
      <Navbar_new />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Project/:urlTitle" element={<Project />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Manage_account" element={<Manage_account />} />
        <Route path="/Forum" element={<Forum />} />
        <Route path="/Forum/:urlTitle" element={<Post />} />
        <Route path="/Post/:urlTitle" element={<Post />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Impressum" element={<Impressum />} />
        <Route path="/Create_post" element={<CreatePost />} />
        <Route path="/Public_account/:urlTitle" element={<Public_account />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
