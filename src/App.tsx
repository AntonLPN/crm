import * as React from 'react';
import {BrowserRouter, Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {DashboardPage} from './Dashboard/DashboardPage';
import {LoginRegisterPage} from './LoginRegister/LoginReg';

interface RequireAuthProps {
    isAuthenticated: boolean;
}

function RequireAuth({isAuthenticated}: RequireAuthProps): React.ReactElement {
    return isAuthenticated ? <Outlet/> : <Navigate to="/" replace/>;
}

export function App(): React.ReactElement {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated
                        ? <Navigate to="/dashboard" replace/>
                        : <LoginRegisterPage onLoginSuccess={() => setIsAuthenticated(true)}/>}
                />
                <Route element={<RequireAuth isAuthenticated={isAuthenticated}/>}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage onLogout={() => setIsAuthenticated(false)}/>}
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}
