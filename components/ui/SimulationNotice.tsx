import { useTranslation } from 'react-i18next';

export function SimulationNotice() {
  const { i18n } = useTranslation();
  return <aside aria-label="Simulation notice" className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
    {i18n.language.startsWith('fil')
      ? 'Simulasyon: likhang presyo, alok ng vendor, at stock. Hindi ito beripikadong impormasyon sa merkado.'
      : 'Market-interface simulation · Generated prices, vendor offers, and stock. Not verified market information.'}
  </aside>;
}
