import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {
    ChevronDown,
    LogOut,
    Monitor,
    Moon,
    MoreHorizontal,
    PanelLeft,
    Settings,
    Stethoscope,
    Sun,
    User,
    type LucideIcon
} from 'lucide-react';
import {useTheme, type Theme} from './ThemeProvider';

export interface SidebarUser {
    name: string;
    email?: string;
    badge?: string; // например "PRO" или роль: "Врач"
}

interface SidebarProps {
    user: SidebarUser;
    onLogout: () => void;
    onAccountClick?: () => void;
    appName?: string;
}

const COLLAPSED_KEY = 'sidebar-collapsed';

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40';

export function Sidebar({
                            user,
                            onLogout,
                            onAccountClick,
                            appName = 'Diastema'
                        }: SidebarProps): React.ReactElement {
    const {t} = useTranslation();
    const [collapsed, setCollapsed] = React.useState<boolean>(() => {
        try {
            return localStorage.getItem(COLLAPSED_KEY) === '1';
        } catch {
            return false;
        }
    });
    const [settingsOpen, setSettingsOpen] = React.useState(false);

    const toggleCollapsed = (): void => {
        setCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0');
            } catch { /* не критично */
            }
            return next;
        });
    };

    const handleSettingsClick = (): void => {
        if (collapsed) {
            // в свёрнутом виде подменю некуда рисовать: разворачиваем панель и открываем настройки
            setCollapsed(false);
            setSettingsOpen(true);
            return;
        }
        setSettingsOpen((open) => !open);
    };

    return (
        <aside
            className={`flex h-full shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition-[width] duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 ${collapsed ? 'w-[72px]' : 'w-72'}`}
            aria-label={t('sidebar.label', 'Боковая панель')}
        >
            {/* Шапка */}
            <div className={`flex items-center ${collapsed ? 'flex-col gap-3' : 'justify-between'} px-1 py-1`}>
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-sm">
                        <Stethoscope className="h-4.5 w-4.5" aria-hidden="true"/>
                    </div>
                    {!collapsed && (
                        <span className="truncate text-base font-semibold text-slate-900 dark:text-white">
                            {appName}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={toggleCollapsed}
                    aria-label={collapsed ? t('sidebar.expand', 'Развернуть панель') : t('sidebar.collapse', 'Свернуть панель')}
                    aria-expanded={!collapsed}
                    className={`rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${focusRing}`}
                >
                    <PanelLeft className="h-5 w-5"/>
                </button>
            </div>

            {/* Навигация: сейчас только настройки */}
            <nav className="mt-6 flex-1 overflow-y-auto overflow-x-hidden">
                <NavButton
                    icon={Settings}
                    label={t('sidebar.settings', 'Настройки')}
                    collapsed={collapsed}
                    active={settingsOpen && !collapsed}
                    expandable
                    expanded={settingsOpen}
                    onClick={handleSettingsClick}
                />
                {settingsOpen && !collapsed && (
                    <div className="mt-1 px-1 pb-2">
                        <p className="px-2 pb-1.5 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {t('sidebar.theme', 'Тема оформления')}
                        </p>
                        <ThemeSwitcher/>
                    </div>
                )}
            </nav>

            {/* Аккаунт */}
            <AccountMenu
                user={user}
                collapsed={collapsed}
                onAccountClick={onAccountClick}
                onLogout={onLogout}
            />
        </aside>
    );
}

/* ---------- Пункт меню ---------- */

interface NavButtonProps {
    icon: LucideIcon;
    label: string;
    collapsed: boolean;
    active?: boolean;
    expandable?: boolean;
    expanded?: boolean;
    onClick: () => void;
}

function NavButton({
                       icon: Icon,
                       label,
                       collapsed,
                       active = false,
                       expandable = false,
                       expanded = false,
                       onClick
                   }: NavButtonProps): React.ReactElement {
    return (
        <button
            type="button"
            onClick={onClick}
            title={collapsed ? label : undefined}
            aria-label={collapsed ? label : undefined}
            aria-expanded={expandable ? expanded : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${focusRing} ${collapsed ? 'justify-center' : ''} ${
                active
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
            }`}
        >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true"/>
            {!collapsed && (
                <>
                    <span className="flex-1 truncate whitespace-nowrap text-left">{label}</span>
                    {expandable && (
                        <ChevronDown
                            className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                    )}
                </>
            )}
        </button>
    );
}

/* ---------- Переключатель темы ---------- */

function ThemeSwitcher(): React.ReactElement {
    const {t} = useTranslation();
    const {theme, setTheme} = useTheme();

    const options: { value: Theme; icon: LucideIcon; label: string }[] = [
        {value: 'light', icon: Sun, label: t('sidebar.themeLight', 'Светлая')},
        {value: 'dark', icon: Moon, label: t('sidebar.themeDark', 'Тёмная')},
        {value: 'system', icon: Monitor, label: t('sidebar.themeSystem', 'Как в ОС')}
    ];

    return (
        <div
            role="radiogroup"
            aria-label={t('sidebar.theme', 'Тема оформления')}
            className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70"
        >
            {options.map(({value, icon: Icon, label}) => {
                const selected = theme === value;
                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setTheme(value)}
                        className={`flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium transition-colors ${focusRing} ${
                            selected
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Icon className="h-4 w-4" aria-hidden="true"/>
                        <span className="whitespace-nowrap">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}

/* ---------- Карточка аккаунта + меню ---------- */

interface AccountMenuProps {
    user: SidebarUser;
    collapsed: boolean;
    onAccountClick?: () => void;
    onLogout: () => void;
}

function AccountMenu({user, collapsed, onAccountClick, onLogout}: AccountMenuProps): React.ReactElement {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement>(null);

    // слушатели вешаем только пока меню открыто
    React.useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: PointerEvent): void => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const initials = user.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="relative mt-2" ref={rootRef}>
            {open && (
                <div
                    role="menu"
                    className="absolute bottom-full left-0 z-30 mb-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                    {user.email && (
                        <p className="truncate px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    )}
                    <MenuItem
                        icon={User}
                        label={t('sidebar.account', 'Аккаунт')}
                        onClick={() => {
                            setOpen(false);
                            onAccountClick?.();
                        }}
                    />
                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-800"/>
                    <MenuItem
                        icon={LogOut}
                        label={t('sidebar.logout', 'Выйти')}
                        danger
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                    />
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={open}
                title={collapsed ? user.name : undefined}
                className={`flex w-full items-center rounded-xl border border-slate-200 bg-white p-2 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70 ${focusRing} ${collapsed ? 'justify-center' : 'gap-3'}`}
            >
                <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 via-pink-500 to-indigo-500 text-xs font-semibold text-white"
                    aria-hidden="true"
                >
                    {initials || <User className="h-4 w-4"/>}
                </span>
                {!collapsed && (
                    <>
                        <span className="flex min-w-0 flex-1 items-center gap-2">
                            <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                {user.name}
                            </span>
                            {user.badge && (
                                <span
                                    className="shrink-0 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                                    {user.badge}
                                </span>
                            )}
                        </span>
                        <MoreHorizontal className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true"/>
                    </>
                )}
            </button>
        </div>
    );
}

function MenuItem({
                      icon: Icon,
                      label,
                      onClick,
                      danger = false
                  }: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    danger?: boolean;
}): React.ReactElement {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${focusRing} ${
                danger
                    ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
        >
            <Icon className="h-4 w-4" aria-hidden="true"/>
            {label}
        </button>
    );
}
