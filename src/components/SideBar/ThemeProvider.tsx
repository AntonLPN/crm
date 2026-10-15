import * as React from 'react';

export type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'theme';
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const isTheme = (value: unknown): value is Theme =>
    value === 'light' || value === 'dark' || value === 'system';

const getSystemTheme = (): ResolvedTheme =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function readStoredTheme(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return isTheme(stored) ? stored : 'system';
    } catch {
        return 'system'; // localStorage может быть недоступен (приватный режим и т.п.)
    }
}

export function ThemeProvider({children}: { children: React.ReactNode }): React.ReactElement {
    const [theme, setThemeState] = React.useState<Theme>(readStoredTheme);
    const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(getSystemTheme);

    // следим за сменой темы в ОС, пока выбран режим "system"
    React.useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (): void => setSystemTheme(media.matches ? 'dark' : 'light');
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

    // применяем класс .dark к <html>
    React.useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', resolvedTheme === 'dark');
        root.style.colorScheme = resolvedTheme; // нативные скроллбары и поля тоже темнеют
    }, [resolvedTheme]);

    const setTheme = React.useCallback((next: Theme): void => {
        setThemeState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch { /* не критично */
        }
    }, []);

    const value = React.useMemo(
        () => ({theme, resolvedTheme, setTheme}),
        [theme, resolvedTheme, setTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
    const context = React.useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
    return context;
}
