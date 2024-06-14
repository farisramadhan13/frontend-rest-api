import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';

function App() {
  return (
    <div className="bg-white w-full min-h-screen">
      <Header/>
      <Home/>
      <Footer/>
    </div>
  );
}

export default App;
