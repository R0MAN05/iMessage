import {ThemeProvider} from "./context/ThemeContext";
import {WallpaperProvider} from "./context/WallpaperContext";
import { Navigate, Route, Routes } from "react-router";

import ChatPage from "./pages/Chatpage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const {isSignedIn, isLoaded} = useAuth();

  // const {checkAuth, clearAuth, connectSocket, disconnectSocket} = useAuthStore;  better method below.
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if(!isLoaded) return;

    if(isSignedIn) checkAuth();
    else clearAuth();


  },[isLoaded, isSignedIn, checkAuth, clearAuth])

  //TODO: make this component better.
  if(!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader /> 

  return (
    <ThemeProvider>
      <WallpaperProvider>
      <Routes>
        <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to="/" replace />} />
      </Routes>
      <Toaster />
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;
