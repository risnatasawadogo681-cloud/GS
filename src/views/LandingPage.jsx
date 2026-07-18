import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Briefcase, FileText, Shield, Users, ChevronDown } from 'lucide-react';

export default function LandingPage({ onGetStarted, onSkipToDemo }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3500);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: <Briefcase size={22} />,
      title: 'Offres ciblées',
      desc: 'Trouvez le stage idéal grâce à un matching intelligent entre votre profil et les offres disponibles.'
    },
    {
      icon: <FileText size={22} />,
      title: 'Convention digitale',
      desc: 'Signatures électroniques tripartites — étudiant, entreprise, administration — sans papier.'
    },
    {
      icon: <Shield size={22} />,
      title: 'Suivi complet',
      desc: 'Carnet de bord hebdomadaire, messagerie intégrée et évaluation en temps réel.'
    },
    {
      icon: <Users size={22} />,
      title: 'Multi-acteurs',
      desc: '4 espaces dédiés : étudiant, entreprise, encadreur académique et administration.'
    }
  ];

  const stats = [
    { value: '250+', label: 'Offres de stage' },
    { value: '98%', label: 'Taux de placement' },
    { value: '45', label: 'Entreprises partenaires' },
    { value: '4.9/5', label: 'Satisfaction étudiants' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060d0b',
      overflow: 'hidden',
      fontFamily: 'var(--font-family-body, Inter, sans-serif)',
    }}>

      {/* ====== NAVBAR ====== */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#34d399',
            fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
            letterSpacing: '0.05em',
          }}>
            SX
          </div>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#e8f5f0',
            fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
          }}>
            Stagix
          </span>
        </div>

        <button
          onClick={onGetStarted}
          style={{
            background: '#f59e0b',
            color: '#0a0b10',
            border: 'none',
            padding: '10px 22px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            fontFamily: 'var(--font-family-body, Inter, sans-serif)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fbbf24';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f59e0b';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Commencer
        </button>
      </nav>

      {/* ====== HERO SECTION ====== */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 24px 60px',
        overflow: 'hidden',
      }}>

        {/* Background decorative gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(
              to bottom,
              rgba(6, 13, 11, 0.3) 0%,
              rgba(16, 185, 129, 0.08) 30%,
              rgba(52, 211, 153, 0.12) 50%,
              rgba(6, 13, 11, 0.95) 100%
            )
          `,
          zIndex: 1,
        }} />

        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.18) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 40%)
          `,
          zIndex: 0,
        }} />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${6 + i * 4}px`,
            height: `${6 + i * 4}px`,
            borderRadius: '50%',
            background: `rgba(52, 211, 153, ${0.1 + i * 0.03})`,
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${4 + i}s ease-in-out infinite alternate`,
            zIndex: 1,
          }} />
        ))}

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '700px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>

          <h1 style={{
            fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
            fontSize: 'clamp(2.4rem, 7vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            color: '#e8f5f0',
            marginBottom: '24px',
          }}>
            Maîtrisez{' '}
            <br />
            vos{' '}
            <span style={{
              color: '#f59e0b',
              display: 'inline',
            }}>
              stages
            </span>
            <br />
            <span style={{
              color: '#f59e0b',
            }}>
              universitaires
            </span>
            <br />
            comme un pro.
          </h1>

          <p style={{
            color: '#8fb8a4',
            fontSize: 'clamp(0.88rem, 2.5vw, 1.05rem)',
            lineHeight: 1.7,
            maxWidth: '480px',
            marginBottom: '36px',
          }}>
            Suivez chaque étape de votre stage, gérez vos conventions numériques et atteignez vos objectifs académiques. 
            Candidature, convention, carnet de bord — tout en un.
          </p>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#0a0b10',
              border: 'none',
              padding: '16px 36px',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.25)',
              fontFamily: 'var(--font-family-body, Inter, sans-serif)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(245, 158, 11, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.25)';
            }}
          >
            Commencer gratuitement
            <ArrowRight size={18} />
          </button>

          {/* Skip link */}
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={onSkipToDemo}
              style={{
                background: 'none',
                border: 'none',
                color: '#5a8a74',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'var(--font-family-body, Inter, sans-serif)',
              }}
            >
              Accéder directement à la démo →
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          animation: 'bounce 2s infinite',
        }}>
          <span style={{ color: '#5a8a74', fontSize: '0.7rem' }}>Découvrir</span>
          <ChevronDown size={18} style={{ color: '#5a8a74' }} />
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1px',
        background: 'rgba(16, 185, 129, 0.08)',
        borderTop: '1px solid rgba(16, 185, 129, 0.12)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.12)',
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            padding: '28px 20px',
            textAlign: 'center',
            background: '#060d0b',
          }}>
            <div style={{
              fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#34d399',
              marginBottom: '4px',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: '#5a8a74',
              fontWeight: 500,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section style={{
        padding: '80px 24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: '#f59e0b',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '12px',
            display: 'block',
          }}>
            Pourquoi Stagix ?
          </span>
          <h2 style={{
            fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 700,
            color: '#e8f5f0',
            lineHeight: 1.2,
          }}>
            Tout ce qu'il faut pour réussir{' '}
            <span style={{ color: '#34d399' }}>votre stage</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {features.map((feat, i) => (
            <div
              key={i}
              style={{
                background: activeFeature === i
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(16, 185, 129, 0.03)',
                border: `1px solid ${activeFeature === i
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(16, 185, 129, 0.08)'}`,
                borderRadius: '16px',
                padding: '28px 24px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                setActiveFeature(i);
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Glow */}
              {activeFeature === i && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #34d399, transparent)',
                }} />
              )}

              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: activeFeature === i
                  ? 'rgba(52, 211, 153, 0.15)'
                  : 'rgba(52, 211, 153, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeFeature === i ? '#34d399' : '#5a8a74',
                marginBottom: '16px',
                transition: 'all 0.3s ease',
              }}>
                {feat.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#e8f5f0',
                marginBottom: '8px',
              }}>
                {feat.title}
              </h3>

              <p style={{
                fontSize: '0.82rem',
                color: '#8fb8a4',
                lineHeight: 1.6,
              }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== WORKFLOW SECTION ====== */}
      <section style={{
        padding: '60px 24px 80px',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
            fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
            fontWeight: 700,
            color: '#e8f5f0',
          }}>
            Simple comme{' '}
            <span style={{ color: '#f59e0b' }}>1, 2, 3</span>
          </h2>
        </div>

        {[
          { step: '01', title: 'Créez votre profil', desc: 'Renseignez votre filière, niveau et compétences pour recevoir des recommandations personnalisées.' },
          { step: '02', title: 'Postulez en un clic', desc: 'Parcourez les offres, candidatez et suivez l\'état de vos candidatures en temps réel.' },
          { step: '03', title: 'Gérez tout au même endroit', desc: 'Convention, carnet de bord, messagerie, rapport et évaluation — du début à l\'attestation finale.' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            marginBottom: '32px',
            position: 'relative',
          }}>
            {/* Step number */}
            <div style={{
              fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'rgba(52, 211, 153, 0.15)',
              lineHeight: 1,
              flexShrink: 0,
              width: '50px',
            }}>
              {item.step}
            </div>

            {/* Connector line */}
            {i < 2 && (
              <div style={{
                position: 'absolute',
                left: '25px',
                top: '48px',
                bottom: '-20px',
                width: '1px',
                background: 'rgba(52, 211, 153, 0.12)',
              }} />
            )}

            <div>
              <h3 style={{
                fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#e8f5f0',
                marginBottom: '6px',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#8fb8a4',
                lineHeight: 1.6,
              }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'linear-gradient(to top, rgba(16, 185, 129, 0.06), transparent)',
        borderTop: '1px solid rgba(16, 185, 129, 0.08)',
      }}>
        <Sparkles size={28} style={{ color: '#f59e0b', marginBottom: '16px' }} />
        <h2 style={{
          fontFamily: 'var(--font-family-title, Outfit, sans-serif)',
          fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
          fontWeight: 700,
          color: '#e8f5f0',
          marginBottom: '12px',
        }}>
          Prêt à démarrer votre stage ?
        </h2>
        <p style={{
          color: '#8fb8a4',
          fontSize: '0.88rem',
          marginBottom: '28px',
          maxWidth: '400px',
          margin: '0 auto 28px',
        }}>
          Rejoignez des centaines d'étudiants qui utilisent déjà Stagix pour gérer leur parcours de stage.
        </p>
        <button
          onClick={onGetStarted}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#0a0b10',
            border: 'none',
            padding: '16px 40px',
            borderRadius: '14px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 30px rgba(245, 158, 11, 0.25)',
            fontFamily: 'var(--font-family-body, Inter, sans-serif)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(245, 158, 11, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.25)';
          }}
        >
          Créer mon compte gratuitement
          <ArrowRight size={18} />
        </button>

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(16, 185, 129, 0.08)',
          fontSize: '0.72rem',
          color: '#5a8a74',
        }}>
          © 2026 Stagix — Plateforme de gestion de stages universitaires
        </div>
      </section>

      {/* Inline CSS animations */}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-20px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
