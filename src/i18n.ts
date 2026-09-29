import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { InitOptions } from 'i18next';

// Define translations as a const so we can derive strong types from them
const resources = {
    ru: {
        translation: {
            app: {
                title1: "Управляйте клиникой",
                title2: "с улыбкой.",
                desc: "Современная система управления пациентами, приемами и документацией для передовых стоматологий.",
                feat1: "Быстрая запись и управление расписанием",
                feat2: "Электронные медицинские карты (ЭМК)",
                feat3: "Аналитика и финансовый учет",
            },
            tabs: { login: "Вход", register: "Регистрация" },
            login: {
                title: "Добро пожаловать",
                subtitle: "Войдите в систему для доступа к расписанию",
                email: "Рабочий Email",
                password: "Пароль",
                remember: "Запомнить меня",
                forgot: "Забыли пароль?",
                submit: "Войти в систему",
                showPassword: "Показать пароль",
                hidePassword: "Скрыть пароль",
            },
            reg: {
                title: "Создать аккаунт",
                subtitle: "Заполните данные для регистрации сотрудника",
                firstName: "Имя",
                lastName: "Фамилия",
                email: "Рабочий Email",
                password: "Пароль",
                confirm: "Подтвердите",
                role: "Специальность (Роль)",
                doctor: "Врач",
                admin: "Админ",
                submit: "Зарегистрироваться",
                terms: "Нажимая кнопку, вы соглашаетесь с",
                policy: "политикой обработки данных"
            }
        }
    },
    uk: {
        translation: {
            app: {
                title1: "Керуйте клінікою",
                title2: "з усмішкою.",
                desc: "Сучасна система управління пацієнтами, прийомами та документацією для передових стоматологій.",
                feat1: "Швидкий запис та управління розкладом",
                feat2: "Електронні медичні картки (ЕМК)",
                feat3: "Аналітика та фінансовий облік",
            },
            tabs: { login: "Вхід", register: "Реєстрація" },
            login: {
                title: "Ласкаво просимо",
                subtitle: "Увійдіть у систему для доступу до розкладу",
                email: "Робочий Email",
                password: "Пароль",
                remember: "Запам'ятати мене",
                forgot: "Забули пароль?",
                submit: "Увійти в систему",
                showPassword: "Показати пароль",
                hidePassword: "Приховати пароль",
            },
            reg: {
                title: "Створити акаунт",
                subtitle: "Заповніть дані для реєстрації співробітника",
                firstName: "Ім'я",
                lastName: "Прізвище",
                email: "Робочий Email",
                password: "Пароль",
                confirm: "Підтвердіть",
                role: "Спеціальність (Роль)",
                doctor: "Лікар",
                admin: "Адмін",
                submit: "Зареєструватися",
                terms: "Натискаючи кнопку, ви погоджуєтесь з",
                policy: "політикою обробки даних"
            }
        }
    },
    en: {
        translation: {
            app: {
                title1: "Manage your clinic",
                title2: "with a smile.",
                desc: "Modern patient, appointment, and document management system for advanced dentistry.",
                feat1: "Fast scheduling and management",
                feat2: "Electronic Medical Records (EMR)",
                feat3: "Analytics and financial accounting",
                version: "Version 1.0.0 (Secure Health Data)"
            },
            tabs: { login: "Log in", register: "Register" },
            login: {
                title: "Welcome back",
                subtitle: "Log in to access your schedule",
                email: "Work Email",
                password: "Password",
                remember: "Remember me",
                forgot: "Forgot password?",
                submit: "Sign in",
                showPassword: "Show password",
                hidePassword: "Hide password",
            },
            reg: {
                title: "Create account",
                subtitle: "Fill in the details to register an employee",
                firstName: "First Name",
                lastName: "Last Name",
                email: "Work Email",
                password: "Password",
                confirm: "Confirm Password",
                role: "Specialty (Role)",
                doctor: "Doctor",
                admin: "Admin",
                submit: "Register",
                terms: "By clicking, you agree to the",
                policy: "data processing policy"
            }
        }
    }
} as const;

// Derive TypeScript types from the resource object
type TranslationKeys = typeof resources['en']['translation'];

const options: InitOptions = {
  // i18next expects runtime Resource type; the literal `resources` is compatible,
  // cast to any to preserve the literal typing above while satisfying init signature.
  resources: resources as unknown as Record<string, Record<string, any>>,
  lng: 'ru',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
};

// Initialize
void i18n.use(initReactI18next).init(options);

// Augment react-i18next types so `t` is typed with our translation keys
declare module 'react-i18next' {
  // Provide our translation type for `t` and other helpers
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationKeys;
    };
  }
}

export { resources };
export default i18n;
