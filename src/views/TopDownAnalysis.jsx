import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Layers, GitBranch, Box, Cpu, Sparkles } from 'lucide-react';

const TREE_DATA = {
  id: 'root',
  label: 'Gérer un stage étudiant',
  type: 'main',
  description: 'Fonction principale du système Stagix — couvre l\'intégralité du cycle de vie d\'un stage universitaire.',
  children: [
    {
      id: 'sf1',
      label: 'Rechercher et consulter les offres',
      type: 'sub',
      description: 'Permettre à l\'étudiant de trouver un stage correspondant à son profil.',
      children: [
        { id: 'op1a', label: 'Afficher la liste des offres disponibles', type: 'op', description: 'Récupérer et lister toutes les offres publiées par les entreprises.' },
        { id: 'op1b', label: 'Filtrer par filière, niveau et compétences', type: 'op', description: 'Appliquer des critères de recherche pour affiner les résultats.' },
        { id: 'op1c', label: 'Consulter le détail d\'une offre', type: 'op', description: 'Afficher les informations complètes : durée, lieu, missions, compétences requises.' },
        { id: 'op1d', label: 'Recommander des offres selon le profil', type: 'op', description: 'Algorithme de matching entre compétences étudiant et exigences de l\'offre.' },
      ]
    },
    {
      id: 'sf2',
      label: 'Postuler à une offre de stage',
      type: 'sub',
      description: 'Gérer le processus de candidature de l\'étudiant vers l\'entreprise.',
      children: [
        { id: 'op2a', label: 'Soumettre une candidature', type: 'op', description: 'Envoyer le profil de l\'étudiant (CV, compétences) à l\'entreprise ciblée.' },
        { id: 'op2b', label: 'Suivre l\'état de la candidature', type: 'op', description: 'Afficher le statut : En attente, Accepté ou Refusé.' },
        { id: 'op2c', label: 'Notifier l\'étudiant du résultat', type: 'op', description: 'Envoyer une notification push/email lors du changement de statut.' },
      ]
    },
    {
      id: 'sf3',
      label: 'Gérer la convention de stage',
      type: 'sub',
      description: 'Créer, signer et valider la convention tripartite (étudiant, entreprise, université).',
      children: [
        { id: 'op3a', label: 'Générer automatiquement la convention', type: 'op', description: 'Pré-remplir le document avec les données de l\'offre et de l\'étudiant.' },
        { id: 'op3b', label: 'Signer électroniquement (étudiant)', type: 'op', description: 'Capturer la signature manuscrite ou numérique de l\'étudiant.' },
        { id: 'op3c', label: 'Signer électroniquement (entreprise)', type: 'op', description: 'Validation et signature côté recruteur/tuteur entreprise.' },
        { id: 'op3d', label: 'Valider et signer (administration)', type: 'op', description: 'Signature finale par l\'administration universitaire pour activation.' },
      ]
    },
    {
      id: 'sf4',
      label: 'Suivre le déroulement du stage',
      type: 'sub',
      description: 'Assurer le suivi hebdomadaire via le carnet de bord et la messagerie.',
      children: [
        { id: 'op4a', label: 'Renseigner le carnet de bord hebdomadaire', type: 'op', description: 'L\'étudiant saisit ses tâches, difficultés et compétences acquises chaque semaine.' },
        { id: 'op4b', label: 'Ajouter des observations (encadreur)', type: 'op', description: 'L\'encadreur académique commente et oriente l\'étudiant.' },
        { id: 'op4c', label: 'Communiquer via messagerie interne', type: 'op', description: 'Chat en temps réel entre étudiant, entreprise et encadreur.' },
        { id: 'op4d', label: 'Consulter le tableau de bord de suivi', type: 'op', description: 'Vue synthétique de l\'avancement du stage pour toutes les parties.' },
      ]
    },
    {
      id: 'sf5',
      label: 'Évaluer et clôturer le stage',
      type: 'sub',
      description: 'Finaliser le stage avec rapport, évaluation et attestation.',
      children: [
        { id: 'op5a', label: 'Déposer le rapport de stage (PDF)', type: 'op', description: 'Upload du document final par l\'étudiant sur la plateforme.' },
        { id: 'op5b', label: 'Valider le rapport (encadreur)', type: 'op', description: 'L\'encadreur académique approuve le rapport avant évaluation.' },
        { id: 'op5c', label: 'Remplir la grille d\'évaluation (entreprise)', type: 'op', description: 'Notation sur : assiduité, travail d\'équipe, communication, technique.' },
        { id: 'op5d', label: 'Émettre l\'attestation de fin de stage', type: 'op', description: 'Génération du certificat officiel avec QR Code de vérification.' },
        { id: 'op5e', label: 'Archiver le dossier de stage', type: 'op', description: 'Sauvegarde définitive de l\'ensemble du dossier dans le système.' },
      ]
    }
  ]
};

function TreeNode({ node, depth = 0, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = node.children && node.children.length > 0;

  const typeConfig = {
    main: {
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      icon: <Layers size={18} />,
      tag: 'Fonction principale',
      tagBg: 'rgba(16, 185, 129, 0.15)',
    },
    sub: {
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.08)',
      border: 'rgba(52, 211, 153, 0.2)',
      icon: <GitBranch size={16} />,
      tag: 'Sous-fonction',
      tagBg: 'rgba(52, 211, 153, 0.12)',
    },
    op: {
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.06)',
      border: 'rgba(6, 182, 212, 0.15)',
      icon: <Cpu size={14} />,
      tag: 'Opération élémentaire',
      tagBg: 'rgba(6, 182, 212, 0.1)',
    }
  };

  const config = typeConfig[node.type];

  return (
    <div style={{ marginLeft: depth > 0 ? '24px' : '0' }}>
      {/* Connector line */}
      {depth > 0 && (
        <div style={{
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            left: '-16px',
            top: '0',
            bottom: '50%',
            width: '16px',
            borderLeft: `2px solid ${config.border}`,
            borderBottom: `2px solid ${config.border}`,
            borderBottomLeftRadius: '8px',
          }} />
        </div>
      )}

      {/* Node card */}
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{
          background: config.bg,
          border: `1px solid ${config.border}`,
          borderRadius: '12px',
          padding: node.type === 'main' ? '20px 24px' : '14px 18px',
          marginBottom: '10px',
          cursor: hasChildren ? 'pointer' : 'default',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(4px)';
          e.currentTarget.style.boxShadow = `0 4px 20px ${config.border}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Glow line left */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: `linear-gradient(to bottom, ${config.color}, transparent)`,
          borderRadius: '3px 0 0 3px',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Expand icon */}
          {hasChildren ? (
            <div style={{ color: config.color, marginTop: '2px', flexShrink: 0 }}>
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>
          ) : (
            <div style={{ color: config.color, marginTop: '2px', flexShrink: 0, opacity: 0.6 }}>
              <Box size={14} />
            </div>
          )}

          <div style={{ flex: 1 }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: config.color, display: 'flex', alignItems: 'center' }}>
                {config.icon}
              </span>
              <span style={{
                fontWeight: node.type === 'main' ? 700 : 600,
                fontSize: node.type === 'main' ? '1.15rem' : node.type === 'sub' ? '0.95rem' : '0.88rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-family-title)',
              }}>
                {node.label}
              </span>
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 8px',
                borderRadius: '20px',
                background: config.tagBg,
                color: config.color,
                fontWeight: 500,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}>
                {config.tag}
              </span>
            </div>

            {/* Description */}
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              marginTop: '6px',
              lineHeight: 1.5,
              opacity: 0.85,
            }}>
              {node.description}
            </p>

            {/* Children count badge */}
            {hasChildren && (
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: '6px',
                display: 'inline-block',
              }}>
                {isOpen ? '▾' : '▸'} {node.children.length} {node.type === 'main' ? 'sous-fonctions' : 'opérations élémentaires'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Children with animation */}
      {hasChildren && isOpen && (
        <div style={{
          animation: 'fadeSlideIn 0.3s ease',
          paddingLeft: '8px',
          borderLeft: `1px dashed ${config.border}`,
          marginLeft: '12px',
          marginBottom: '8px',
        }}>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopDownAnalysis() {
  const [allOpen, setAllOpen] = useState(false);
  // Force re-render trick
  const [key, setKey] = useState(0);

  const toggleAll = () => {
    setAllOpen(!allOpen);
    setKey(prev => prev + 1);
  };

  // Count totals
  const totalSubFunctions = TREE_DATA.children.length;
  const totalOps = TREE_DATA.children.reduce((acc, sf) => acc + (sf.children ? sf.children.length : 0), 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>

      {/* Page Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
        }}>
          <GitBranch size={28} style={{ color: '#34d399' }} />
          <h2 style={{
            fontFamily: 'var(--font-family-title)',
            fontSize: '1.6rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #34d399, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Analyse descendante (Top-Down)
          </h2>
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.88rem',
          maxWidth: '600px',
          margin: '0 auto 16px',
          lineHeight: 1.6,
        }}>
          Décomposition hiérarchique de la fonction principale
          <strong style={{ color: 'var(--text-primary)' }}> « Gérer un stage étudiant » </strong>
          en sous-fonctions, puis en opérations élémentaires.
        </p>

        {/* Stats badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '10px',
            padding: '10px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-family-title)' }}>1</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Fonction principale</div>
          </div>
          <div style={{
            background: 'rgba(52, 211, 153, 0.08)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            borderRadius: '10px',
            padding: '10px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-family-title)' }}>{totalSubFunctions}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Sous-fonctions</div>
          </div>
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.15)',
            borderRadius: '10px',
            padding: '10px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#06b6d4', fontFamily: 'var(--font-family-title)' }}>{totalOps}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Opérations élémentaires</div>
          </div>
        </div>

        {/* Toggle all button */}
        <button
          onClick={toggleAll}
          style={{
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            color: '#34d399',
            padding: '8px 20px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(52, 211, 153, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(52, 211, 153, 0.1)';
          }}
        >
          {allOpen ? '▾ Tout replier' : '▸ Tout déplier'}
        </button>
      </div>

      {/* Methodology note */}
      <div style={{
        background: 'rgba(6, 182, 212, 0.06)',
        border: '1px solid rgba(6, 182, 212, 0.15)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <Sparkles size={18} style={{ color: '#06b6d4', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{
            fontWeight: 600,
            fontSize: '0.85rem',
            color: '#06b6d4',
            marginBottom: '4px',
            fontFamily: 'var(--font-family-title)',
          }}>
            Méthode de raffinement progressif
          </div>
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            La décomposition top-down consiste à partir de la fonction la plus générale et à la raffiner
            progressivement en sous-fonctions de plus en plus spécifiques, jusqu'à obtenir des opérations
            élémentaires directement implémentables. Cliquez sur chaque nœud pour explorer l'arborescence.
          </p>
        </div>
      </div>

      {/* Tree */}
      <div key={key}>
        <TreeNode node={TREE_DATA} depth={0} defaultOpen={allOpen} />
      </div>
    </div>
  );
}
