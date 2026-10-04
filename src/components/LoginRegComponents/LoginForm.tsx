import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {ArrowRight, Lock, Mail, ShieldCheck} from 'lucide-react';
import {InputField} from './InputField';

export function LoginForm(): React.ReactElement {
    const {t} = useTranslation();

    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>): void => {
        event.preventDefault();
        console.log('Данные формы для отправки:', {
            email,
            password
        });
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
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>

            <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-colors"
                        />
                        <ShieldCheck
                            className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                        />
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        {t('login.remember')}
                    </span>
                </label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    {t('login.forgot')}
                </a>
            </div>

            <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
                {t('login.submit')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
        </form>
    );
}
