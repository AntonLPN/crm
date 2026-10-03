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
                                                          onChange,
                                                          onBlur,
                                                          ...props
                                                      }) => {
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = React.useState(false);
    const [emailInvalid, setEmailInvalid] = React.useState(false);
    const isPassword = type === 'password';
    const isEmail = type === 'email';
    const inputType = isPassword && showPassword ? 'text' : type;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (isEmail) {
            setEmailInvalid(isInvalidEmail(event.currentTarget));
        }
        onChange?.(event);
    };
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        if (isEmail) {
            setEmailInvalid(isInvalidEmail(event.currentTarget));
        }
        onBlur?.(event);
    };

    return (
        <div className={`relative ${containerClassName}`}>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-slate-400"/>
                    </div>
                )}

                <input
                    {...props}
                    type={inputType}
                    className={`w-full ${Icon ? 'pl-11' : 'px-4'} ${isPassword ? 'pr-11' : 'pr-4'} py-3.5 border ${emailInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'} rounded-xl bg-white focus:bg-blue-50 focus:ring-4 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium ${className}`}
                    aria-invalid={isEmail ? emailInvalid : props['aria-invalid']}
                    aria-describedby={emailInvalid ? 'email-format-error' : props['aria-describedby']}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
            {isEmail && emailInvalid && (
                <p id="email-format-error" className="mt-1 text-sm text-red-600" aria-live="polite">
                    {t('reg.emailInvalid')}
                </p>
            )}
        </div>
    );
};

function isInvalidEmail(input: HTMLInputElement): boolean {
    return input.value.length > 0 && (
        input.validity.typeMismatch ||
        !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(input.value)
    );
}