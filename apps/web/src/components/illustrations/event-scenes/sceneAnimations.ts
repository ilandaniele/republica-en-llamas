import { gsap } from 'gsap';

type Animation = () => void;

export const CATEGORY_ANIMATIONS: Partial<Record<string, Animation>> = {
  crisis: () => {
    // Fire particles rise from bottom, fade out; overlay pulses
    gsap.fromTo(
      '.gsap-particle',
      { y: 0, autoAlpha: 1 },
      {
        y: -72,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'power1.in',
        stagger: { each: 0.22, repeat: -1, from: 'random' },
      },
    );
    gsap.fromTo(
      '.gsap-overlay',
      { autoAlpha: 0 },
      { autoAlpha: 0.18, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' },
    );
  },
  economic: () => {
    // Dollar symbols rain from top, fade out at bottom
    gsap.fromTo(
      '.gsap-particle',
      { y: 0, autoAlpha: 0.9 },
      {
        y: 160,
        autoAlpha: 0,
        duration: 1.6,
        ease: 'power1.in',
        stagger: { each: 0.4, repeat: -1, from: 'start' },
      },
    );
  },
  social: () => {
    // Smoke drifts upward and slightly right, expanding and fading
    gsap.fromTo(
      '.gsap-particle',
      { y: 0, x: 0, scale: 1, autoAlpha: 0.6 },
      {
        y: -55,
        x: 14,
        scale: 2.2,
        autoAlpha: 0,
        duration: 2.0,
        ease: 'power1.out',
        stagger: { each: 0.85, repeat: -1 },
      },
    );
  },
};

const SCENE_ANIMATIONS = {
  int_guerra_ucrania: () => {
    // Explosion flicker + smoke rise + tank patrol
    const tlUcr = gsap.timeline();
    tlUcr
      .to('.gsap-explosion', {
        autoAlpha: 0.5,
        yoyo: true,
        repeat: -1,
        duration: 0.28,
        ease: 'sine.inOut',
      })
      .to(
        '.gsap-secondary > rect',
        { y: -24, autoAlpha: 0, duration: 2.2, stagger: 0.4, repeat: -1, ease: 'power1.out' },
        '<',
      )
      .to('.gsap-primary', { x: 18, yoyo: true, repeat: -1, duration: 5, ease: 'power1.inOut' }, '+=0');
  },
  int_conflicto_iran: () => {
    // Flame flicker + missile launch
    const tlFlame = gsap.timeline({ repeat: -1 });
    tlFlame
      .to(
        '.gsap-secondary > rect:last-child',
        { scaleY: 1.35, transformOrigin: '50% 100%', yoyo: true, duration: 0.2, ease: 'sine.inOut' },
        0,
      )
      .to(
        '.gsap-secondary > rect:nth-child(2)',
        { scaleY: 1.22, transformOrigin: '50% 100%', yoyo: true, duration: 0.32, ease: 'sine.inOut' },
        0,
      )
      .to(
        '.gsap-secondary > rect:first-child',
        { scaleY: 1.12, transformOrigin: '50% 100%', yoyo: true, duration: 0.45, ease: 'sine.inOut' },
        0,
      );
    const tlMissile = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
    tlMissile
      .fromTo(
        '.gsap-primary',
        { x: 0, y: 0, autoAlpha: 1 },
        { x: 40, y: -18, autoAlpha: 0, duration: 1.3, ease: 'power2.in', immediateRender: false },
      )
      .set('.gsap-primary', { x: 0, y: 0, autoAlpha: 1 });
  },
  crisis: () => {
    // Fire columns alternate scaleY + president panic sway
    const tlFire = gsap.timeline({ repeat: -1 });
    tlFire.to('.gsap-explosion', {
      scaleY: 0.75,
      transformOrigin: '50% 100%',
      stagger: 0.18,
      yoyo: true,
      duration: 0.35,
      ease: 'sine.inOut',
    });
    gsap.to('.gsap-primary', { x: 2, yoyo: true, repeat: -1, duration: 0.4, ease: 'sine.inOut' });
  },
  soc_unrest: () => {
    // Fire flicker
    gsap.to('.gsap-explosion', {
      scaleY: 0.8,
      transformOrigin: '50% 100%',
      stagger: 0.22,
      yoyo: true,
      repeat: -1,
      duration: 0.3,
      ease: 'sine.inOut',
    });
  },
  eco_reserves: () => {
    // Gold bars pulse
    gsap.fromTo(
      '.gsap-secondary > rect',
      { autoAlpha: 0.5 },
      { autoAlpha: 1, stagger: 0.3, yoyo: true, repeat: -1, duration: 0.6, ease: 'sine.inOut' },
    );
  },
  eco_growth: () => {
    // Bar chart grow in, then smoke drifts
    gsap.fromTo(
      '.gsap-primary > rect',
      { scaleY: 0, transformOrigin: '50% 100%' },
      { scaleY: 1, duration: 1, stagger: 0.18, ease: 'power2.out', immediateRender: false },
    );
    gsap.to('.gsap-secondary > rect', {
      y: -16,
      autoAlpha: 0,
      stagger: 0.4,
      repeat: -1,
      duration: 1.8,
      ease: 'power1.out',
    });
  },
  pol_congress: () => {
    // President podium subtle bob
    gsap.to('.gsap-primary', { y: -2, yoyo: true, repeat: -1, duration: 0.8, ease: 'sine.inOut' });
  },
  pol_scandal: () => {
    // Spotlight flickers autoAlpha
    gsap.fromTo(
      '.gsap-primary',
      { autoAlpha: 0.75 },
      { autoAlpha: 1, yoyo: true, repeat: -1, duration: 0.22, ease: 'sine.inOut' },
    );
  },
  arg_campo: () => {
    // Tractor slowly moves right across field, loops
    const tlTractor = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    tlTractor
      .fromTo('.gsap-primary', { x: 0 }, { x: 200, duration: 6, ease: 'none', immediateRender: false })
      .set('.gsap-primary', { x: 0 });
  },
  int_trade: () => {
    // Ship slides slowly right, loops
    const tlShip = gsap.timeline({ repeat: -1 });
    tlShip
      .fromTo('.gsap-primary', { x: 0 }, { x: 40, duration: 8, ease: 'none', immediateRender: false })
      .to('.gsap-primary', { x: -60, duration: 0.01 });
  },
  arg_mundial: () => {
    // Confetti rects rain down
    gsap.fromTo(
      '.gsap-secondary > rect',
      { y: 0, autoAlpha: 1 },
      {
        y: 80,
        autoAlpha: 0,
        duration: 2,
        stagger: { each: 0.3, repeat: -1, from: 'random' },
        ease: 'power1.in',
      },
    );
  },
  arg_corralito: () => {
    // Protesters bob (pixel art = y ±2px)
    gsap.to('.gsap-secondary', {
      y: -2,
      yoyo: true,
      repeat: -1,
      duration: 0.5,
      ease: 'sine.inOut',
      stagger: 0.1,
    });
  },
  int_war: () => {
    // Radar sweep line sweeps, blip pulses
    gsap.to('.gsap-primary', {
      rotation: 360,
      transformOrigin: '10% 50%',
      duration: 3,
      repeat: -1,
      ease: 'none',
    });
    gsap.fromTo(
      '.gsap-explosion',
      { autoAlpha: 0.3 },
      { autoAlpha: 1, yoyo: true, repeat: -1, duration: 0.4, ease: 'sine.inOut' },
    );
  },
  int_aid: () => {
    // Aid truck drives right, boxes drift down
    const tlAid = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    tlAid
      .fromTo('.gsap-primary', { x: 0 }, { x: 60, duration: 5, ease: 'none', immediateRender: false })
      .set('.gsap-primary', { x: -80 });
    gsap.fromTo(
      '.gsap-secondary > rect',
      { y: 0, autoAlpha: 1 },
      {
        y: 80,
        autoAlpha: 0,
        duration: 2.5,
        stagger: { each: 0.4, repeat: -1, from: 'random' },
        ease: 'power1.in',
      },
    );
  },
  eco_inflation: () => {
    // Price arrow rects scroll upward
    gsap.to('.gsap-primary', { y: -8, yoyo: true, repeat: -1, duration: 1, ease: 'power1.inOut' });
  },
  int_imf: () => {
    // Globe latitude lines scroll x (rotation illusion)
    gsap.to('.gsap-primary > rect', {
      x: -6,
      yoyo: true,
      repeat: -1,
      duration: 2,
      stagger: 0.3,
      ease: 'sine.inOut',
    });
  },
  guerra_nuke_explosion: () => {
    // Mushroom cloud expands from nothing, debris flies out, overlay pulses
    const tlNuke = gsap.timeline();
    tlNuke
      .from('.gsap-explosion', {
        scaleY: 0,
        transformOrigin: '50% 100%',
        duration: 0.9,
        ease: 'power3.out',
        immediateRender: false,
      })
      .from(
        '.gsap-secondary > rect',
        {
          scale: 0,
          transformOrigin: '50% 50%',
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          immediateRender: false,
        },
        '+=0.1',
      );
    gsap.to('.gsap-overlay', {
      autoAlpha: 0.35,
      yoyo: true,
      repeat: -1,
      duration: 0.4,
      ease: 'sine.inOut',
    });
  },
  guerra_nuke_threat: () => {
    // Missile slides toward island and warning sign flashes
    gsap.to('.gsap-primary', { x: 12, y: 6, yoyo: true, repeat: -1, duration: 1.4, ease: 'sine.inOut' });
  },
  guerra_join: () => {
    // Soldiers march right continuously; commander sways
    const tlMarch = gsap.timeline({ repeat: -1 });
    tlMarch
      .fromTo('.gsap-primary', { x: 0 }, { x: 30, duration: 4, ease: 'none', immediateRender: false })
      .set('.gsap-primary', { x: 0 });
    gsap.to('.gsap-secondary', { y: -2, yoyo: true, repeat: -1, duration: 0.6, ease: 'sine.inOut' });
  },
  malvinas: () => {
    // British warship advances slowly; officers look (bob)
    const tlShip = gsap.timeline({ repeat: -1 });
    tlShip
      .fromTo('.gsap-primary', { x: 0 }, { x: -20, duration: 5, ease: 'none', immediateRender: false })
      .set('.gsap-primary', { x: 0 });
  },
  eco_dollar_blue: () => {
    // Hooded figure sways slightly
    gsap.to('.gsap-primary', { x: 1, yoyo: true, repeat: -1, duration: 0.9, ease: 'sine.inOut' });
  },
  pol_election: () => {
    // Voters shuffle forward slowly in queue
    gsap.fromTo('.gsap-primary', { x: 0 }, { x: 8, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  },
  soc_housing: () => {
    // People with suitcases drift forward
    gsap.to('.gsap-primary', { x: 4, yoyo: true, repeat: -1, duration: 2, ease: 'sine.inOut' });
  },
  eco_corte_luz: () => {
    // Candle flames flicker
    gsap.to('.gsap-primary', {
      autoAlpha: 0.4,
      yoyo: true,
      repeat: -1,
      duration: 0.7,
      ease: 'sine.inOut',
      stagger: 0.2,
    });
  },
  pol_veto: () => {
    // VETADO stamp pulses
    gsap.fromTo(
      '.gsap-primary',
      { scale: 1.04, transformOrigin: '50% 50%' },
      { scale: 1, yoyo: true, repeat: -1, duration: 0.6, ease: 'sine.inOut', immediateRender: false },
    );
    // Scattered documents drift
    gsap.to('.gsap-secondary', {
      y: 2,
      yoyo: true,
      repeat: -1,
      duration: 1.2,
      ease: 'sine.inOut',
      stagger: 0.15,
    });
  },
} satisfies Record<string, Animation>;

export const ANIMATIONS_BY_SCENE: Partial<Record<string, Animation>> = {
  ...SCENE_ANIMATIONS,
  crisis_impeachment: SCENE_ANIMATIONS.crisis,
  arg_congreso_ley: SCENE_ANIMATIONS.pol_congress,
};
