import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {CheckCircle2, Sparkles, Stethoscope} from 'lucide-react';

export function LoginRegisterBanner(): React.ReactElement {
    const {t} = useTranslation();

    return (
        <div
            className="hidden md:flex md:w-5/12 lg:w-1/2 bg-linear-to-br from-blue-600 via-sky-500 to-cyan-400 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-900/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <Stethoscope className="text-blue-600 w-7 h-7"/>
                </div>
                <span className="text-white text-2xl font-bold tracking-wide">
                    Diastema Dental Management System
                </span>
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
    );
}
