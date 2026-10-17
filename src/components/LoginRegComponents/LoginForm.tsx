import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {ArrowRight, Lock, Mail, ShieldCheck} from 'lucide-react';
import {InputField} from './InputField';
import type {LoginData} from "../../api/auth/types";

interface LoginFormProps {
    onLogin: (data: LoginData) => void;
    isSubmitting: boolean;
    submitError?: string;
}

export function LoginForm({onLogin, isSubmitting, submitError}: LoginFormProps): React.ReactElement {
    const {t} = useTranslation();

    const patternPassword = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{6,}$";
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const isFormValid =
        /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email) &&
        new RegExp(patternPassword).test(password);
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!isFormValid) {
            return;
        }
        onLogin({email, password});
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">{t('login.title')}</h2>
                <p className="text-slate-500 mt-2 text-sm">{t('login.subtitle')}</p>
            </div>
            <div className="space-y-4">
                <InputField
                    icon={Mail}
                    type="email"
                    placeholder={t('login.email')}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <InputField
                    icon={Lock}
                    type="password"
                    placeholder={t('login.password')}
                    pattern={patternPassword}
                    title={t('reg.passwordRequirements')}
                    aria-describedby={"password-requirements"}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <p className="-mt-3 text-xs text-slate-500" id="password-requirements">
                    {t('reg.passwordRequirements')}
                </p>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
                {isSubmitting ? t('login.submitting') : t('login.submit')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
            <div className="flex items-center justify-center pt-2">
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    {t('login.forgot')}
                </a>
            </div>
            {submitError && (
                <p className="text-sm text-red-600 text-center" role="alert">
                    {submitError}
                </p>
            )}
            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={() => void pingServer()}*/}
            {/*    className="w-full border mt-4 border-slate-300 hover:bg-blue-500 text-slate-600  font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-slate-300/30 flex items-center justify-center gap-2 group active:scale-[0.98] hover:text-white"*/}
            {/*>*/}
            {/*    Тест Ping API*/}
            {/*</button>*/}
        </form>
    );
}
