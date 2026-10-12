import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Activity, Lock, Mail, Stethoscope, User} from 'lucide-react';
import {isValidPhoneNumber, type CountryCode} from 'libphonenumber-js';
import type {RegistrationData} from '../../api/auth/types';
import {InputField} from './InputField';
import {PhoneInput} from './PhoneInput';
import {RoleButton} from './RoleButton';

interface RegisterFormProps {
    onRegister?: (data: RegistrationData) => void;
    isSubmitting?: boolean;
    submitStatus?: 'idle' | 'pending' | 'success' | 'error';
    submitError?: string;
}

export function RegisterForm({
                                 onRegister,
                                 isSubmitting = false,
                                 submitStatus = 'idle',
                                 submitError
                             }: RegisterFormProps): React.ReactElement {
    const patternPassword = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{6,}$";
    const {t} = useTranslation();
    const [role, setRole] = React.useState<RegistrationData['role']>('admin');
    const [phone, setPhone] = React.useState<string>('');
    const [country, setCountry] = React.useState<CountryCode>('UA');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [confirmPassword, setConfirmPassword] = React.useState<string>('');
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [agreedToTerms, setAgreedToTerms] = React.useState(false);
    const isFormValid =
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email) &&
        isValidPhoneNumber(phone, country) &&
        new RegExp(patternPassword).test(password) &&
        confirmPassword.length > 0 &&
        confirmPassword === password &&
        agreedToTerms;
    const confirmPasswordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!isFormValid) {
            return;
        }

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
                    pattern={patternPassword}
                    title={t('reg.passwordRequirements')}
                    aria-describedby="password-requirements"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <p className="-mt-3 text-xs text-slate-500" id="password-requirements">
                    {t('reg.passwordRequirements')}
                </p>
                <InputField
                    icon={Lock}
                    type="password"
                    placeholder={t('reg.confirm')}
                    validationInvalid={confirmPasswordMismatch}
                    aria-describedby="confirm-password-error"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                />
                {confirmPasswordMismatch && (
                    <p id="confirm-password-error" className="-mt-3 text-sm text-red-600" role="alert">
                        {t('reg.confirmPasswordMismatch')}
                    </p>
                )}
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

            <label className="flex items-start gap-3 text-sm text-slate-600 mt-8">
                <input
                    type="checkbox"
                    required
                    checked={agreedToTerms}
                    onChange={(event) => setAgreedToTerms(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{t('reg.agreeToTerms')}</span>
            </label>

            <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full mt-10 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-800/20 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-800 disabled:active:scale-100"
            >
                {isSubmitting ? t('reg.submitting') : t('reg.submit')}
            </button>

            {submitStatus === 'success' && (
                <p className="text-center text-sm text-green-700" role="status">{t('reg.success')}</p>
            )}
            {submitStatus === 'error' && (
                <p className="text-center text-sm text-red-600" role="alert">
                    {t('reg.error')}{submitError ? `: ${submitError}` : ''}
                </p>
            )}

        </form>
    );
}
