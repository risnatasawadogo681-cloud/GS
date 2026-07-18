import React, { useState } from 'react';
import { 
  Building2, Users, FileSignature, CheckSquare, PlusCircle, 
  Trash, MessageSquare, ClipboardList, PenTool, Check, X, Star, CheckCircle
} from 'lucide-react';
import SignaturePad from '../components/SignaturePad';
import ChatSimulator from '../components/ChatSimulator';
import QRCodeSimulator from '../components/QRCodeSimulator';

export default function EnterpriseWeb({
  offers = [],
  allOffers = [],
  onPublishOffer,
  onDeleteOffer,
  applications = [],
  onApproveApplication,
  onRejectApplication,
  convention,
  onSignConvention,
  studentProfile,
  logbook = [],
  onEvaluateIntern,
  messages = [],
  onSendMessage,
  activeContact,
  setActiveContact
}) {
  const [activeSubView, setActiveSubView] = useState('dashboard'); // dashboard, offers, candidates, docs, evaluation, chat
  
  // Offer Form States
  const [offerTitle, setOfferTitle] = useState('');
  const [offerBranch, setOfferBranch] = useState('Génie Logiciel');
  const [offerSkills, setOfferSkills] = useState('');
  const [offerLevel, setOfferLevel] = useState('Master 1');
  const [offerDuration, setOfferDuration] = useState('4 mois');
  const [offerLocation, setOfferLocation] = useState('Paris (Hybride)');
  const [offerDesc, setOfferDesc] = useState('');

  // Evaluation Form States
  const [gradePunctuality, setGradePunctuality] = useState(15);
  const [gradeTeamwork, setGradeTeamwork] = useState(15);
  const [gradeCommunication, setGradeCommunication] = useState(15);
  const [gradeTechnical, setGradeTechnical] = useState(15);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [isEvaluationSubmitted, setIsEvaluationSubmitted] = useState(false);

  const [showSignModal, setShowSignModal] = useState(false);

  // Match score calculation duplicate for candidate lists
  const calculateMatchScore = (skills = [], branch, level) => {
    let score = 0;
    if (branch.toLowerCase() === studentProfile.branch.toLowerCase()) score += 40;
    else if (branch.toLowerCase() === 'toutes' || branch.toLowerCase() === 'informatique') score += 20;

    const matchingSkills = skills.filter(skill => 
      studentProfile.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    const skillRatio = skills.length > 0 ? matchingSkills.length / skills.length : 0;
    score += skillRatio * 40;

    if (level.toLowerCase() === studentProfile.level.toLowerCase()) score += 20;
    else score += 10;

    return Math.round(score);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!offerTitle.trim()) return;
    
    const skillsArray = offerSkills.split(',').map(s => s.trim()).filter(s => s);
    onPublishOffer({
      title: offerTitle,
      branch: offerBranch,
      skills: skillsArray,
      level: offerLevel,
      duration: offerDuration,
      location: offerLocation,
      description: offerDesc
    });

    alert("Offre de stage publiée avec succès ! Elle apparaîtra immédiatement dans le flux de recommandations des étudiants.");
    
    // reset form
    setOfferTitle('');
    setOfferSkills('');
    setOfferDesc('');
    setActiveSubView('offers');
  };

  const handleEvaluationSubmit = (e) => {
    e.preventDefault();
    const finalGrade = Math.round((Number(gradePunctuality) + Number(gradeTeamwork) + Number(gradeCommunication) + Number(gradeTechnical)) / 4);
    
    onEvaluateIntern({
      punctuality: Number(gradePunctuality),
      teamwork: Number(gradeTeamwork),
      communication: Number(gradeCommunication),
      technical: Number(gradeTechnical),
      finalGrade,
      feedback: evaluationFeedback
    });

    setIsEvaluationSubmitted(true);
    alert(`Évaluation finale enregistrée ! Note de l'étudiant : ${finalGrade}/20. Attestation prête pour validation finale administrative.`);
  };

  return (
    <div className="web-layout animate-fade">
      {/* Sidebar */}
      <div className="web-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingLeft: '16px' }}>
          <Building2 color="var(--accent-purple)" size={24} />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>TechCorp Recruteur</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Portail Recruteur Web</span>
          </div>
        </div>

        <button 
          className={`sidebar-link ${activeSubView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSubView('dashboard')}
        >
          <ClipboardList size={18} /> Tableau de bord
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveSubView('offers')}
        >
          <PlusCircle size={18} /> Nos Offres de stage
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveSubView('candidates')}
        >
          <Users size={18} /> Candidatures reçues
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveSubView('docs')}
        >
          <FileSignature size={18} /> Signature & Convention
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'evaluation' ? 'active' : ''}`}
          onClick={() => setActiveSubView('evaluation')}
        >
          <CheckSquare size={18} /> Évaluation en ligne
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveSubView('chat')}
        >
          <MessageSquare size={18} /> Messagerie directe
        </button>
      </div>

      {/* Main Body */}
      <div className="web-body">
        
        {/* VIEW: DASHBOARD */}
        {activeSubView === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Tableau de bord de Recrutement</h2>
            
            <div className="stats-row">
              <div className="stat-card">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Offres publiées</span>
                  <div className="stat-value">{offers.length}</div>
                </div>
                <div className="stat-icon"><ClipboardList /></div>
              </div>

              <div className="stat-card">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Candidatures reçues</span>
                  <div className="stat-value">{applications.length}</div>
                </div>
                <div className="stat-icon"><Users style={{ color: 'var(--accent-blue)' }} /></div>
              </div>

              <div className="stat-card">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stagiaire Actif</span>
                  <div className="stat-value">{convention ? "1" : "0"}</div>
                </div>
                <div className="stat-icon"><Building2 style={{ color: 'var(--status-success)' }} /></div>
              </div>

              <div className="stat-card">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Note Moyenne</span>
                  <div className="stat-value">{convention?.evaluation ? `${convention.evaluation.finalGrade}/20` : "--"}</div>
                </div>
                <div className="stat-icon"><Star style={{ color: 'var(--status-warning)' }} /></div>
              </div>
            </div>

            {/* List active interns */}
            <div className="glass-panel" style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Stagiaires sous convention</h3>
              {convention ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Stagiaire</th>
                        <th>Poste</th>
                        <th>Période</th>
                        <th>Convention</th>
                        <th>Carnet (Saisies)</th>
                        <th>Rapport</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>{studentProfile.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{studentProfile.branch}</div>
                        </td>
                        <td>{convention.offerTitle}</td>
                        <td>En cours (4 mois)</td>
                        <td>
                          {convention.adminSignature ? (
                            <span className="badge badge-success">Active / Signée</span>
                          ) : (
                            <span className="badge badge-warning">Signature en cours</span>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-info">{logbook.length} semaines</span>
                        </td>
                        <td>
                          {convention.reportUploaded ? (
                            <span className="badge badge-success">Déposé</span>
                          ) : (
                            <span className="badge badge-danger">En attente</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aucun stagiaire actif actuellement. Validez des candidatures et signez des conventions pour démarrer un stage.</p>
              )}
            </div>
          </div>
        )}

        {/* VIEW: OFFERS */}
        {activeSubView === 'offers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem' }}>Nos Offres de Stage ({offers.length})</h2>
              <button 
                onClick={() => setActiveSubView('create-offer')}
                className="btn-primary"
              >
                <PlusCircle size={18} /> Publier une offre
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {offers.map((offer) => (
                <div key={offer.id} className="glass-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>{offer.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        Filière cible: <strong>{offer.branch}</strong> • Niveau: <strong>{offer.level}</strong> • Durée: <strong>{offer.duration}</strong>
                      </p>
                    </div>
                    <button 
                      onClick={() => onDeleteOffer(offer.id)}
                      className="btn-secondary"
                      style={{ color: 'var(--status-danger)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '6px 12px' }}
                    >
                      <Trash size={14} /> Supprimer
                    </button>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                    {offer.description}
                  </p>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '10px' }}>Compétences requises :</span>
                    {offer.skills.map((skill, index) => (
                      <span key={index} className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', marginRight: '6px' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: CREATE OFFER */}
        {activeSubView === 'create-offer' && (
          <div style={{ maxWidth: '700px' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Publier une nouvelle offre de stage</h2>
            <form onSubmit={handlePublish} className="glass-panel">
              <div className="form-group">
                <label className="form-label">Titre du poste</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Développeur React & Node.js"
                  value={offerTitle} 
                  onChange={(e) => setOfferTitle(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Filière cible</label>
                  <select 
                    className="form-input"
                    value={offerBranch}
                    onChange={(e) => setOfferBranch(e.target.value)}
                  >
                    <option value="Génie Logiciel">Génie Logiciel</option>
                    <option value="Réseaux & Télécoms">Réseaux & Télécoms</option>
                    <option value="Sécurité Informatique">Sécurité Informatique</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Toutes">Toutes les filières</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Niveau requis</label>
                  <select 
                    className="form-input"
                    value={offerLevel}
                    onChange={(e) => setOfferLevel(e.target.value)}
                  >
                    <option value="Licence 3">Licence 3</option>
                    <option value="Master 1">Master 1</option>
                    <option value="Master 2">Master 2</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Durée</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: 4 à 6 mois" 
                    value={offerDuration}
                    onChange={(e) => setOfferDuration(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Lieu</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Lyon (Présentiel)" 
                    value={offerLocation}
                    onChange={(e) => setOfferLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Compétences recherchées (séparées par des virgules)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: React, Node.js, TypeScript, SQL" 
                  value={offerSkills}
                  onChange={(e) => setOfferSkills(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description des tâches</label>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  placeholder="Détails du projet de stage et des missions..." 
                  value={offerDesc}
                  onChange={(e) => setOfferDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary">Publier l'offre</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setActiveSubView('offers')}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW: CANDIDATES */}
        {activeSubView === 'candidates' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Candidatures reçues ({applications.length})</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucune candidature active pour le moment.
                </div>
              ) : (
                applications.map((app) => {
                  const offerList = allOffers.length > 0 ? allOffers : offers;
                  const offer = offerList.find(o => o.id === app.offerId);
                  const matchScore = offer ? calculateMatchScore(offer.skills, offer.branch, offer.level) : 0;
                  
                  return (
                    <div key={app.id} className="glass-panel">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <span className="badge badge-match" style={{ marginBottom: '6px' }}>
                            Score de Recommandation : {matchScore}%
                          </span>
                          <h3 style={{ fontSize: '1.15rem' }}>{studentProfile.name}</h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Filière : {studentProfile.branch} • Niveau : {studentProfile.level}
                          </p>
                        </div>
                        <div>
                          {app.status === 'En attente' ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => {
                                  onApproveApplication(app.id);
                                  alert("Candidature validée ! La convention de stage a été générée.");
                                }}
                                className="btn-primary" 
                                style={{ background: 'linear-gradient(135deg, var(--status-success), #059669)', padding: '8px 12px', fontSize: '0.8rem' }}
                              >
                                <Check size={16} /> Accepter
                              </button>
                              <button 
                                onClick={() => onRejectApplication(app.id)}
                                className="btn-secondary" 
                                style={{ color: 'var(--status-danger)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '8px 12px', fontSize: '0.8rem' }}
                              >
                                <X size={16} /> Refuser
                              </button>
                            </div>
                          ) : (
                            <span className={`badge ${app.status === 'Accepté' ? 'badge-success' : 'badge-danger'}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}><strong>Postule pour l'offre :</strong> {offer?.title}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Compétences de l'étudiant :</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                          {studentProfile.skills.map((skill, index) => (
                            <span key={index} className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW: CONVENTION & SIGNATURE */}
        {activeSubView === 'docs' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Conventions de Stage</h2>

            {convention ? (
              <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>Convention N° CONV-{convention.id}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Stagiaire : {studentProfile.name} • Poste : {convention.offerTitle}
                    </p>
                  </div>
                  <div>
                    {!convention.enterpriseSignature ? (
                      <button 
                        onClick={() => setShowSignModal(true)}
                        className="btn-primary"
                      >
                        <PenTool size={16} /> Signer électroniquement
                      </button>
                    ) : (
                      <span className="badge badge-success">Signé par l'Entreprise</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                  {/* Miniature simulation of the PDF */}
                  <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '8px', color: '#111827' }}>
                    <div style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '10px', marginBottom: '14px', textAlign: 'center' }}>
                      <h4 style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: '#6d28d9', letterSpacing: '0.05em' }}>Convention de Stage Professionnel</h4>
                    </div>
                    
                    <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <p><strong>1. PARTIES :</strong></p>
                      <p>• L'école / administration universitaire</p>
                      <p>• L'entreprise d'accueil : TechCorp</p>
                      <p>• Le stagiaire : M. {studentProfile.name}</p>
                      <p style={{ marginTop: '8px' }}><strong>2. PROJET DE STAGE :</strong></p>
                      <p>Le stagiaire exercera les fonctions de <em>{convention.offerTitle}</em>.</p>
                      <p>La durée est fixée à {convention.duration} sous la supervision de l'administration.</p>
                      
                      <div className="pdf-signatures" style={{ marginTop: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
                        <div className="pdf-signature-box">
                          <span>Étudiant</span>
                          {convention.studentSignature ? (
                            <img src={convention.studentSignature} className="pdf-signature-img" alt="signature etu" />
                          ) : (
                            <div className="pdf-signature-missing">Non signé</div>
                          )}
                        </div>
                        <div className="pdf-signature-box">
                          <span>Entreprise</span>
                          {convention.enterpriseSignature ? (
                            <img src={convention.enterpriseSignature} className="pdf-signature-img" alt="signature ent" />
                          ) : (
                            <div className="pdf-signature-missing">Non signé</div>
                          )}
                        </div>
                        <div className="pdf-signature-box">
                          <span>Administration</span>
                          {convention.adminSignature ? (
                            <img src={convention.adminSignature} className="pdf-signature-img" alt="signature admin" />
                          ) : (
                            <div className="pdf-signature-missing">Non signé</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>Suivi des signatures</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <Check size={16} color={convention.studentSignature ? "var(--status-success)" : "var(--text-muted)"} />
                        <span>Étudiant : {convention.studentSignature ? "Signé" : "En attente"}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <Check size={16} color={convention.enterpriseSignature ? "var(--status-success)" : "var(--text-muted)"} />
                        <span>Entreprise : {convention.enterpriseSignature ? "Signé" : "En attente"}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <Check size={16} color={convention.adminSignature ? "var(--status-success)" : "var(--text-muted)"} />
                        <span>Administration : {convention.adminSignature ? "Signé" : "En attente"}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <QRCodeSimulator value={`https://stagix.net/verify/conv-${convention.id}`} size={100} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Scan QR code d'authenticité</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Aucune convention active. Les conventions apparaissent lorsqu'une candidature est acceptée.
              </div>
            )}
          </div>
        )}

        {/* VIEW: EVALUATION */}
        {activeSubView === 'evaluation' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Grille d'évaluation en ligne</h2>

            {!convention ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Aucun stagiaire actif à évaluer.
              </div>
            ) : !convention.reportUploaded ? (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Évaluation indisponible</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Le stagiaire <strong>{studentProfile.name}</strong> n'a pas encore déposé son rapport final. Vous pourrez compléter la grille d'évaluation après le dépôt de son rapport.
                </p>
              </div>
            ) : isEvaluationSubmitted || convention.evaluation ? (
              <div className="glass-panel">
                <h3 style={{ fontSize: '1.2rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircle size={20} /> Évaluation enregistrée avec succès !
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ponctualité</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>{convention.evaluation?.punctuality || gradePunctuality}/20</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Travail d'équipe</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>{convention.evaluation?.teamwork || gradeTeamwork}/20</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Communication</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>{convention.evaluation?.communication || gradeCommunication}/20</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Compétences Tech</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>{convention.evaluation?.technical || gradeTechnical}/20</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-purple)' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Note Finale : {convention.evaluation?.finalGrade || Math.round((Number(gradePunctuality) + Number(gradeTeamwork) + Number(gradeCommunication) + Number(gradeTechnical)) / 4)}/20</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <strong>Commentaires :</strong> {convention.evaluation?.feedback || evaluationFeedback}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEvaluationSubmit} className="glass-panel">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Évaluation de {studentProfile.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Stage de {convention.offerTitle} • Évaluez l'étudiant sur une note de 0 à 20 pour chaque critère.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Ponctualité & Assiduité ({gradePunctuality}/20)</label>
                    <input 
                      type="range" min="0" max="20" step="1" 
                      style={{ width: '100%', accentColor: 'var(--accent-purple)' }} 
                      value={gradePunctuality}
                      onChange={(e) => setGradePunctuality(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Travail d'équipe & Intégration ({gradeTeamwork}/20)</label>
                    <input 
                      type="range" min="0" max="20" step="1" 
                      style={{ width: '100%', accentColor: 'var(--accent-purple)' }} 
                      value={gradeTeamwork}
                      onChange={(e) => setGradeTeamwork(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Communication & Initiative ({gradeCommunication}/20)</label>
                    <input 
                      type="range" min="0" max="20" step="1" 
                      style={{ width: '100%', accentColor: 'var(--accent-purple)' }} 
                      value={gradeCommunication}
                      onChange={(e) => setGradeCommunication(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Compétences Techniques ({gradeTechnical}/20)</label>
                    <input 
                      type="range" min="0" max="20" step="1" 
                      style={{ width: '100%', accentColor: 'var(--accent-purple)' }} 
                      value={gradeTechnical}
                      onChange={(e) => setGradeTechnical(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label className="form-label">Appréciations globales</label>
                  <textarea 
                    className="form-input" 
                    rows={3} 
                    placeholder="Excellent travail, à l'écoute, forte progression..."
                    value={evaluationFeedback}
                    onChange={(e) => setEvaluationFeedback(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Note Moyenne Calculée : {Math.round((Number(gradePunctuality) + Number(gradeTeamwork) + Number(gradeCommunication) + Number(gradeTechnical)) / 4)}/20
                  </div>
                  <button type="submit" className="btn-primary">
                    Valider la grille d'évaluation
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* VIEW: CHAT */}
        {activeSubView === 'chat' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Messagerie de recrutement</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button 
                onClick={() => setActiveContact("Étudiant (Yanis)")}
                className={`ctrl-btn ${activeContact === "Étudiant (Yanis)" ? 'active' : ''}`}
                style={{ background: activeContact === "Étudiant (Yanis)" ? 'var(--accent-purple)' : '', color: activeContact === "Étudiant (Yanis)" ? '#fff' : '' }}
              >
                Stagiaire (Yanis)
              </button>
              <button 
                onClick={() => setActiveContact("Administration")}
                className={`ctrl-btn ${activeContact === "Administration" ? 'active' : ''}`}
                style={{ background: activeContact === "Administration" ? 'var(--accent-purple)' : '', color: activeContact === "Administration" ? '#fff' : '' }}
              >
                Administration
              </button>
            </div>
            <ChatSimulator 
              currentUserRole="enterprise"
              messages={messages}
              onSendMessage={onSendMessage}
              activeContact={activeContact}
            />
          </div>
        )}

      </div>

      {/* SIGNATURE MODAL */}
      {showSignModal && (
        <div className="modal-overlay" onClick={() => setShowSignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Signature de l'Entreprise</h4>
              <button onClick={() => setShowSignModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              En apposant la signature, <strong>TechCorp</strong> s'engage à encadrer M. <strong>{studentProfile.name}</strong> conformément aux clauses de la convention.
            </p>
            <SignaturePad 
              onSave={(dataUrl) => {
                if (dataUrl) {
                  onSignConvention('enterprise', dataUrl);
                  setShowSignModal(false);
                  alert("Signature de l'entreprise apposée ! En attente de la validation finale de l'administration.");
                }
              }}
              placeholder="Signature autorisée de l'entreprise"
            />
          </div>
        </div>
      )}

    </div>
  );
}
