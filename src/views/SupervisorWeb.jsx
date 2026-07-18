import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, FileCheck, MessageSquare, 
  Check, MessageCircle, AlertCircle, Calendar, ShieldCheck 
} from 'lucide-react';
import ChatSimulator from '../components/ChatSimulator';

export default function SupervisorWeb({
  studentProfile,
  convention,
  logbook = [],
  onAddLogFeedback,
  onValidateReport,
  messages = [],
  onSendMessage,
  activeContact,
  setActiveContact
}) {
  const [activeSubView, setActiveSubView] = useState('list'); // list, logbook, reports, chat
  const [selectedLogWeek, setSelectedLogWeek] = useState(1);
  const [feedbackText, setFeedbackText] = useState('');
  const [isReportApproved, setIsReportApproved] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    onAddLogFeedback(selectedLogWeek, feedbackText);
    alert(`Observation pour la Semaine ${selectedLogWeek} enregistrée ! L'étudiant la verra instantanément sur son carnet de bord mobile.`);
    setFeedbackText('');
  };

  const handleReportValidation = (e) => {
    e.preventDefault();
    onValidateReport();
    setIsReportApproved(true);
    alert("Rapport validé avec succès académique ! Transmission de l'attestation finale pour signature administrative.");
  };

  return (
    <div className="web-layout animate-fade">
      {/* Sidebar */}
      <div className="web-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingLeft: '16px' }}>
          <GraduationCap color="var(--accent-purple)" size={24} />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Dr. Martin</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Encadreur Académique</span>
          </div>
        </div>

        <button 
          className={`sidebar-link ${activeSubView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveSubView('list')}
        >
          <GraduationCap size={18} /> Suivi des stagiaires
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'logbook' ? 'active' : ''}`}
          onClick={() => setActiveSubView('logbook')}
        >
          <BookOpen size={18} /> Carnets de bord
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveSubView('reports')}
        >
          <FileCheck size={18} /> Évaluation Rapport
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveSubView('chat')}
        >
          <MessageSquare size={18} /> Messagerie intégrée
        </button>
      </div>

      {/* Main Body */}
      <div className="web-body">
        
        {/* VIEW: STUDENT LIST */}
        {activeSubView === 'list' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Étudiants Encadrés</h2>
            
            <div className="glass-panel">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Liste de suivi académique</h3>
              
              {convention ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Étudiant</th>
                        <th>Entreprise</th>
                        <th>Sujet / Poste</th>
                        <th>État d'avancement</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>{studentProfile.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{studentProfile.branch} ({studentProfile.level})</div>
                        </td>
                        <td>
                          <strong>TechCorp</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tuteur: M. Recruteur</div>
                        </td>
                        <td>{convention.offerTitle}</td>
                        <td>
                          {convention.stageFinished ? (
                            <span className="badge badge-success">Archivé / Terminé</span>
                          ) : convention.reportValidated ? (
                            <span className="badge badge-success">Rapport Validé</span>
                          ) : convention.reportUploaded ? (
                            <span className="badge badge-info">Rapport soumis</span>
                          ) : (
                            <span className="badge badge-warning">Stage en cours</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => setActiveSubView('logbook')}
                              className="btn-secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              Carnet
                            </button>
                            {convention.reportUploaded && !convention.reportValidated && (
                              <button 
                                onClick={() => setActiveSubView('reports')}
                                className="btn-primary" 
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                Évaluer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aucun stage n'est actuellement actif pour les étudiants assignés sous votre encadrement.</p>
              )}
            </div>
          </div>
        )}

        {/* VIEW: LOGBOOKS */}
        {activeSubView === 'logbook' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Suivi des Carnets de bord</h2>

            {!convention ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Aucun carnet de bord disponible.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
                
                {/* Log history */}
                <div className="glass-panel">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Carnet de bord : {studentProfile.name}</h3>
                  
                  {logbook.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>L'étudiant n'a pas encore fait de saisie dans son carnet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {logbook.map((entry, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            background: 'rgba(255, 255, 255, 0.02)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '8px', 
                            padding: '16px' 
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Semaine {entry.week}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saisie le {entry.date}</span>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <p><strong>Tâches effectuées :</strong> {entry.tasks}</p>
                            {entry.difficulties && <p><strong>Difficultés rencontrées :</strong> {entry.difficulties}</p>}
                            {entry.skills && <p><strong>Compétences mobilisées :</strong> {entry.skills}</p>}
                          </div>

                          {entry.supervisorFeedback && (
                            <div style={{ marginTop: '12px', background: 'rgba(139, 92, 246, 0.05)', borderLeft: '3px solid var(--accent-purple)', padding: '10px', borderRadius: '4px' }}>
                              <p style={{ fontSize: '0.8rem', color: 'var(--accent-purple)' }}>
                                <strong>Votre observation :</strong> {entry.supervisorFeedback}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feedback form */}
                <div className="glass-panel">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Laisser une observation</h3>
                  <form onSubmit={handleFeedbackSubmit}>
                    <div className="form-group">
                      <label className="form-label">Semaine visée</label>
                      <select 
                        className="form-input"
                        value={selectedLogWeek}
                        onChange={(e) => setSelectedLogWeek(Number(e.target.value))}
                      >
                        {logbook.map(entry => (
                          <option key={entry.week} value={entry.week}>Semaine {entry.week}</option>
                        ))}
                        {logbook.length === 0 && <option value="1">Aucune semaine disponible</option>}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Remarques & conseils</label>
                      <textarea 
                        className="form-input" 
                        rows={4}
                        placeholder="Renseignez vos directives, conseils de correction ou encouragements..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        required
                        disabled={logbook.length === 0}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ width: '100%' }}
                      disabled={logbook.length === 0}
                    >
                      <MessageCircle size={16} /> Envoyer l'observation
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>
        )}

        {/* VIEW: REPORTS */}
        {activeSubView === 'reports' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Évaluation du Rapport Final</h2>

            {!convention ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Aucun rapport disponible.
              </div>
            ) : !convention.reportUploaded ? (
              <div className="glass-panel">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>En attente du dépôt</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  L'étudiant <strong>{studentProfile.name}</strong> n'a pas encore mis en ligne son fichier de rapport de stage final.
                </p>
              </div>
            ) : (
              <div className="glass-panel" style={{ maxWidth: '750px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '14px' }}>Rapport soumis par l'étudiant</h3>
                
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)', padding: '12px', borderRadius: '6px' }}>
                    PDF
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{convention.reportFileName}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Taille: 4.8 Mo • Soumis le {convention.reportUploadDate || "Aujourd'hui"}</p>
                  </div>
                  <button 
                    onClick={() => alert("Simulation du téléchargement du fichier PDF de rapport...")} 
                    className="btn-secondary"
                  >
                    Télécharger
                  </button>
                </div>

                {convention.reportValidated || isReportApproved ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--status-success-bg)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '8px', color: 'var(--status-success)' }}>
                    <ShieldCheck size={24} />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Rapport officiellement validé académiquement !</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        La note de l'entreprise a été enregistrée. L'administration peut procéder à la validation finale du stage.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReportValidation} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px' }}>Approbation académique</h4>
                    
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      En cliquant sur le bouton ci-dessous, vous certifiez avoir examiné le rapport écrit de stage et l'autorisez pour validation de l'obtention des crédits académiques.
                    </p>

                    <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--status-success), #059669)' }}>
                      <Check size={18} /> Valider le rapport de stage
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW: CHAT */}
        {activeSubView === 'chat' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Messagerie de supervision</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button 
                onClick={() => setActiveContact("Étudiant (Yanis)")}
                className={`ctrl-btn ${activeContact === "Étudiant (Yanis)" ? 'active' : ''}`}
                style={{ background: activeContact === "Étudiant (Yanis)" ? 'var(--accent-purple)' : '', color: activeContact === "Étudiant (Yanis)" ? '#fff' : '' }}
              >
                Stagiaire (Yanis)
              </button>
              <button 
                onClick={() => setActiveContact("Entreprise (TechCorp)")}
                className={`ctrl-btn ${activeContact === "Entreprise (TechCorp)" ? 'active' : ''}`}
                style={{ background: activeContact === "Entreprise (TechCorp)" ? 'var(--accent-purple)' : '', color: activeContact === "Entreprise (TechCorp)" ? '#fff' : '' }}
              >
                Tuteur TechCorp
              </button>
            </div>
            <ChatSimulator 
              currentUserRole="supervisor"
              messages={messages}
              onSendMessage={onSendMessage}
              activeContact={activeContact}
            />
          </div>
        )}

      </div>
    </div>
  );
}
