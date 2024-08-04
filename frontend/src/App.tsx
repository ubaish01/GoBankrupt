import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Plinkoo } from "./pages/Plinkoo";
import { Footer } from "./components";
import { Home } from "./pages/Home";
import Auth from "./pages/Auth/Auth";
import Header from "./components/Header";
import Onboarding from "./pages/Onboard/Onboarding";
import NotLoginUserOnly from "./components/Protected Routes/NotLogin";
import RedirectionCheck from "./components/Protected Routes/RedirectionCheck";
import LoginOnly from "./components/Protected Routes/LoginOnly";
import { Toaster } from "react-hot-toast";
import { Simulation } from "./pages/Simulation";
import Mines from "./pages/Mines";

// THERE IS SOMETHING WRONG IN AUTH-> ONBOARDING . PLEASE CHECK

function App() {
  return (
    <>
      <div className="md:grid hidden">
        <BrowserRouter>
          <Header />
          <RedirectionCheck />
          <Routes>
            <Route element={<NotLoginUserOnly />}>
              <Route path="/auth" element={<Auth />} />
            </Route>

            <Route element={<LoginOnly />}>
              <Route path="/game/simulation" element={<Simulation />} />
              <Route path="/game/plinkoo" element={<Plinkoo />} />
              <Route path="/game/mines" element={<Mines />} />
            </Route>

            <Route path="/" element={<Home />} />

            <Route path="/user/onboard" element={<Onboarding />} />
          </Routes>
          <Footer />
          <Toaster position="top-center" />
        </BrowserRouter>
      </div>
      <div className="flex md:hidden flex-col font-bold  items-center justify-center text-2xl px-2 h-screen w-screen text-center">
        <div>Note : Please use this in computer.</div>
        <div className="text-base font-medium">
          Sorry for the inconvenience you are facing but we're not responsive
          yet for mobile or small screen devices. Please use a large screen
          device to use the app.
        </div>
        <div className="text-xl">Thanks for visiting.</div>
      </div>
    </>
  );
}

export default App;
