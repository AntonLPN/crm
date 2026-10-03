import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {ChevronDown, Phone} from 'lucide-react';
import {getCountries, getCountryCallingCode, type CountryCode} from 'libphonenumber-js';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string;
    country: CountryCode;
    onPhoneChange: (value: string) => void;
    onCountryChange: (country: CountryCode) => void;
}

export function PhoneInput({
                               value,
                               country,
                               onPhoneChange,
                               onCountryChange,
                               ...inputProps
                           }: PhoneInputProps): React.ReactElement {
    const {t, i18n} = useTranslation();
    const [isCountryListOpen, setIsCountryListOpen] = React.useState(false);
    const [countrySearch, setCountrySearch] = React.useState('');
    const countrySelectorRef = React.useRef<HTMLDivElement>(null);
    const locale = i18n.resolvedLanguage ?? i18n.language;
    const countryNames = React.useMemo(
        () => new Intl.DisplayNames([locale], {type: 'region'}),
        [locale]
    );
    const countries = React.useMemo(
        () => getCountries()
            .map((countryCode) => ({
                code: countryCode,
                name: countryNames.of(countryCode) ?? countryCode,
                callingCode: getCountryCallingCode(countryCode)
            }))
            .sort((a, b) => a.name.localeCompare(b.name, locale)),
        [countryNames, locale]
    );
    const selectedCountry = countries.find(({code}) => code === country);
    const filteredCountries = countries.filter(({name, callingCode}) =>
        `${name} +${callingCode}`.toLocaleLowerCase(locale).includes(countrySearch.toLocaleLowerCase(locale))
    );

    React.useEffect(() => {
        const closeCountryList = (event: PointerEvent): void => {
            if (!countrySelectorRef.current?.contains(event.target as Node)) {
                setIsCountryListOpen(false);
            }
        };
        document.addEventListener('pointerdown', closeCountryList);
        return () => document.removeEventListener('pointerdown', closeCountryList);
    }, []);

    return (
        <div
            className="relative flex items-center rounded-xl border border-slate-200  transition-all   focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">
            <Phone className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400"/>
            <div className="relative ml-11 border-r border-slate-200 py-1 pr-2" ref={countrySelectorRef}>
                <button
                    type="button"
                    aria-label={t('reg.countryCode')}
                    aria-expanded={isCountryListOpen}
                    onClick={() => setIsCountryListOpen((open) => !open)}
                    className="flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <span aria-hidden="true" className="text-lg leading-none">{getCountryFlag(country)}</span>
                    <span>+{selectedCountry?.callingCode}</span>
                    <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${isCountryListOpen ? 'rotate-180' : ''}`}/>
                </button>
                {isCountryListOpen && (
                    <div
                        className="absolute left-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                        <input
                            type="search"
                            value={countrySearch}
                            onChange={(event) => setCountrySearch(event.target.value)}
                            placeholder={t('reg.searchCountry')}
                            aria-label={t('reg.searchCountry')}
                            className="w-full border-b border-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:bg-blue-50"
                        />
                        <div className="max-h-60 overflow-y-auto py-1">
                            {filteredCountries.map(({code, name, callingCode}) => (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => {
                                        onCountryChange(code);
                                        setCountrySearch('');
                                        setIsCountryListOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 ${code === country ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                                >
                                    <span aria-hidden="true"
                                          className="text-lg leading-none">{getCountryFlag(code)}</span>
                                    <span className="min-w-0 flex-1 truncate">{name}</span>
                                    <span className="text-slate-500">+{callingCode}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="relative min-w-0 flex-1">
                <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder={t('reg.phone')}
                    value={value}
                    onChange={(event) => onPhoneChange(event.target.value.replace(/\D/g, ''))}
                    className="w-full min-w-0 rounded-r-xl bg-transparent px-3 py-3.5 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:bg-blue-50"
                    {...inputProps}
                />
            </div>
        </div>
    );
}

function getCountryFlag(countryCode: CountryCode): string {
    return String.fromCodePoint(
        ...countryCode.split('').map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65)
    );
}
