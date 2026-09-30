import * as React from 'react';

type LanguageSwitcherProps = {
    currentLanguage: string;
    languages?: string[];
    onChange: (language: string) => void;
    className?: string;
};

export function LanguageSwitcher({
                                     currentLanguage,
                                     languages = ['en', 'ru', 'uk'],
                                     onChange,
                                     className = '',
                                 }: LanguageSwitcherProps): React.ReactElement {
    return (
        <div className={`flex gap-1 ${className}`}>
    {languages.map((lang) => (
        <button
            key={lang}
        type="button"
        onClick={() => onChange(lang)}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase transition-colors ${
            currentLanguage === lang
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:bg-slate-100'
        }`}
    >
        {lang}
        </button>
    ))}
    </div>
);
}