import { jsx as _jsx } from "react/jsx-runtime";
import { PixelCharacter } from '../PixelCharacter.js';
const PRESIDENT_PIXEL_ID = {
    ingeniero: 'milei',
    populista: 'massa',
    tecnocrata: 'bullrich',
};
function getMood(popularity, hasCrisis) {
    if (hasCrisis || popularity < 30)
        return 'panic';
    if (popularity > 60)
        return 'victory';
    return 'normal';
}
export function PresidentCaricature({ presidentId, popularity, hasCrisis = false, width = 280 }) {
    const pixelId = PRESIDENT_PIXEL_ID[presidentId] ?? 'milei';
    const mood = getMood(popularity, hasCrisis);
    return _jsx(PixelCharacter, { id: pixelId, size: width, mood: mood });
}
//# sourceMappingURL=PresidentCaricature.js.map