import { jsx as _jsx } from "react/jsx-runtime";
import { isOfflineMode } from '../lib/supabase.js';
export function OfflineBanner() {
    if (!isOfflineMode)
        return null;
    return (_jsx("div", { className: "w-full bg-navy-800/80 border-b border-navy-600 px-4 py-1.5 text-center", children: _jsx("span", { className: "font-mono text-sm text-smoke-400", children: "\uD83D\uDCF4 Modo sin conexi\u00F3n \u2014 tu progreso se guarda localmente" }) }));
}
//# sourceMappingURL=OfflineBanner.js.map