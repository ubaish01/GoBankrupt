// import "./App.css";
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
// THERE IS SOMETHING WRONG IN AUTH-> ONBOARDING . PLEASE CHECK

function App() {
  return (
    <BrowserRouter>
      <Header />
      <RedirectionCheck />
      <Routes>
        <Route element={<NotLoginUserOnly />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        <Route element={<LoginOnly />}>
          <Route path="/game/plinkoo" element={<Plinkoo />} />
          <Route path="/game/simulation" element={<Simulation />} />
        </Route>

        <Route path="/" element={<Home />} />

        <Route path="/user/onboard" element={<Onboarding />} />
      </Routes>
      <Footer />
      <Toaster position="bottom-left" />
    </BrowserRouter>
  );
}

export default App;
