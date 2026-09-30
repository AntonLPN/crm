import * as React from 'react';
import {Eye, EyeOff, LucideIcon} from 'lucide-react';
import {useTranslation} from 'react-i18next';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    containerClassName?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
                                                          icon: Icon,
                                                          containerClassName = '',
                                                          className = '',
                                                          type = 'text', //
                                                          ...props
                                                      }) => {
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={`relative ${containerClassName}`}>
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-slate-400"/>
                </div>
            )}

            <input
                type={inputType}
                className={`w-full ${Icon ? 'pl-11' : 'px-4'} ${isPassword ? 'pr-11' : 'pr-4'} py-3.5 border border-slate-200 rounded-xl focus:bg-blue-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium ${className}`}
                {...props}
            />

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    aria-label={t(showPassword ? 'login.hidePassword' : 'login.showPassword')}
                >
                    {showPassword ? (
                        <Eye className="h-5 w-5"/>
                    ) : (
                        <EyeOff className="h-5 w-5"/>
                    )}
                </button>
            )}
        </div>
    );
};