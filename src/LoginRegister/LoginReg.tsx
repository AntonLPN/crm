import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Stethoscope} from 'lucide-react';
// Components
import {LanguageSwitcher} from "../components/LoginRegComponents/ButtonLanguage";
import {LoginForm} from "../components/LoginRegComponents/LoginForm";
import {RegisterForm} from "../components/LoginRegComponents/RegisterForm";
import {LoginRegisterBanner} from "../components/LoginRegComponents/LoginRegisterBanner";
import {useRegisterMutation} from '../api/auth/useRegisterMutation';
import type {RegistrationData} from '../api/auth/types';
import {RegistrationError} from '../api/auth/apiService';

export function App(): React.ReactElement {
    const [isLogin, setIsLogin] = React.useState<boolean>(true);
    const {t, i18n} = useTranslation();
    const registerMutation = useRegisterMutation();

    const changeLanguage = (lng: string): void => {
        void i18n.changeLanguage(lng);
    };

    const handleRegister = (data: RegistrationData): void => {
        registerMutation.mutate(data);
    };

    const getRegistrationErrorMessage = (): string | undefined => {
        const error = registerMutation.error;
        if (!(error instanceof RegistrationError)) {
            return error ? t('error.serverError') : undefined;
        }

        switch (error.code) {
            case 'invalidPhone':
                return t('reg.phoneInvalid');
            case 'invalidCredentials':
                return t('error.invalidCredentials');
            case 'userAlreadyExists':
                return t('error.userAlreadyExists');
            case 'serverError':
                return t('error.serverError');
            case 'networkError':
                return t('error.networkError');
        }
    };

    return (
        <div
            className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans text-slate-800">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Левая часть */}
                <LoginRegisterBanner/>

                {/* Правая часть */}
                <div className="w-full md:w-7/12 lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">

                    {/* Переключатель языков */}
                    <LanguageSwitcher
                        currentLanguage={i18n.language}
                        onChange={changeLanguage}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20"
                    />
                    {/*Отображение для мобильного телефона*/}
                    <div className="md:hidden flex items-center gap-3 mb-8 justify-center mt-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                            <Stethoscope className="text-white w-6 h-6"/>
                        </div>
                        <span className="text-slate-800 text-2xl font-bold">Diastema</span>
                    </div>
                    {/*переключатель между формой входа и регистрации*/}
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
                                <RegisterForm
                                    onRegister={handleRegister}
                                    isSubmitting={registerMutation.isPending}
                                    submitStatus={registerMutation.status}
                                    submitError={getRegistrationErrorMessage()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
