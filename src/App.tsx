import * as React from 'react';
import {BrowserRouter, Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {LoaderCircle} from 'lucide-react';
import {DashboardPage} from './Dashboard/DashboardPage';
import {LoginRegisterPage} from './LoginRegister/LoginReg';
import {refreshSession, SessionRefreshError} from './api/auth/apiService';
import {useTranslation} from 'react-i18next';

interface RequireAuthProps {
    authState: AuthState;
}

type AuthState = 'checking' | 'authenticated' | 'anonymous' | 'error';

function RequireAuth({authState}: RequireAuthProps): React.ReactElement {
    if (authState === 'checking') {
        return <SessionStatus/>;
    }
    return authState === 'authenticated' ? <Outlet/> : <Navigate to="/" replace/>;
}

function SessionStatus(): React.ReactElement {
    const {t} = useTranslation();
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
            <p className="flex items-center gap-3" role="status">
                <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true"/>
                {t('session.checking')}
            </p>
        </main>
    );
}

export function App(): React.ReactElement {
    const [authState, setAuthState] = React.useState<AuthState>('checking');
    const [retryCount, setRetryCount] = React.useState(0);
    const {t} = useTranslation();

    React.useEffect(() => {
        let isCurrent = true;
        void refreshSession()
            .then((isAuthenticated) => {
                if (isCurrent) {
                    setAuthState(isAuthenticated ? 'authenticated' : 'anonymous');
                }
            })
            .catch((error: unknown) => {
                if (isCurrent) {
                    if (!(error instanceof SessionRefreshError)) {
                        console.error('Unexpected error while restoring session.', error);
                    }
                    setAuthState('error');
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [retryCount]);

    const retrySessionRefresh = (): void => {
        setAuthState('checking');
        setRetryCount((count) => count + 1);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={authState === 'checking'
                        ? <SessionStatus/>
                        : authState === 'error'
                            ? (
                                <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-5 text-center text-slate-700">
                                    <p role="alert">{t('session.failed')}</p>
                                    <button
                                        type="button"
                                        onClick={retrySessionRefresh}
                                        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        {t('session.retry')}
                                    </button>
                                </main>
                            )
                            : authState === 'authenticated'
                        ? <Navigate to="/dashboard" replace/>
                        : <LoginRegisterPage onLoginSuccess={() => setAuthState('authenticated')}/>}
                />
                <Route element={<RequireAuth authState={authState}/>}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage onLogout={() => setAuthState('anonymous')}/>}
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}
