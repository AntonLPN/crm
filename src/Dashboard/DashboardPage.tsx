import * as React from 'react';
import {LayoutDashboard, Menu, ShieldCheck, Stethoscope} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {Sidebar} from '../components/SideBar/Sidebar';
interface DashboardPageProps {
    onLogout: () => void;
}

export function DashboardPage({onLogout}: DashboardPageProps): React.ReactElement {
    const {t} = useTranslation();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    // Escape закрывает меню, пока оно открыто
    React.useEffect(() => {
        if (!mobileOpen) return;
        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') setMobileOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [mobileOpen]);

    return (
        <div className="flex h-dvh flex-col gap-3 bg-slate-100 p-3 dark:bg-slate-900 md:flex-row">
            {/* Верхняя полоска: видна только на телефоне */}
            <header className="flex shrink-0 items-center gap-3 rounded-2xl bg-white px-3 py-2 text-slate-900 dark:bg-slate-950 dark:text-white md:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label={t('sidebar.openMenu')}
                    className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <Menu className="h-5 w-5"/>
                </button>
                <span className="flex items-center gap-2 font-semibold">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white">
                        <Stethoscope className="h-4 w-4"/>
                    </span>
                    Diastema
                </span>
            </header>

            {/* Затемнение: клик по нему закрывает меню */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <Sidebar
                user={{name: 'Anton Kudriashov', email: 'user@mail.com', badge: t('reg.doctor')}}
                onLogout={onLogout}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <main className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
                <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
                    <div className="mb-10">
                        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                            <ShieldCheck className="h-4 w-4"/>
                            {t('dashboard.authenticated')}
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {t('dashboard.title')}
                        </h1>
                        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
                            {t('dashboard.description')}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                            <LayoutDashboard className="h-6 w-6"/>
                        </div>
                        <h2 className="mt-5 text-lg font-semibold">{t('dashboard.welcome')}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {t('dashboard.placeholder')}
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}