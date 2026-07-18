import React, { useState } from 'react';
import { 
  Search, Briefcase, FileText, BookOpen, MessageSquare, 
  User, Check, ChevronRight, Award, Edit, Plus, X 
} from 'lucide-react';
import SignaturePad from '../components/SignaturePad';
import QRCodeSimulator from '../components/QRCodeSimulator';
import ChatSimulator from '../components/ChatSimulator';

export default function StudentMobile({ 
  studentProfile,
  updateStudentProfile,
  offers = [],
  applications = [],
  onApply,
  convention,
  onSignConvention,
  logbook = [],
  onSaveLogbook,
  onUploadReport,
  messages = [],
  onSendMessage,
  activeContact,
  setActiveContact
}) {
  const [activeTab, setActiveTab] = useState('home'); // home, apps, doc, log, chat
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [logTasks, setLogTasks] = useState('');
  const [logDifficulties, setLogDifficulties] = useState('');
  const [logSkills, setLogSkills] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);

  // Simple algorithm for matching score
  const calculateMatchScore = (offer) => {
    let score = 0;
    const totalCriteria = 3;
    
    // 1. Branch match (filière)
    if (offer.branch.toLowerCase() === studentProfile.branch.toLowerCase()) {
      score += 40;
    } else if (offer.branch.toLowerCase() === 'toutes' || offer.branch.toLowerCase() === 'informatique') {
      score += 20;
    }
    
    // 2. Skill match
    const matchingSkills = offer.skills.filter(skill => 
      studentProfile.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    const skillRatio = offer.skills.length > 0 ? matchingSkills.length / offer.skills.length : 0;
    score += skillRatio * 40;

    // 3. Level match
    if (offer.level.toLowerCase() === studentProfile.level.toLowerCase()) {
      score += 20;
    } else {
      score += 10;
    }

    return Math.round(score);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepté': return <span className="badge badge-success">Accepté</span>;
      case 'Refusé': return <span className="badge badge-danger">Refusé</span>;
      case 'Validation Admin': return <span className="badge badge-warning">Validation Admin</span>;
      default: return <span className="badge badge-info">En attente</span>;
    }
  };

  const handleSaveWeek = (e) => {
    e.preventDefault();
    if (!logTasks.trim()) return;
    onSaveLogbook(selectedWeek, logTasks, logDifficulties, logSkills);
    alert(`Carnet de bord pour la Semaine ${selectedWeek} enregistré avec succès !`);
    setLogTasks('');
    setLogDifficulties('');
    setLogSkills('');
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportFile) return;
    setIsUploading(true);
    setTimeout(() => {
      onUploadReport(reportFile);
      setIsUploading(false);
      alert("Votre rapport de stage a été déposé avec succès ! En attente d'évaluation de votre encadreur.");
    }, 1500);
  };

  // Sort offers by match score (highest first)
  const matchingOffers = offers
    .map(offer => ({ ...offer, matchScore: calculateMatchScore(offer) }))
    .filter(offer => searchQuery === '' || offer.title.toLowerCase().includes(searchQuery.toLowerCase()) || offer.company.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="phone-simulator-container">
      <div className="phone-device">
        <div className="phone-screen">
          {/* Status Bar */}
          <div className="phone-header">
            <span>11:15</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span>📶</span>
              <span>🔋 98%</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="phone-body">
            
            {/* Header branding */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 600, uppercase: 'true' }}>STAGIX MOBILE</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Bonjour, {studentProfile.name}</h3>
              </div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '6px', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}
              >
                <User size={16} />
              </button>
            </div>

            {/* TAB: HOME (Find internship) */}
            {activeTab === 'home' && (
              <div className="animate-fade">
                {/* Search Bar */}
                <div style={{ display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 12px', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
                  <Search size={16} color="var(--text-secondary)" />
                  <input 
                    type="text" 
                    placeholder="Rechercher un stage..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.8rem', width: '100%' }}
                  />
                </div>

                {/* Profile brief with Recommender trigger */}
                <div className="glass-panel" style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid var(--accent-purple)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Profil de matching</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{studentProfile.branch} ({studentProfile.level})</p>
                    </div>
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <Edit size={12} /> Modifier
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                    {studentProfile.skills.map((skill, i) => (
                      <span key={i} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.65rem', padding: '2px 6px' }}>{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Recommendations Title */}
                <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: 600 }}>Offres recommandées pour vous</h4>
                
                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {matchingOffers.map((offer) => {
                    const isApplied = applications.some(app => app.offerId === offer.id);
                    return (
                      <div key={offer.id} className="glass-panel" style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className="badge badge-match" style={{ fontSize: '0.6rem', marginBottom: '4px' }}>
                              Score Match: {offer.matchScore}%
                            </span>
                            <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{offer.title}</h5>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{offer.company} • {offer.location}</p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '8px 0' }}>
                          {offer.skills.map((s, i) => (
                            <span key={i} className="badge" style={{ background: 'rgba(139, 92, 246, 0.05)', color: 'var(--accent-purple)', fontSize: '0.6rem', padding: '2px 5px' }}>{s}</span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Durée: {offer.duration}</span>
                          {isApplied ? (
                            <button className="btn-primary" disabled style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                              Postulé
                            </button>
                          ) : (
                            <button 
                              onClick={() => onApply(offer.id)}
                              className="btn-primary" 
                              style={{ padding: '5px 10px', fontSize: '0.7rem', borderRadius: '6px' }}
                            >
                              Postuler
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: APPLICATIONS */}
            {activeTab === 'apps' && (
              <div className="animate-fade">
                <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>Mes Candidatures ({applications.length})</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {applications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Aucune candidature envoyée pour le moment.
                    </div>
                  ) : (
                    applications.map((app) => {
                      const offer = offers.find(o => o.id === app.offerId);
                      return (
                        <div key={app.id} className="glass-panel" style={{ padding: '14px', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Postulé le {app.date}</span>
                            {getStatusBadge(app.status)}
                          </div>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{offer?.title || "Offre de stage"}</h5>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{offer?.company}</p>
                          
                          {app.status === 'Accepté' && !convention && (
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--status-success)' }}>Convention disponible !</span>
                              <button 
                                onClick={() => setActiveTab('doc')}
                                className="btn-primary"
                                style={{ padding: '4px 8px', fontSize: '0.65rem', borderRadius: '6px' }}
                              >
                                Signer la convention
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB: DOCUMENTS (Convention & Certificate) */}
            {activeTab === 'doc' && (
              <div className="animate-fade">
                <h4 style={{ fontSize: '1rem', marginBottom: '12px', fontWeight: 600 }}>Documents de Stage</h4>
                
                {/* Convention Section */}
                <div className="glass-panel" style={{ padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Convention de stage</h5>
                    {!convention ? (
                      <span className="badge badge-danger">Non générée</span>
                    ) : convention.adminSignature ? (
                      <span className="badge badge-success">Validée & Signée</span>
                    ) : (
                      <span className="badge badge-warning">En cours de signature</span>
                    )}
                  </div>

                  {convention ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <p style={{ marginBottom: '6px' }}><strong>Stage :</strong> {convention.offerTitle} chez {convention.companyName}</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '10px 0', background: 'rgba(0,0,0,0.1)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Signature Étudiant :</span>
                          <span style={{ color: convention.studentSignature ? 'var(--status-success)' : 'var(--status-danger)' }}>
                            {convention.studentSignature ? "Signé" : "En attente"}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Signature Entreprise :</span>
                          <span style={{ color: convention.enterpriseSignature ? 'var(--status-success)' : 'var(--status-danger)' }}>
                            {convention.enterpriseSignature ? "Signé" : "En attente"}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Signature Administration :</span>
                          <span style={{ color: convention.adminSignature ? 'var(--status-success)' : 'var(--status-danger)' }}>
                            {convention.adminSignature ? "Signé" : "En attente"}
                          </span>
                        </div>
                      </div>

                      {/* Sign Button */}
                      {!convention.studentSignature && (
                        <button 
                          onClick={() => setShowSignModal(true)}
                          className="btn-primary" 
                          style={{ width: '100%', padding: '8px', fontSize: '0.75rem', borderRadius: '8px', marginTop: '10px' }}
                        >
                          Apposer ma signature
                        </button>
                      )}

                      {/* Preview / QR Code */}
                      {convention.studentSignature && (
                        <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <QRCodeSimulator value={`https://stagix.net/verify/conv-${convention.id}`} size={60} />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.7rem', color: 'var(--text-primary)' }}>Convention Sécurisée</p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ID: CONV-{convention.id}</p>
                            <a 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                alert("Téléchargement du PDF de la convention...");
                              }}
                              style={{ color: 'var(--accent-purple)', fontSize: '0.7rem', textDecoration: 'underline' }}
                            >
                              Télécharger le PDF
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>La convention sera générée automatiquement après validation de votre candidature par l'entreprise.</p>
                  )}
                </div>

                {/* Certificate Section */}
                <div className="glass-panel" style={{ padding: '14px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Attestation de fin de stage</h5>
                    {convention?.stageFinished ? (
                      <span className="badge badge-success">Générée</span>
                    ) : (
                      <span className="badge badge-danger">Non disponible</span>
                    )}
                  </div>

                  {convention?.stageFinished ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <p style={{ marginBottom: '6px' }}>Félicitations ! Votre stage a été validé et archivé par l'administration.</p>
                      
                      <div style={{ marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <QRCodeSimulator value={`https://stagix.net/verify/cert-${convention.id}`} size={60} />
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.7rem', color: 'var(--text-primary)' }}>Attestation d'Authenticité</p>
                          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Réf: CERT-{convention.id}</p>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Téléchargement de votre attestation PDF officielle...");
                            }}
                            style={{ color: 'var(--accent-purple)', fontSize: '0.7rem', textDecoration: 'underline' }}
                          >
                            Télécharger l'Attestation
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>L'attestation sera générée dès la fin de votre stage et la validation de votre rapport.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: LOGBOOK (Carnet de bord & Rapport) */}
            {activeTab === 'log' && (
              <div className="animate-fade">
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '14px', gap: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', paddingBottom: '6px', fontWeight: 600, borderBottom: '2px solid var(--accent-purple)', color: 'var(--text-primary)' }}>Carnet de bord</h4>
                </div>

                {!convention ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Aucun stage actif. La saisie du carnet de bord requiert un stage en cours.
                  </div>
                ) : (
                  <div>
                    {/* Weekly Form */}
                    <form onSubmit={handleSaveWeek} className="glass-panel" style={{ padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px' }}>Renseigner mon carnet de bord</h5>
                      
                      <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Choisir la semaine</label>
                        <select 
                          className="form-input" 
                          style={{ padding: '6px', fontSize: '0.75rem' }}
                          value={selectedWeek}
                          onChange={(e) => setSelectedWeek(Number(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5, 6].map(w => (
                            <option key={w} value={w}>Semaine {w}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Tâches effectuées</label>
                        <textarea 
                          className="form-input"
                          rows={2}
                          style={{ padding: '6px', fontSize: '0.75rem', resize: 'none' }}
                          placeholder="Qu'avez-vous fait cette semaine ?"
                          value={logTasks}
                          onChange={(e) => setLogTasks(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Difficultés rencontrées</label>
                        <textarea 
                          className="form-input"
                          rows={2}
                          style={{ padding: '6px', fontSize: '0.75rem', resize: 'none' }}
                          placeholder="Quels obstacles avez-vous surmontés ?"
                          value={logDifficulties}
                          onChange={(e) => setLogDifficulties(e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Compétences acquises</label>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ padding: '6px', fontSize: '0.75rem' }}
                          placeholder="Ex: React hooks, bases de données..."
                          value={logSkills}
                          onChange={(e) => setLogSkills(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn-primary" style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }}>
                        Soumettre la semaine
                      </button>
                    </form>

                    {/* Display existing weeks */}
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Historique de suivi</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {logbook.length === 0 ? (
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Aucune semaine renseignée pour l'instant.</p>
                      ) : (
                        logbook.map((entry, idx) => (
                          <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>Semaine {entry.week}</span>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Saisie le {entry.date}</span>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}><strong>Tâches:</strong> {entry.tasks}</p>
                            {entry.difficulties && <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}><strong>Difficultés:</strong> {entry.difficulties}</p>}
                            {entry.skills && <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}><strong>Compétences:</strong> {entry.skills}</p>}
                            
                            {entry.supervisorFeedback ? (
                              <div style={{ marginTop: '6px', background: 'rgba(139, 92, 246, 0.08)', padding: '6px', borderRadius: '4px', borderLeft: '2px solid var(--accent-purple)' }}>
                                <p style={{ fontSize: '0.65rem', color: 'var(--accent-purple)' }}><strong>Avis de l'encadreur :</strong> {entry.supervisorFeedback}</p>
                              </div>
                            ) : (
                              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>En attente d'observations de l'encadreur.</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Report upload */}
                    <div className="glass-panel" style={{ padding: '14px', borderRadius: '12px', marginTop: '20px' }}>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Dépôt du rapport final</h5>
                      {convention.reportUploaded ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--status-success-bg)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          <Check size={16} style={{ color: 'var(--status-success)' }} />
                          <span style={{ fontSize: '0.7rem', color: 'var(--status-success)' }}>Rapport déposé : {convention.reportFileName}</span>
                        </div>
                      ) : (
                        <form onSubmit={handleReportSubmit}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Chargez votre rapport de stage final au format PDF.</p>
                          <input 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => setReportFile(e.target.files[0]?.name || 'rapport_de_stage.pdf')}
                            style={{ display: 'none' }}
                            id="mobile-report-file"
                            required
                          />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <label 
                              htmlFor="mobile-report-file" 
                              className="btn-secondary" 
                              style={{ flex: 1, padding: '6px', fontSize: '0.7rem', cursor: 'pointer', textAlign: 'center' }}
                            >
                              {reportFile ? reportFile : "Sélectionner PDF"}
                            </label>
                            <button 
                              type="submit" 
                              className="btn-primary" 
                              style={{ flex: 1, padding: '6px', fontSize: '0.7rem' }}
                              disabled={!reportFile || isUploading}
                            >
                              {isUploading ? "Dépôt..." : "Déposer"}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CHAT */}
            {activeTab === 'chat' && (
              <div className="animate-fade">
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <button 
                    onClick={() => setActiveContact("Entreprise (TechCorp)")}
                    className={`ctrl-btn ${activeContact === "Entreprise (TechCorp)" ? 'active' : ''}`}
                    style={{ flex: 1, background: activeContact === "Entreprise (TechCorp)" ? 'var(--accent-purple)' : '', color: activeContact === "Entreprise (TechCorp)" ? '#fff' : '' }}
                  >
                    Recruteur
                  </button>
                  <button 
                    onClick={() => setActiveContact("Encadreur (Dr. Martin)")}
                    className={`ctrl-btn ${activeContact === "Encadreur (Dr. Martin)" ? 'active' : ''}`}
                    style={{ flex: 1, background: activeContact === "Encadreur (Dr. Martin)" ? 'var(--accent-purple)' : '', color: activeContact === "Encadreur (Dr. Martin)" ? '#fff' : '' }}
                  >
                    Encadreur
                  </button>
                </div>
                <ChatSimulator 
                  currentUserRole="student"
                  messages={messages}
                  onSendMessage={onSendMessage}
                  activeContact={activeContact}
                />
              </div>
            )}

          </div>

          {/* Tab navigation */}
          <div className="phone-navbar">
            <button className={`phone-nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              <Briefcase size={20} />
              <span>Stages</span>
            </button>
            <button className={`phone-nav-item ${activeTab === 'apps' ? 'active' : ''}`} onClick={() => setActiveTab('apps')}>
              <FileText size={20} />
              <span>Postuler</span>
            </button>
            <button className={`phone-nav-item ${activeTab === 'doc' ? 'active' : ''}`} onClick={() => setActiveTab('doc')}>
              <Award size={20} />
              <span>Documents</span>
            </button>
            <button className={`phone-nav-item ${activeTab === 'log' ? 'active' : ''}`} onClick={() => setActiveTab('log')}>
              <BookOpen size={20} />
              <span>Suivi</span>
            </button>
            <button className={`phone-nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <MessageSquare size={20} />
              <span>Chat</span>
            </button>
          </div>

          {/* Android Home Indicator */}
          <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', zIndex: 1000 }}></div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="modal-overlay" onClick={() => setIsEditingProfile(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '340px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Modifier le profil</h4>
              <button onClick={() => setIsEditingProfile(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Nom complet (Nom & Prénom)</label>
              <input 
                type="text" 
                className="form-input" 
                style={{ padding: '6px', fontSize: '0.8rem' }}
                value={studentProfile.name} 
                onChange={(e) => updateStudentProfile({ ...studentProfile, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Email académique</label>
              <input 
                type="email" 
                className="form-input" 
                style={{ padding: '6px', fontSize: '0.8rem' }}
                value={studentProfile.email || "yanis.belkacem@etu.univ.fr"} 
                onChange={(e) => updateStudentProfile({ ...studentProfile, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Filière</label>
              <input 
                type="text" 
                className="form-input" 
                style={{ padding: '6px', fontSize: '0.8rem' }}
                value={studentProfile.branch} 
                onChange={(e) => updateStudentProfile({ ...studentProfile, branch: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Niveau d'étude</label>
              <select 
                className="form-input"
                style={{ padding: '6px', fontSize: '0.8rem' }}
                value={studentProfile.level}
                onChange={(e) => updateStudentProfile({ ...studentProfile, level: e.target.value })}
              >
                <option value="Licence 3">Licence 3</option>
                <option value="Master 1">Master 1</option>
                <option value="Master 2">Master 2</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Compétences</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                {studentProfile.skills.map((skill, index) => (
                  <span key={index} className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => updateStudentProfile({ ...studentProfile, skills: studentProfile.skills.filter((_, i) => i !== index) })}
                      style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  placeholder="Nouvelle compétence" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (newSkill.trim()) {
                      updateStudentProfile({ ...studentProfile, skills: [...studentProfile.skills, newSkill.trim()] });
                      setNewSkill('');
                    }
                  }}
                  className="btn-primary" 
                  style={{ padding: '4px 8px', borderRadius: '6px' }}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            <button onClick={() => setIsEditingProfile(false)} className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}>
              Valider le profil
            </button>
          </div>
        </div>
      )}

      {/* SIGN CONVENTION MODAL */}
      {showSignModal && (
        <div className="modal-overlay" onClick={() => setShowSignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '340px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Signature Électronique</h4>
              <button onClick={() => setShowSignModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              En signant ce document, vous acceptez les termes de la convention de stage pour le poste de <strong>{convention?.offerTitle}</strong>.
            </p>
            <SignaturePad 
              onSave={(dataUrl) => {
                if (dataUrl) {
                  onSignConvention('student', dataUrl);
                  setShowSignModal(false);
                  alert("Signature électronique enregistrée avec succès ! En attente des signatures de l'entreprise et de l'administration.");
                }
              }}
              placeholder="Signer avec votre doigt/souris"
            />
          </div>
        </div>
      )}

    </div>
  );
}
