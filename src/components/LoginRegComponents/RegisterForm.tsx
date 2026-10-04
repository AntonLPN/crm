import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Activity, Lock, Mail, Stethoscope, User} from 'lucide-react';
import type {CountryCode} from 'libphonenumber-js';
import {InputField} from './InputField';
import {PhoneInput} from './PhoneInput';
import {RoleButton} from './RoleButton';

export interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: CountryCode;
    password: string;
    role: 'admin' | 'doctor';
}

interface RegisterFormProps {
    onRegister?: (data: RegistrationData) => void;
}

export function RegisterForm({onRegister}: RegisterFormProps): React.ReactElement {
    const {t} = useTranslation();
    const [role, setRole] = React.useState<RegistrationData['role']>('admin');
    const [phone, setPhone] = React.useState<string>('');
    const [country, setCountry] = React.useState<CountryCode>('UA');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>): void => {
        event.preventDefault();

        onRegister?.({
            firstName,
            lastName,
            email,
            phone,
            country,
            password,
            role
        });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{t('reg.title')}</h2>
                <p className="text-slate-500 mt-2 text-sm">{t('reg.subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    icon={User}
                    type="text"
                    placeholder={t('reg.firstName')}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                />
                <InputField
                    icon={User}
                    type="text"
                    placeholder={t('reg.lastName')}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                />
            </div>

            <div className="space-y-4">
                <InputField
                    icon={Mail}
                    type="email"
                    placeholder={t('reg.email')}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <PhoneInput
                    value={phone}
                    country={country}
                    onPhoneChange={setPhone}
                    onCountryChange={setCountry}
                    required
                />
                <InputField
                    icon={Lock}
                    type="password"
                    placeholder={t('reg.password')}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <InputField
                    icon={Lock}
                    type="password"
                    placeholder={t('reg.confirm')}
                    required
                />
            </div>

            <div className="pt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-3">{t('reg.role')}</label>
                <div className="grid grid-cols-2 gap-4">
                    <RoleButton
                        icon={Stethoscope}
                        label={t('reg.doctor')}
                        selected={role === 'doctor'}
                        onClick={() => setRole('doctor')}
                    />
                    <RoleButton
                        icon={Activity}
                        label={t('reg.admin')}
                        selected={role === 'admin'}
                        onClick={() => setRole('admin')}
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-800/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
                {t('reg.submit')}
            </button>

            <p className="text-center text-xs text-slate-500 mt-4">
                {t('reg.terms')} <a href="#" className="text-blue-600 hover:underline">{t('reg.policy')}</a>.
            </p>
        </form>
    );
}
