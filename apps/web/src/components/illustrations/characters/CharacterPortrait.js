import { jsx as _jsx } from "react/jsx-runtime";
import { PixelCharacter } from '../PixelCharacter.js';
const CHARACTER_PIXEL_ID = {
    ministro: 'caputo',
    sindicalista: 'moyano',
    periodista: 'periodista',
    embajador: 'embajador',
    gobernadora: 'kicillof',
};
export function CharacterPortrait({ characterId, size = 80, panic = false }) {
    const pixelId = CHARACTER_PIXEL_ID[characterId];
    if (!pixelId)
        return null;
    return _jsx(PixelCharacter, { id: pixelId, size: size, mood: panic ? 'panic' : 'normal' });
}
//# sourceMappingURL=CharacterPortrait.js.map