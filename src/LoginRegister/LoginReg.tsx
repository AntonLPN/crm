import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {
    Mail, Lock, User, ShieldCheck, Stethoscope, Activity,
    ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';
import {InputField} from "../components/LoginRegComponents/InputField";

export function App(): React.ReactElement {
    const [isLogin, setIsLogin] = React.useState<boolean>(true);
    const {t, i18n} = useTranslation();

    const changeLanguage = (lng: string): void => {
        void i18n.changeLanguage(lng);
    };

    return (
        <div
            className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans text-slate-800">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Левая часть */}
                <div
                    className="hidden md:flex md:w-5/12 lg:w-1/2 bg-linear-to-br from-blue-600 via-sky-500 to-cyan-400 p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div
                        className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-900/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <Stethoscope className="text-blue-600 w-7 h-7"/>
                        </div>
                        <span
                            className="text-white text-2xl font-bold tracking-wide">Diastema Dental Management System </span>
                    </div>

                    <div className="relative z-10 mt-20 mb-10">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                            {t('app.title1')} <br/> <span className="text-blue-100">{t('app.title2')}</span>
                        </h1>
                        <p className="text-blue-50 text-lg leading-relaxed max-w-md">
                            {t('app.desc')}
                        </p>

                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-3 text-white/90">
                                <CheckCircle2 className="w-5 h-5 text-sky-200"/>
                                <span>{t('app.feat1')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <CheckCircle2 className="w-5 h-5 text-sky-200"/>
                                <span>{t('app.feat2')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <CheckCircle2 className="w-5 h-5 text-sky-200"/>
                                <span>{t('app.feat3')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-white/80 text-sm font-medium">
                        <Sparkles className="w-4 h-4"/>
                        <span>{t('app.version')}</span>
                    </div>
                </div>

                {/* Правая часть */}
                <div className="w-full md:w-7/12 lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">

                    {/* Переключатель языков */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-1 z-20">
                        {['en', 'ru', 'uk'].map((lang: string) => (
                            <button
                                key={lang}
                                onClick={() => changeLanguage(lang)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase transition-colors ${
                                    i18n.language === lang
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>

                    <div className="md:hidden flex items-center gap-3 mb-8 justify-center mt-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                            <Stethoscope className="text-white w-6 h-6"/>
                        </div>
                        <span className="text-slate-800 text-2xl font-bold">DentaCRM</span>
                    </div>

                    <div className="max-w-md w-full mx-auto">
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 relative">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 z-10 ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {t('tabs.login')}
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 z-10 ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {t('tabs.register')}
                            </button>
                        </div>

                        <div className="mt-6">
                            <div
                                className={`transition-opacity duration-500 ${isLogin ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                                <LoginForm/>
                            </div>

                            <div
                                className={`transition-opacity duration-500 ${!isLogin ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                                <RegisterForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginForm(): React.ReactElement {
    const {t} = useTranslation();

    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        // Предотвращаем стандартное поведение браузера (перезагрузку страницы)
        e.preventDefault();
        console.log('Данные формы для отправки:', {
            email: email,
            password: password
        });
    };

    return (
        <form className="space-y-5" onSubmit = {handleSubmit}>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">{t('login.title')}</h2>
                <p className="text-slate-500 mt-2 text-sm">{t('login.subtitle')}</p>
            </div>
            {/*input boxes*/}
            <div className="space-y-4">
                <InputField
                    icon={Mail}
                    type="email"
                    placeholder={t('login.email')}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <InputField
                    icon={Lock}
                    type="password"
                    placeholder={t('login.password')}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input type="checkbox"
                               className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-colors"/>
                        <ShieldCheck
                            className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"/>
                    </div>
                    <span
                        className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">{t('login.remember')}</span>
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

function RegisterForm(): React.ReactElement {
    const {t} = useTranslation();
    const [role, setRole] = React.useState<string>('doctor');

    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{t('reg.title')}</h2>
                <p className="text-slate-500 mt-2 text-sm">{t('reg.subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder={t('reg.firstName')}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium text-sm"
                        required
                    />
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t('reg.lastName')}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium text-sm"
                        required
                    />
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400"/>
                </div>
                <input
                    type="email"
                    placeholder={t('reg.email')}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium text-sm"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400"/>
                    </div>
                    <input
                        type="password"
                        placeholder={t('reg.password')}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium text-sm"
                        required
                    />
                </div>
                <div className="relative">
                    <input
                        type="password"
                        placeholder={t('reg.confirm')}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium text-sm"
                        required
                    />
                </div>
            </div>

            <div className="pt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-3">{t('reg.role')}</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            role === 'doctor'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                        }`}
                    >
                        <div
                            className={`p-2 rounded-lg ${role === 'doctor' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <Stethoscope className="w-5 h-5"/>
                        </div>
                        <span className="font-semibold text-sm">{t('reg.doctor')}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            role === 'admin'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                        }`}
                    >
                        <div
                            className={`p-2 rounded-lg ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <Activity className="w-5 h-5"/>
                        </div>
                        <span className="font-semibold text-sm">{t('reg.admin')}</span>
                    </button>
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