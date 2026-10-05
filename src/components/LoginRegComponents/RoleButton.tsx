import * as React from 'react';
import type {LucideIcon} from 'lucide-react';

interface RoleButtonProps {
    icon: LucideIcon;
    label: string;
    selected: boolean;
    onClick: () => void;
}

export function RoleButton({icon: Icon, label, selected, onClick}: RoleButtonProps): React.ReactElement {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                selected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'
            }`}
        >
            <div className={`p-2 rounded-lg ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Icon className="w-5 h-5"/>
            </div>
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
}

function TEST()
{
    const test =  import.meta.env.VITE_API_URL;
}