import * as React from 'react';
import {LayoutDashboard, LogOut, ShieldCheck, Stethoscope} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {Sidebar} from '../components/SideBar/Sidebar';
interface DashboardPageProps {
    onLogout: () => void;
}


export function DashboardPage({onLogout}: DashboardPageProps): React.ReactElement {
    const {t} = useTranslation();

    return (
        <div className="flex h-screen gap-3 bg-slate-100 p-3 dark:bg-slate-900">
            <Sidebar
                user={{name: 'Anton Kudriashov', email: 'user@mail.com', badge: 'Врач'}}
                onLogout={onLogout}
            />
        <main className="min-h-screen bg-slate-50 text-slate-800">

            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md">
                            <Stethoscope className="h-6 w-6 text-white"/>
                        </span>
                        <span className="text-xl font-bold">Diastema</span>
                    </div>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        <LogOut className="h-4 w-4"/>
                        {t('dashboard.logout')}
                    </button>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
                <div className="mb-10">
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        <ShieldCheck className="h-4 w-4"/>
                        {t('dashboard.authenticated')}
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {t('dashboard.title')}
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-600">
                        {t('dashboard.description')}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <LayoutDashboard className="h-6 w-6"/>
                    </div>
                    <h2 className="mt-5 text-lg font-semibold">{t('dashboard.welcome')}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {t('dashboard.placeholder')}
                    </p>
                </div>
            </section>
        </main>
        </div>
    );
}
