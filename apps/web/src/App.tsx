import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import { HomePage } from './pages/HomePage';
// import { LoginPage } from './pages/LoginPage';
// import { AuthCallbackPage } from './pages/AuthCallbackPage';
// import { StampsPage } from './pages/StampsPage';
// import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          <Route
            path="/stamps"
            element={
              <RequireAuth>
                <StampsPage />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}