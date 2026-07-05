"use client";

import React, { useCallback, useEffect, useState } from 'react';

const SLIDE_IMAGES = [
  { image: '/images/mobile-legend.png', imageAlt: 'Mobile Legends', imageClass: 'object-cover' },
  { image: '/images/freefire.png', imageAlt: 'Free Fire', imageClass: 'object-cover object-top' },
  { image: '/images/valorant.png', imageAlt: 'Valorant', imageClass: 'object-cover object-top' },
];

const AUTOPLAY_MS = 3000;

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

function getSlideOffset(index, current, total) {
  let diff = index - current;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function getSlideTransform(offset, { translateStep, visibleRange }) {
  if (Math.abs(offset) > visibleRange) {
    return {
      transform: `translateX(${offset * translateStep}%) scale(0.55)`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
    };
  }

  const scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.84 : 0.7;
  const translateX = offset * translateStep;
  const opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.82 : 0.55;
  const zIndex = 10 - Math.abs(offset);

  return {
    transform: `translateX(${translateX}%) scale(${scale})`,
    opacity,
    zIndex,
    pointerEvents: 'auto',
  };
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const carouselConfig = isDesktop
    ? { translateStep: 46, visibleRange: 2 }
    : { translateStep: 48, visibleRange: 1 };

  const goToSlide = useCallback((index) => {
    setCurrentSlide((index + SLIDE_IMAGES.length) % SLIDE_IMAGES.length);
  }, []);

  const scrollToTrending = useCallback((e) => {
    e.preventDefault();
    const target = document.getElementById('trending-games');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="relative w-full overflow-x-hidden bg-gradient-to-br from-[#003d5c] via-primary to-primary-container pt-10 pb-0 md:pt-14 lg:pt-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-16 top-12 h-28 w-28 rotate-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm md:h-36 md:w-36" />
        <div className="absolute right-[6%] top-10 h-20 w-20 rotate-45 rounded-xl border border-white/10 bg-white/5 md:h-28 md:w-28" />
        <div className="absolute left-[10%] lg:left-[5%] bottom-36 text-white/10 text-5xl font-light md:text-6xl">+</div>
        <div className="absolute right-[18%] lg:right-[42%] top-[32%] text-white/10 text-4xl font-light md:text-5xl">+</div>
        <div className="absolute left-[38%] top-[14%] h-3 w-3 rotate-45 bg-white/20" />
        <div className="absolute right-[12%] bottom-[38%] h-4 w-4 rotate-12 rounded-sm bg-white/15" />
        <div className="absolute -right-8 bottom-28 h-28 w-28 -rotate-6 rounded-3xl border border-white/10 bg-white/5 md:h-36 md:w-36" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(137,206,255,0.28),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(14,165,233,0.3),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 xl:gap-20 items-center pb-10 md:pb-14 lg:pb-16">
          {/* Left — Text */}
          <div className="relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:-ml-2 xl:-ml-4">
            <div className="w-full max-w-lg lg:max-w-[440px] xl:max-w-[480px] rounded-3xl lg:rounded-none lg:bg-transparent p-5 sm:p-6 lg:p-0 lg:pr-4 bg-white/[0.06] border border-white/10 lg:border-0 backdrop-blur-md lg:backdrop-blur-none">
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/15 text-white font-label-md text-caption border border-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse" />
                Nexus Game
              </span>

              <h2 className="font-display-lg text-display-lg text-white mb-4 drop-shadow-lg leading-tight">
                Jelajahi Game{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-primary-fixed to-white">
                  Favorit Kamu
                </span>
              </h2>

              <p className="font-body-lg text-body-lg text-white/80 mb-6 leading-relaxed">
                Temukan dan top up game trending favorit kamu dalam hitungan detik. Cepat, aman, dan terpercaya.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-7">
                {['Cepat', 'Aman', 'Terpercaya'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-caption font-label-md text-white/90 bg-white/10 border border-white/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#trending-games"
                onClick={scrollToTrending}
                className="inline-flex items-center justify-center gap-2 font-label-md text-label-md bg-gradient-to-r from-white to-primary-fixed text-[#003751] px-8 py-3.5 rounded-full shadow-xl shadow-black/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300"
              >
                Explore Now
                <span className="material-symbols-outlined text-base">explore</span>
              </a>
            </div>
          </div>

          {/* Right — Coverflow carousel */}
          <div className="order-2 relative z-10 flex flex-col items-center w-full lg:-translate-x-6 xl:-translate-x-10">
            <div className="relative w-full max-w-[min(100%,500px)] lg:max-w-[440px] xl:max-w-[480px]">
              <div
                className="absolute -inset-6 md:-inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(137,206,255,0.22),transparent_70%)] blur-sm"
                aria-hidden="true"
              />

              <div className="relative h-[220px] sm:h-[260px] md:h-[290px] lg:h-[310px] xl:h-[330px] flex items-center justify-center">
                {SLIDE_IMAGES.map((slide, index) => {
                  const offset = getSlideOffset(index, currentSlide, SLIDE_IMAGES.length);
                  const style = getSlideTransform(offset, carouselConfig);
                  const isActive = offset === 0;

                  return (
                    <button
                      key={index}
                      type="button"
                      aria-label={`${slide.imageAlt}${isActive ? ' (aktif)' : ''}`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => goToSlide(index)}
                      className="absolute left-1/2 top-1/2 w-[92%] sm:w-[90%] lg:w-[88%] h-[92%] rounded-3xl overflow-hidden border border-white/25 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      style={{
                        transform: `translate(-50%, -50%) ${style.transform}`,
                        opacity: style.opacity,
                        zIndex: style.zIndex,
                        pointerEvents: style.pointerEvents,
                        boxShadow: isActive
                          ? '0 25px 50px -12px rgba(0, 30, 60, 0.55), 0 0 40px rgba(137, 206, 255, 0.25)'
                          : '0 12px 28px -8px rgba(0, 30, 60, 0.4)',
                      }}
                    >
                      <img
                        alt={slide.imageAlt}
                        className={`absolute inset-0 w-full h-full ${slide.imageClass}`}
                        src={slide.image}
                        draggable={false}
                      />
                      <div
                        className={`absolute inset-0 transition-opacity duration-700 ${
                          isActive
                            ? 'bg-gradient-to-t from-[#001e2f]/55 via-transparent to-transparent'
                            : 'bg-[#001e2f]/35'
                        }`}
                      />
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                          <p className="font-label-md text-label-md text-white drop-shadow-md text-left">
                            {slide.imageAlt}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dash pagination */}
              <div className="relative flex justify-center items-center gap-2 mt-5 md:mt-6">
                {SLIDE_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Ke slide ${index + 1}`}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? 'w-10 h-1.5 bg-white shadow-[0_0_14px_rgba(255,255,255,0.55)]'
                        : 'w-6 h-1 bg-white/35 hover:bg-white/55'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wavy bottom divider */}
      <div className="hero-wave-divider absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        <svg
          className="hero-wave-layer hero-wave-layer-back block w-[200%] h-[36px] md:h-[56px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="rgba(255,255,255,0.12)"
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
        <svg
          className="hero-wave-layer hero-wave-layer-mid block w-[200%] h-[44px] md:h-[68px] -mt-3 md:-mt-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="rgba(255,255,255,0.25)"
            d="M0,50 C360,10 720,70 1080,30 C1260,10 1380,50 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
        <svg
          className="hero-wave-layer hero-wave-layer-front block w-[200%] h-[52px] md:h-[80px] -mt-2 md:-mt-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f0f3ff" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f9f9ff" />
            </linearGradient>
          </defs>
          <path
            fill="url(#heroWaveGradient)"
            d="M0,45 C180,75 360,15 540,45 C720,75 900,15 1080,45 C1260,75 1440,15 1440,45 L1440,80 L0,80 Z"
          />
        </svg>
        <div className="hero-wave-glow" aria-hidden="true" />
      </div>
    </section>
  );
}
