import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
const HEADLINES = {
    hyperinflation: 'LA INFLACIÓN SE COMIÓ TODO',
    popularityCollapse: 'EL PUEBLO HABLÓ — Y NO FUE AMABLE',
    socialCollapse: 'LAS CALLES NO MIENTEN',
    bankrupt: 'LAS ARCAS VACÍAS',
    impeachment: 'JUICIO POLÍTICO: CULPABLE',
    term_complete: 'SOBREVIVISTE AL MANDATO',
};
const PRESIDENT_LABELS = {
    ingeniero: 'J. Milei — La Motosierra',
    populista: 'S. Massa — El Candidato',
    tecnocrata: 'P. Bullrich — La Mano Dura',
};
export const ShareImageCard = forwardRef(({ gameState, presidentId, score }, ref) => {
    const reason = gameState.gameOverReason ?? 'term_complete';
    const headline = HEADLINES[reason] ?? 'EL MANDATO LLEGÓ A SU FIN';
    const presidentLabel = PRESIDENT_LABELS[presidentId] ?? presidentId;
    const isWin = reason === 'term_complete';
    const date = new Date().toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (_jsxs("div", { ref: ref, style: {
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '600px',
            height: '340px',
            overflow: 'hidden',
            backgroundColor: '#f4f0e8',
            fontFamily: 'Georgia, serif',
            imageRendering: 'pixelated',
            userSelect: 'none',
        }, children: [_jsx("div", { style: {
                    backgroundColor: '#1a1a1a',
                    color: '#f4f0e8',
                    textAlign: 'center',
                    padding: '8px 0 6px',
                    letterSpacing: '6px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                }, children: "LA GACETA DE LA REP\u00DABLICA" }), _jsxs("div", { style: {
                    borderTop: '2px solid #8b7355',
                    borderBottom: '1px solid #8b7355',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '3px 12px',
                    fontSize: '8px',
                    color: '#555',
                    fontFamily: 'monospace',
                }, children: [_jsx("span", { children: date.toUpperCase() }), _jsx("span", { children: "EDICI\u00D3N ESPECIAL \u2014 REP\u00DABLICA EN LLAMAS" }), _jsxs("span", { children: ["TURNO ", gameState.turn] })] }), _jsx("div", { style: { borderTop: '3px solid #1a1a1a', margin: '0 12px' } }), _jsx("div", { style: { borderTop: '1px solid #1a1a1a', margin: '2px 12px 0' } }), _jsxs("div", { style: { display: 'flex', padding: '12px', gap: '16px' }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: {
                                    backgroundColor: isWin ? '#e8f5e9' : '#fce4ec',
                                    border: `2px solid ${isWin ? '#2e7d32' : '#c62828'}`,
                                    padding: '10px',
                                    marginBottom: '10px',
                                }, children: _jsx("p", { style: {
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: isWin ? '#1b5e20' : '#b71c1c',
                                        lineHeight: 1.2,
                                        margin: 0,
                                    }, children: headline }) }), _jsxs("p", { style: { fontSize: '11px', color: '#444', marginBottom: '8px', fontFamily: 'monospace' }, children: ["Bajo el mandato de ", _jsx("strong", { children: presidentLabel }), ", Argentina lleg\u00F3 al turno ", gameState.turn, ' ', isWin ? 'completando el período con éxito.' : 'antes de un colapso sin precedentes.'] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }, children: [
                                    { label: 'Popularidad', value: gameState.political.popularity },
                                    { label: 'Inflación', value: gameState.economic.inflation },
                                    { label: 'Reservas', value: gameState.economic.foreignReserves },
                                    { label: 'Mercados', value: gameState.economic.marketConfidence },
                                ].map(({ label, value }) => (_jsxs("div", { style: {
                                        backgroundColor: '#1a1a1a',
                                        color: '#f4f0e8',
                                        padding: '3px 6px',
                                        fontSize: '9px',
                                        fontFamily: 'monospace',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }, children: [_jsx("span", { children: label.toUpperCase() }), _jsx("span", { style: { color: value < 25 ? '#ff5252' : '#69f0ae' }, children: value })] }, label))) })] }), _jsxs("div", { style: {
                            width: '140px',
                            flexShrink: 0,
                            border: '2px solid #1a1a1a',
                            backgroundColor: '#1a1a1a',
                            color: '#f4f0e8',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px 8px',
                            gap: '4px',
                        }, children: [_jsx("p", { style: { fontSize: '8px', letterSpacing: '3px', margin: 0, fontFamily: 'monospace', opacity: 0.7 }, children: "PUNTAJE FINAL" }), _jsx("p", { style: {
                                    fontSize: '36px',
                                    fontWeight: 'bold',
                                    margin: 0,
                                    color: '#F6B40E',
                                    lineHeight: 1,
                                }, children: score }), _jsxs("p", { style: { fontSize: '8px', fontFamily: 'monospace', margin: 0, opacity: 0.6, textAlign: 'center' }, children: ["\u00BFPOD\u00C9S HACERLO", _jsx("br", {}), "MEJOR?"] })] })] }), _jsx("div", { style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTop: '1px solid #8b7355',
                    backgroundColor: '#1a1a1a',
                    color: '#888',
                    textAlign: 'center',
                    padding: '4px',
                    fontSize: '8px',
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                }, children: "REP\u00DABLICA EN LLAMAS \u2014 JUG\u00C1 EN republica.app" })] }));
});
ShareImageCard.displayName = 'ShareImageCard';
//# sourceMappingURL=ShareImageCard.js.map