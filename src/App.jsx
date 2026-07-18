import React, { useState, useEffect } from 'react';
import { 
  Bell, Laptop, Smartphone, HelpCircle, 
  Sparkles, CheckCircle2, User, RefreshCw, Send, HelpCircle as HelpIcon,
  GitBranch
} from 'lucide-react';
import StudentMobile from './views/StudentMobile';
import EnterpriseWeb from './views/EnterpriseWeb';
import SupervisorWeb from './views/SupervisorWeb';
import AdminWeb from './views/AdminWeb';
import TopDownAnalysis from './views/TopDownAnalysis';
import LandingPage from './views/LandingPage';
import NotificationCenter, { ToastContainer } from './components/NotificationCenter';

// Default initial offers
const INITIAL_OFFERS = [
  {
    id: 1,
    title: "Développeur Front-End React.js (H/F)",
    company: "TechCorp",
    branch: "Génie Logiciel",
    level: "Master 1",
    duration: "4 mois",
    location: "Paris (Hybride)",
    skills: ["React", "JavaScript", "CSS", "Vite"],
    description: "Rejoignez notre équipe produit pour concevoir et développer des interfaces utilisateur élégantes et performantes. Vous participerez aux rituels agiles et collaborerez avec les UI/UX designers pour intégrer les maquettes Figma dans notre produit phare."
  },
  {
    id: 2,
    title: "Ingénieur Système Réseau & Cloud",
    company: "CloudSafe",
    branch: "Réseaux & Télécoms",
    level: "Master 2",
    duration: "6 mois",
    location: "Lyon (Présentiel)",
    skills: ["Linux", "Docker", "AWS", "Nginx"],
    description: "Au sein du pôle infrastructure, vous assisterez les ingénieurs DevOps dans l'automatisation des déploiements et la sécurisation des architectures Kubernetes sur le cloud public AWS. Une bonne connaissance de bash/python est un plus."
  },
  {
    id: 3,
    title: "Analyste en Cybersécurité & Audit",
    company: "SecureNet",
    branch: "Sécurité Informatique",
    level: "Master 1",
    duration: "4 mois",
    location: "Paris (Télétravail)",
    skills: ["Wireshark", "Linux", "Python", "SQL"],
    description: "Sous la supervision de notre RSSI, vous participerez aux audits de sécurité défensive (Blue Team), à l'analyse journalière des logs de pare-feu et à l'écriture de scripts automatisés de détection d'intrusions en Python."
  },
  {
    id: 4,
    title: "Data Scientist - Prédiction de Ventes AI",
    company: "DataMind",
    branch: "Data Science",
    level: "Master 2",
    duration: "6 mois",
    location: "Sophia-Antipolis (Hybride)",
    skills: ["Python", "TensorFlow", "Pandas", "SQL"],
    description: "Vous analyserez de larges jeux de données transactionnelles pour concevoir, entraîner et déployer des modèles d'apprentissage automatique supervisé visant à prédire les comportements d'achat saisonniers de nos utilisateurs."
  }
];

export default function App() {
  const [activeRole, setActiveRole] = useState('student'); // student, enterprise, supervisor, admin
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);
  
  // REGISTRATION STATE
  const [showLanding, setShowLanding] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBranch, setRegBranch] = useState('Génie Logiciel');
  const [regLevel, setRegLevel] = useState('Master 1');
  const [regSkills, setRegSkills] = useState('React, JavaScript');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim()) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const skillsArray = regSkills.split(',').map(s => s.trim()).filter(s => s);
    setStudentProfile({
      name: `${regFirstName.trim()} ${regLastName.trim()}`,
      email: regEmail.trim(),
      branch: regBranch,
      level: regLevel,
      skills: skillsArray,
      experiences: "Aucune expérience renseignée"
    });
    setIsRegistered(true);
    addToast("Inscription réussie !", `Bienvenue sur Stagix, ${regFirstName} !`, "success");
    addNotification("Compte créé", `Bienvenue sur Stagix ! Votre profil ${regBranch} (${regLevel}) est configuré.`, "success");
  };

  const handleBypassRegistration = () => {
    setIsRegistered(true);
    addToast("Session de test activée", "Utilisation du profil par défaut (Yanis Belkacem).", "info");
  };
  
  // TOASTS & NOTIFICATIONS STATES
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    { title: "Bienvenue sur Stagix", message: "Complétez votre profil pour obtenir des recommandations personnalisées de stages.", time: "Il y a 5 min", type: "info" }
  ]);

  // STUDENT STATE
  const [studentProfile, setStudentProfile] = useState({
    name: "Yanis Belkacem",
    email: "yanis.belkacem@etu.univ.fr",
    branch: "Génie Logiciel",
    level: "Master 1",
    skills: ["React", "JavaScript", "SQL", "Node.js"],
    experiences: "Projet universitaire de site E-commerce"
  });

  // OFFERS STATE
  const [offers, setOffers] = useState(INITIAL_OFFERS);

  // APPLICATIONS STATE
  const [applications, setApplications] = useState([]);

  // CONVENTION STATE
  const [convention, setConvention] = useState(null);

  // LOGBOOK STATE
  const [logbook, setLogbook] = useState([]);

  // CHAT STATE
  const [messages, setMessages] = useState([
    { from: 'supervisor', to: 'student', fromName: "Encadreur (Dr. Martin)", text: "Bonjour Yanis, j'espère que tu commences à chercher activement ton stage. N'hésite pas à m'envoyer les offres de stage qui t'intéressent.", timestamp: "11:10" }
  ]);
  const [activeContact, setActiveContact] = useState("Entreprise (TechCorp)");

  // Notification Helpers
  const addToast = (title, message, type = 'info') => {
    // eslint-disable-next-line react-hooks/purity
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (title, message, type = 'info') => {
    setNotifications(prev => [
      { title, message, time: "À l'instant", type },
      ...prev
    ]);
  };

  // 1. APPLY TO OFFERS
  const handleApply = (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    // Vérifier si l'étudiant a déjà postulé à cette offre
    const alreadyApplied = applications.some(a => a.offerId === offerId);
    if (alreadyApplied) {
      addToast("Déjà postulé !", `Vous avez déjà envoyé une candidature chez ${offer.company}.`, "info");
      return;
    }

    const newApp = {
      id: applications.length + 1,
      offerId,
      date: new Date().toLocaleDateString(),
      status: 'En attente'
    };

    setApplications(prev => [...prev, newApp]);
    addToast("Candidature envoyée !", `Votre profil a été partagé avec ${offer.company}.`, "success");
    addNotification("Candidature transmise", `Vous avez postulé au poste "${offer.title}" chez ${offer.company}.`, "info");
  };

  // 2. PUBLISH & DELETE OFFERS
  const handlePublishOffer = (newOffer) => {
    const offerWithId = {
      id: offers.length + 1,
      company: "TechCorp", // Published by the active recruiter
      ...newOffer
    };
    setOffers(prev => [offerWithId, ...prev]);
    addToast("Offre en ligne", `L'offre "${newOffer.title}" a été publiée avec succès !`, "success");
    addNotification("Nouvelle offre publiée", `TechCorp a publié une nouvelle offre de stage : "${newOffer.title}".`, "info");
  };

  const handleDeleteOffer = (offerId) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
    addToast("Offre supprimée", "L'offre de stage a été retirée du catalogue.", "info");
  };

  // 3. CANDIDATE WORKFLOWS (Approve/Reject)
  const handleApproveApplication = (appId) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: 'Accepté' } : app
    ));

    const app = applications.find(a => a.id === appId);
    const offer = offers.find(o => o.id === app.offerId);

    // Auto-generate Stage Convention
    setConvention({
      id: 1,
      offerId: offer.id,
      offerTitle: offer.title,
      companyName: offer.company,
      duration: offer.duration,
      studentSignature: null,
      enterpriseSignature: null,
      adminSignature: null,
      reportUploaded: false,
      reportFileName: '',
      reportUploadDate: '',
      reportValidated: false,
      evaluation: null,
      stageFinished: false
    });

    addToast("Candidature validée !", "La convention de stage a été générée automatiquement.", "success");
    addNotification("Candidature acceptée !", `Félicitations, TechCorp a accepté votre candidature pour "${offer.title}". Convention disponible pour signatures.`, "success");
  };

  const handleRejectApplication = (appId) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: 'Refusé' } : app
    ));
    addToast("Candidature refusée", "Notification transmise à l'étudiant.", "info");
  };

  // 4. SIGN AGREEMENT (CONVENTION)
  const handleSignConvention = (role, signatureImage) => {
    setConvention(prev => {
      if (!prev) return null;
      const updated = { ...prev };
      if (role === 'student') updated.studentSignature = signatureImage;
      if (role === 'enterprise') updated.enterpriseSignature = signatureImage;
      if (role === 'admin') updated.adminSignature = signatureImage;
      
      // If administrative signing is complete
      if (updated.studentSignature && updated.enterpriseSignature && updated.adminSignature) {
        // Broadcast completion toast
        setTimeout(() => {
          addToast("Convention active", "Toutes les parties ont signé. Le stage est officiellement actif !", "success");
          addNotification("Convention validée", "L'administration générale a signé votre convention de stage. Bon stage !", "success");
        }, 100);
      }
      
      return updated;
    });

    const roleNames = { student: "l'Étudiant", enterprise: "l'Entreprise", admin: "l'Administration" };
    addToast("Document signé !", `La signature de ${roleNames[role]} a été enregistrée.`, "info");
  };

  // 5. CARNET DE BORD (LOGBOOK)
  const handleSaveLogbook = (week, tasks, difficulties, skills) => {
    const newEntry = {
      week,
      tasks,
      difficulties,
      skills,
      date: new Date().toLocaleDateString(),
      supervisorFeedback: null
    };

    setLogbook(prev => {
      // Check if week already exists, replace it, else push
      const exists = prev.some(e => e.week === week);
      if (exists) {
        return prev.map(e => e.week === week ? newEntry : e);
      }
      return [...prev, newEntry].sort((a, b) => a.week - b.week);
    });

    addToast("Carnet mis à jour", `Les données de la Semaine ${week} ont été soumises.`, "success");
    addNotification("Carnet de bord renseigné", `Yanis a renseigné son carnet de bord pour la Semaine ${week}.`, "info");
  };

  // 6. ADVISOR COMMENT ON LOGBOOK
  const handleAddLogFeedback = (week, feedback) => {
    setLogbook(prev => prev.map(entry => 
      entry.week === week ? { ...entry, supervisorFeedback: feedback } : entry
    ));
    addToast("Observation enregistrée", `Votre avis sur la semaine ${week} a été partagé.`, "success");
    addNotification("Observation de l'encadreur", `Dr. Martin a laissé une observation sur votre carnet de bord (Semaine ${week}).`, "message");
  };

  // 7. UPLOAD REPORT
  const handleUploadReport = (fileName) => {
    setConvention(prev => {
      if (!prev) return null;
      return {
        ...prev,
        reportUploaded: true,
        reportFileName: fileName,
        reportUploadDate: new Date().toLocaleDateString()
      };
    });
    addToast("Rapport déposé", "Le fichier PDF a été mis en ligne.", "success");
    addNotification("Rapport de stage soumis", "Yanis Belkacem a déposé son rapport de stage final.", "info");
  };

  // 8. ADVISOR VALIDATION
  const handleValidateReport = () => {
    setConvention(prev => {
      if (!prev) return null;
      return { ...prev, reportValidated: true };
    });
    addToast("Rapport validé", "Validation académique enregistrée.", "success");
    addNotification("Rapport validé par l'encadreur", "Dr. Martin a donné sa validation académique pour votre rapport.", "success");
  };

  // 9. ENTERPRISE GRADE INTERN
  const handleEvaluateIntern = (evaluation) => {
    setConvention(prev => {
      if (!prev) return null;
      return { ...prev, evaluation };
    });
    addToast("Évaluation complétée !", `Note globale de l'étudiant : ${evaluation.finalGrade}/20.`, "success");
    addNotification("Évaluation entreprise reçue", `TechCorp a déposé votre grille d'évaluation finale : note globale de ${evaluation.finalGrade}/20.`, "success");
  };

  // 10. ADMIN FINALIZE & ARCHIVE
  const handleFinalizeStageArchive = () => {
    setConvention(prev => {
      if (!prev) return null;
      return { ...prev, stageFinished: true };
    });
    addToast("Attestation émise !", "Le stage est archivé. L'étudiant peut télécharger son attestation.", "success");
    addNotification("Attestation émise !", "Votre attestation officielle de fin de stage avec QR Code de vérification est disponible.", "success");
  };

  // 11. CHAT MESSAGING & SIMULATED RESPONSES
  const handleSendMessage = (text, recipient) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add current user message
    const myMsg = {
      from: activeRole,
      to: recipient,
      text,
      timestamp,
      fromName: activeRole === 'student' ? 'Yanis' : activeRole === 'enterprise' ? 'TechCorp' : 'Dr. Martin'
    };

    setMessages(prev => [...prev, myMsg]);

    // Simulated Auto-Replies (if sending to Enterprise or Advisor as Student)
    if (activeRole === 'student') {
      if (recipient === "Entreprise (TechCorp)") {
        setTimeout(() => {
          let replyText = "Bonjour Yanis ! Nous avons bien reçu ton message. Ton tuteur de stage va revenir vers toi d'ici quelques instants.";
          
          const textLower = text.toLowerCase();
          if (textLower.includes('convention') || textLower.includes('signe') || textLower.includes('contrat')) {
            replyText = "Bonjour Yanis, concernant la convention : nous l'avons signée électroniquement dans notre portail recruteur ! Elle attend maintenant l'accord de l'administration.";
          } else if (textLower.includes('rapport') || textLower.includes('eval') || textLower.includes('note')) {
            replyText = "Salut Yanis. Dès que tu déposes le rapport PDF, nous compléterons ta grille d'évaluation en ligne (assiduité, technique, etc.). Bon courage pour la rédaction !";
          }

          setMessages(prev => [...prev, {
            from: 'enterprise',
            to: 'student',
            fromName: "Entreprise (TechCorp)",
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          addToast("Nouveau message", "L'Entreprise TechCorp vous a répondu.", "message");
        }, 1800);
      }

      if (recipient === "Encadreur (Dr. Martin)") {
        setTimeout(() => {
          let replyText = "Bonjour Yanis. J'espère que ton stage se déroule bien. N'oublie pas de bien renseigner ton carnet hebdomadaire.";
          
          const textLower = text.toLowerCase();
          if (textLower.includes('carnet') || textLower.includes('semaine')) {
            replyText = "J'ai bien pris note de tes dernières saisies dans le carnet de bord. Tes missions sur React sont pertinentes. J'ai ajouté mes commentaires sur le tableau.";
          } else if (textLower.includes('rapport') || textLower.includes('plan') || textLower.includes('soutenance')) {
            replyText = "Bonjour Yanis. Envoie-moi le plan détaillé de ton rapport sous format Word ou PDF dès que possible afin que je puisse t'orienter.";
          }

          setMessages(prev => [...prev, {
            from: 'supervisor',
            to: 'student',
            fromName: "Encadreur (Dr. Martin)",
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          addToast("Nouveau message", "Dr. Martin vous a répondu.", "message");
        }, 1800);
      }
    }
  };

  // 12. SHORTCUT SIMULATION ACTIONS (FOR SMOOTH TESTING)
  const runSimulationStep = (step) => {
    switch (step) {
      case 'candidature':
        handleApply(1); // Student applies to React offer
        setActiveRole('enterprise');
        addToast("Simulation active", "Candidature envoyée ! Rôle changé vers Entreprise pour acceptation.", "info");
        break;

      case 'signature': {
        if (!convention) {
          // If no convention, accept react offer first
          handleApply(1);
          handleApproveApplication(1);
        }
        // Sign student
        const mockSig = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='40'><path d='M10 20 Q 30 5, 50 20 T 90 20' fill='none' stroke='black' stroke-width='2'/></svg>";
        setConvention(prev => {
          if (!prev) return null;
          return {
            ...prev,
            studentSignature: mockSig,
            enterpriseSignature: mockSig,
            adminSignature: mockSig
          };
        });
        addToast("Simulation active", "Convention signée électroniquement par toutes les parties !", "success");
        addNotification("Convention validée", "L'administration générale a signé votre convention de stage. Bon stage !", "success");
        break;
      }

      case 'logs':
        if (!convention) {
          alert("Erreur : Veuillez d'abord signer la convention.");
          return;
        }
        setLogbook([
          { week: 1, tasks: "Découverte de la codebase et configuration de l'environnement avec Vite.", difficulties: "Configuration Docker initiale un peu lente.", skills: "Vite, Git, Docker", date: "05/06/2026", supervisorFeedback: "Très bien pour un début." },
          { week: 2, tasks: "Création des premiers composants de formulaires réutilisables.", difficulties: "Gestion du state asynchrone complexe.", skills: "React Hooks, TypeScript", date: "12/06/2026", supervisorFeedback: "Excellent, continue ainsi." },
          { week: 3, tasks: "Intégration de la maquette dashboard avec Recharts et animations.", difficulties: "Alignement CSS sur mobile.", skills: "CSS Grid, Recharts", date: "19/06/2026", supervisorFeedback: null }
        ]);
        addToast("Simulation active", "3 semaines de carnet de bord pré-remplies !", "success");
        break;

      case 'archive':
        if (!convention) {
          alert("Erreur : Veuillez d'abord signer la convention.");
          return;
        }
        // Fill logs, upload report, grade and validate
        setLogbook([
          { week: 1, tasks: "Découverte de la codebase.", difficulties: "", skills: "Vite, Git", date: "05/06/2026", supervisorFeedback: "Bon départ." }
        ]);
        setConvention(prev => {
          if (!prev) return null;
          return {
            ...prev,
            studentSignature: "sig",
            enterpriseSignature: "sig",
            adminSignature: "sig",
            reportUploaded: true,
            reportFileName: "rapport_final_yanis.pdf",
            reportUploadDate: "19/06/2026",
            reportValidated: true,
            evaluation: {
              punctuality: 18,
              teamwork: 17,
              communication: 16,
              technical: 18,
              finalGrade: 17,
              feedback: "Excellent élément. Yanis a su s'intégrer rapidement et a fourni un travail de haute qualité."
            },
            stageFinished: true
          };
        });
        addToast("Simulation active", "Stage terminé, noté et validé ! Attestation disponible.", "success");
        addNotification("Attestation émise !", "Votre attestation officielle de fin de stage avec QR Code de vérification est disponible.", "success");
        break;

      case 'reset':
        setApplications([]);
        setConvention(null);
        setLogbook([]);
        setOffers(INITIAL_OFFERS);
        addToast("Simulation Réinitialisée", "Toutes les données ont été remises à zéro.", "info");
        break;

      default:
        break;
    }
  };

  if (showLanding && !isRegistered) {
    return (
      <LandingPage 
        onGetStarted={() => setShowLanding(false)}
        onSkipToDemo={() => {
          setShowLanding(false);
          setIsRegistered(true);
          addToast("Session de test activée", "Utilisation du profil par défaut (Yanis Belkacem).", "info");
        }}
      />
    );
  }

  if (!isRegistered) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(52, 211, 153, 0.12) 0%, transparent 40%)',
        padding: '20px'
      }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={28} style={{ color: 'var(--accent-pink)' }} />
              <h1 className="logo-text" style={{ fontSize: '2rem' }}>Stagix</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Création de compte étudiant pour accéder à la plateforme</p>
          </div>

          <form onSubmit={handleRegister}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Prénom</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  placeholder="Ex: Yanis" 
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Nom</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  placeholder="Ex: Belkacem" 
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Email académique</label>
              <input 
                type="email" 
                className="form-input" 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                placeholder="prenom.nom@etu.univ.fr" 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Filière</label>
                <select 
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  value={regBranch}
                  onChange={(e) => setRegBranch(e.target.value)}
                >
                  <option value="Génie Logiciel">Génie Logiciel</option>
                  <option value="Réseaux & Télécoms">Réseaux & Télécoms</option>
                  <option value="Sécurité Informatique">Sécurité Informatique</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Niveau d'étude</label>
                <select 
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  value={regLevel}
                  onChange={(e) => setRegLevel(e.target.value)}
                >
                  <option value="Licence 3">Licence 3</option>
                  <option value="Master 1">Master 1</option>
                  <option value="Master 2">Master 2</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Compétences initiales (séparées par des virgules)</label>
              <input 
                type="text" 
                className="form-input" 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                placeholder="Ex: React, Node.js, Python, Git" 
                value={regSkills}
                onChange={(e) => setRegSkills(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px' }}>
              Créer mon compte étudiant
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button 
              onClick={handleBypassRegistration}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Passer l'inscription (Profil de test Yanis Belkacem)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      
      {/* Top Global Control Bar */}
      <header className="top-control-bar">
        <div className="logo-container">
          <Sparkles size={20} style={{ color: 'var(--accent-pink)' }} />
          <h1 className="logo-text">Stagix</h1>
        </div>

        {/* Dynamic Role Selectors with customized glow active accents */}
        <div className="role-selectors">
          <button 
            className={`role-btn ${activeRole === 'student' ? 'active' : ''}`}
            onClick={() => setActiveRole('student')}
          >
            <Smartphone size={14} /> Étudiant (Mobile)
          </button>
          
          <button 
            className={`role-btn ${activeRole === 'enterprise' ? 'active' : ''}`}
            onClick={() => setActiveRole('enterprise')}
          >
            <Laptop size={14} /> Entreprise (Web)
          </button>
          
          <button 
            className={`role-btn ${activeRole === 'supervisor' ? 'active' : ''}`}
            onClick={() => setActiveRole('supervisor')}
          >
            <Laptop size={14} /> Encadreur (Web)
          </button>
          
          <button 
            className={`role-btn ${activeRole === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveRole('admin')}
          >
            <Laptop size={14} /> Admin (Web)
          </button>
          
          <button 
            className={`role-btn ${activeRole === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveRole('analysis')}
          >
            <GitBranch size={14} /> Analyse Top-Down
          </button>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={() => setIsNotifCenterOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '8px',
                height: '8px',
                background: 'var(--accent-pink)',
                borderRadius: '50%',
                boxShadow: '0 0 8px var(--accent-pink-glow)'
              }}></span>
            )}
          </button>
        </div>
      </header>

      {/* Main View Port */}
      <main className="main-content">
        
        {activeRole === 'student' && (
          <StudentMobile 
            studentProfile={studentProfile}
            updateStudentProfile={setStudentProfile}
            offers={offers}
            applications={applications}
            onApply={handleApply}
            convention={convention}
            onSignConvention={handleSignConvention}
            logbook={logbook}
            onSaveLogbook={handleSaveLogbook}
            onUploadReport={handleUploadReport}
            messages={messages}
            onSendMessage={handleSendMessage}
            activeContact={activeContact}
            setActiveContact={setActiveContact}
          />
        )}

        {activeRole === 'enterprise' && (
          <EnterpriseWeb 
            offers={offers.filter(o => o.company === "TechCorp")}
            allOffers={offers}
            onPublishOffer={handlePublishOffer}
            onDeleteOffer={handleDeleteOffer}
            applications={applications.filter(app => {
              const offer = offers.find(o => o.id === app.offerId);
              return offer && offer.company === "TechCorp";
            })}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
            convention={convention}
            onSignConvention={handleSignConvention}
            studentProfile={studentProfile}
            logbook={logbook}
            onEvaluateIntern={handleEvaluateIntern}
            messages={messages}
            onSendMessage={handleSendMessage}
            activeContact={activeContact}
            setActiveContact={setActiveContact}
          />
        )}

        {activeRole === 'supervisor' && (
          <SupervisorWeb 
            studentProfile={studentProfile}
            convention={convention}
            logbook={logbook}
            onAddLogFeedback={handleAddLogFeedback}
            onValidateReport={handleValidateReport}
            messages={messages}
            onSendMessage={handleSendMessage}
            activeContact={activeContact}
            setActiveContact={setActiveContact}
          />
        )}

        {activeRole === 'analysis' && (
          <TopDownAnalysis />
        )}

        {activeRole === 'admin' && (
          <AdminWeb 
            studentProfile={studentProfile}
            convention={convention}
            onSignConvention={handleSignConvention}
            onFinalizeStageArchive={handleFinalizeStageArchive}
          />
        )}

      </main>

      {/* Simulation controller bar at bottom */}
      <div className="simulation-ctrl-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
          <RefreshCw size={14} style={{ animation: 'spin 8s linear infinite' }} />
          <span>Contrôle de simulation :</span>
        </div>
        
        <button className="ctrl-btn" onClick={() => runSimulationStep('candidature')}>
          1. Simuler : Candidature d'un clic (Bascule Recruteur)
        </button>
        <button className="ctrl-btn" onClick={() => runSimulationStep('signature')}>
          2. Simuler : Signatures Électroniques complètes
        </button>
        <button className="ctrl-btn" onClick={() => runSimulationStep('logs')}>
          3. Simuler : Renseigner 3 semaines de carnet
        </button>
        <button className="ctrl-btn" onClick={() => runSimulationStep('archive')}>
          4. Simuler : Étape finale (Stage Terminé & Noté)
        </button>
        
        <div style={{ flex: 1 }}></div>
        
        <button 
          className="ctrl-btn" 
          style={{ color: 'var(--status-danger)', borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}
          onClick={() => runSimulationStep('reset')}
        >
          Réinitialiser la démo
        </button>
      </div>

      {/* Toast Alert popups */}
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      {/* Slide-in Notifications Center */}
      <NotificationCenter 
        notifications={notifications} 
        isOpen={isNotifCenterOpen} 
        onClose={() => setIsNotifCenterOpen(false)}
        onClearAll={() => setNotifications([])}
      />

    </div>
  );
}
