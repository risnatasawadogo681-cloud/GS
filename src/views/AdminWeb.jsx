import React, { useState } from 'react';
import { 
  ShieldAlert, BarChart3, FileSignature, CheckCircle, 
  Users, QrCode, PenTool, Check, X, ShieldCheck 
} from 'lucide-react';
import SignaturePad from '../components/SignaturePad';
import QRCodeSimulator from '../components/QRCodeSimulator';

export default function AdminWeb({
  studentProfile,
  convention,
  onSignConvention,
  onFinalizeStageArchive
}) {
  const [activeSubView, setActiveSubView] = useState('analytics'); // analytics, approvals, verify, accounts
  const [showSignModal, setShowSignModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  // Mock database counts
  const stats = {
    totalStudents: 154,
    totalCompanies: 42,
    activeStages: convention ? 1 : 0,
    validationRate: 94, // %
    distribution: [
      { filiere: 'Génie Logiciel', value: 45 },
      { filiere: 'Réseaux & Télécoms', value: 28 },
      { filiere: 'Sécurité Informatique', value: 18 },
      { filiere: 'Data Science', value: 25 },
    ]
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    const code = verificationCode.toUpperCase().trim();
    if (code.includes('CONV-') || code === 'CONV-1') {
      if (convention) {
        setVerificationResult({
          valid: true,
          type: 'Convention de Stage',
          ref: `CONV-${convention.id}`,
          date: '19 Juin 2026',
          signatories: [
            { name: studentProfile.name, role: 'Étudiant', signed: !!convention.studentSignature },
            { name: 'TechCorp Recruteur', role: 'Entreprise', signed: !!convention.enterpriseSignature },
            { name: 'Administration Générale', role: 'Université', signed: !!convention.adminSignature }
          ],
          status: convention.adminSignature ? 'Authentique & Active' : 'En attente de signature finale'
        });
      } else {
        setVerificationResult({ valid: false, message: "Aucune convention enregistrée avec cette référence." });
      }
    } else if (code.includes('CERT-') || code === 'CERT-1') {
      if (convention && convention.stageFinished) {
        setVerificationResult({
          valid: true,
          type: 'Attestation de Fin de Stage',
          ref: `CERT-${convention.id}`,
          date: '19 Juin 2026',
          signatories: [
            { name: 'Dr. Martin', role: 'Encadreur Académique', signed: true },
            { name: 'Administration Générale', role: 'Université', signed: true }
          ],
          status: 'Authentique & Certifié'
        });
      } else {
        setVerificationResult({ valid: false, message: "Aucun certificat de fin de stage disponible pour cette référence." });
      }
    } else {
      setVerificationResult({ valid: false, message: "Référence QR Code invalide ou inconnue." });
    }
  };

  return (
    <div className="web-layout animate-fade">
      {/* Sidebar */}
      <div className="web-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingLeft: '16px' }}>
          <ShieldAlert color="var(--accent-purple)" size={24} />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Admin Portail</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supervision administrative</span>
          </div>
        </div>

        <button 
          className={`sidebar-link ${activeSubView === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveSubView('analytics')}
        >
          <BarChart3 size={18} /> Tableau analytique
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveSubView('approvals')}
        >
          <FileSignature size={18} /> Approbations conventions
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveSubView('verify')}
        >
          <QrCode size={18} /> Vérification QR Code
        </button>

        <button 
          className={`sidebar-link ${activeSubView === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveSubView('accounts')}
        >
          <Users size={18} /> Comptes utilisateurs
        </button>
      </div>

      {/* Main Body */}
      <div className="web-body">
        
        {/* VIEW: ANALYTICS & CHARTS */}
        {activeSubView === 'analytics' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Tableau de bord Analytique</h2>
            
            <div className="stats-row">
              <div className="stat-card">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Étudiants Inscrits</span>
                  <div className="stat-value">{stats.totalStudents}</div>
                </div>
                <div className="stat-icon"><Users /></div>
              </div>

              <div className="stat-card">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Entreprises Partenaires</span>
                  <div className="stat-value">{stats.totalCompanies}</div>
                </div>
                <div className="stat-icon"><Users style={{ color: 'var(--accent-blue)' }} /></div>
              </div>

              <div className="stat-card">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stages Actifs</span>
                  <div className="stat-value">{stats.activeStages}</div>
                </div>
                <div className="stat-icon"><CheckCircle style={{ color: 'var(--status-success)' }} /></div>
              </div>

              <div className="stat-card">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Taux de Validation</span>
                  <div className="stat-value">{stats.validationRate}%</div>
                </div>
                <div className="stat-icon"><ShieldCheck style={{ color: 'var(--status-warning)' }} /></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
              
              {/* Distribution Chart (Custom SVG implementation for safety & beauty) */}
              <div className="glass-panel">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Répartition des stagiaires par filière</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Nombre d'étudiants ayant décroché un stage cette année.</p>
                
                <div className="custom-chart-container">
                  {stats.distribution.map((d, index) => {
                    const maxHeight = 160;
                    // Find max value to scale chart proportionally
                    const maxVal = Math.max(...stats.distribution.map(item => item.value));
                    const barHeight = (d.value / maxVal) * maxHeight;
                    
                    return (
                      <div className="custom-chart-bar-wrapper" key={index}>
                        <div 
                          className="custom-chart-bar" 
                          style={{ height: `${barHeight}px` }}
                        >
                          <div className="custom-chart-tooltip">
                            {d.value} Étudiants
                          </div>
                        </div>
                        <div className="custom-chart-label" title={d.filiere}>
                          {d.filiere.length > 15 ? `${d.filiere.slice(0, 12)}...` : d.filiere}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* General Performance / Validation Rate */}
              <div className="glass-panel">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Indicateurs clés d'insertion</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span>Taux d'embauche post-stage</span>
                      <span style={{ fontWeight: 'bold' }}>82%</span>
                    </div>
                    <div className="match-bar-bg"><div className="match-bar-fill" style={{ width: '82%' }}></div></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span>Satisafaction des entreprises partenaires</span>
                      <span style={{ fontWeight: 'bold' }}>95%</span>
                    </div>
                    <div className="match-bar-bg"><div className="match-bar-fill" style={{ width: '95%', background: 'linear-gradient(to right, var(--status-success), var(--accent-blue))' }}></div></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span>Rapports validés dès la première soumission</span>
                      <span style={{ fontWeight: 'bold' }}>88%</span>
                    </div>
                    <div className="match-bar-bg"><div className="match-bar-fill" style={{ width: '88%', background: 'linear-gradient(to right, var(--accent-pink), var(--accent-purple))' }}></div></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: APPROVALS */}
        {activeSubView === 'approvals' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Approbations des Conventions</h2>

            {convention ? (
              <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>Convention N° CONV-{convention.id}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Stagiaire : {studentProfile.name} • Entreprise d'accueil : TechCorp
                    </p>
                  </div>
                  <div>
                    {!convention.adminSignature ? (
                      <button 
                        onClick={() => {
                          if (!convention.studentSignature || !convention.enterpriseSignature) {
                            alert("Attention : L'étudiant et l'entreprise doivent d'abord signer la convention !");
                            return;
                          }
                          setShowSignModal(true);
                        }}
                        className="btn-primary"
                        disabled={!convention.studentSignature || !convention.enterpriseSignature}
                      >
                        <PenTool size={16} /> Signer la convention
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="badge badge-success">Convention entièrement validée</span>
                        {convention.reportValidated && !convention.stageFinished && (
                          <button 
                            onClick={() => {
                              onFinalizeStageArchive();
                              alert("Stage terminé et archivé avec succès ! Attestation finale générée pour l'étudiant.");
                            }}
                            className="btn-primary"
                            style={{ background: 'linear-gradient(135deg, var(--status-success), var(--accent-purple))' }}
                          >
                            Générer l'Attestation Finale
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!convention.studentSignature || !convention.enterpriseSignature ? (
                  <div style={{ background: 'var(--status-warning-bg)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '6px', color: 'var(--status-warning)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    Signature en attente : Les deux signatures (Étudiant et Entreprise) sont obligatoires avant d'apposer la signature administrative finale de l'université.
                  </div>
                ) : null}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                  <div style={{ background: '#fff', color: '#111827', padding: '30px', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid #e5e7eb' }}>
                    <h4 style={{ textAlign: 'center', color: '#6d28d9', fontSize: '0.95rem', borderBottom: '2px solid #8b5cf6', paddingBottom: '10px', marginBottom: '16px' }}>Convention Officielle Académique</h4>
                    
                    <p style={{ marginBottom: '8px' }}>Il est convenu que l'étudiant <strong>{studentProfile.name}</strong> effectuera son stage au sein de <strong>TechCorp</strong> sur le poste : <em>{convention.offerTitle}</em>.</p>
                    <p style={{ marginBottom: '16px' }}>Durée contractuelle : {convention.duration}.</p>

                    <div className="pdf-signatures" style={{ marginTop: '30px' }}>
                      <div className="pdf-signature-box">
                        <span>Étudiant</span>
                        {convention.studentSignature ? (
                          <img src={convention.studentSignature} className="pdf-signature-img" alt="signature etu" />
                        ) : (
                          <div className="pdf-signature-missing">En attente</div>
                        )}
                      </div>
                      <div className="pdf-signature-box">
                        <span>Entreprise</span>
                        {convention.enterpriseSignature ? (
                          <img src={convention.enterpriseSignature} className="pdf-signature-img" alt="signature ent" />
                        ) : (
                          <div className="pdf-signature-missing">En attente</div>
                        )}
                      </div>
                      <div className="pdf-signature-box">
                        <span>Administration</span>
                        {convention.adminSignature ? (
                          <img src={convention.adminSignature} className="pdf-signature-img" alt="signature admin" />
                        ) : (
                          <div className="pdf-signature-missing">En attente</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>Vérification des signatures</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={16} color={convention.studentSignature ? "var(--status-success)" : "var(--text-muted)"} />
                        <span>Étudiant : {convention.studentSignature ? "Signé" : "En attente"}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={16} color={convention.enterpriseSignature ? "var(--status-success)" : "var(--text-muted)"} />
                        <span>Entreprise : {convention.enterpriseSignature ? "Signé" : "En attente"}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={16} color={convention.adminSignature ? "var(--status-success)" : "var(--text-muted)"} />
                        <span>Administration : {convention.adminSignature ? "Signé" : "En attente"}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <QRCodeSimulator value={`https://stagix.net/verify/conv-${convention.id}`} size={120} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>QR Code d'authenticité</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Aucune convention en attente de signature académique.
              </div>
            )}
          </div>
        )}

        {/* VIEW: QR CODE VERIFIER */}
        {activeSubView === 'verify' && (
          <div style={{ maxWidth: '750px' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Vérificateur d'Authenticité QR Code</h2>
            
            <div className="glass-panel" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Simuler un scan de document officiel</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Entrez la référence du QR code (situé sur le PDF de la convention ou de l'attestation) pour interroger le registre académique de la blockchain universitaire.
              </p>

              <form onSubmit={handleVerify} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: CONV-1 ou CERT-1" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>Vérifier</button>
              </form>

              {/* Demo shortcuts */}
              {convention && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button 
                    onClick={() => { setVerificationCode(`CONV-${convention.id}`); }}
                    className="ctrl-btn"
                  >
                    Simuler scan QR Convention (CONV-1)
                  </button>
                  {convention.stageFinished && (
                    <button 
                      onClick={() => { setVerificationCode(`CERT-${convention.id}`); }}
                      className="ctrl-btn"
                    >
                      Simuler scan QR Attestation (CERT-1)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Verification Result panel */}
            {verificationResult && (
              <div className="glass-panel animate-fade" style={{ borderLeft: `5px solid ${verificationResult.valid ? 'var(--status-success)' : 'var(--status-danger)'}` }}>
                {verificationResult.valid ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--status-success)', marginBottom: '16px' }}>
                      <ShieldCheck size={28} />
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>DOCUMENT AUTHENTIFIÉ ET CERTIFIÉ CONFORME</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vérifié sur Stagix Secure Network le {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
                      <div>
                        <p style={{ marginBottom: '6px' }}><strong>Type de document :</strong> {verificationResult.type}</p>
                        <p style={{ marginBottom: '6px' }}><strong>Référence unique :</strong> {verificationResult.ref}</p>
                        <p style={{ marginBottom: '6px' }}><strong>Date de dépôt :</strong> {verificationResult.date}</p>
                        <p><strong>Statut du contrat :</strong> {verificationResult.status}</p>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '8px' }}>Signataires certifiés :</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                          {verificationResult.signatories.map((sig, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{sig.name} ({sig.role})</span>
                              <span style={{ color: sig.signed ? 'var(--status-success)' : 'var(--status-warning)' }}>{sig.signed ? '✓ Signé' : 'En attente'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--status-danger)' }}>
                    <X size={28} style={{ border: '2px solid', borderRadius: '50%', padding: '2px' }} />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>ATTENTION : ÉCHEC D'AUTHENTIFICATION</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{verificationResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW: ACCOUNTS */}
        {activeSubView === 'accounts' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Gestion des Comptes Utilisateurs</h2>
            
            <div className="glass-panel">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Registre des utilisateurs Stagix</h3>
              
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Rôle</th>
                      <th>Identifiant / Email</th>
                      <th>Statut du compte</th>
                      <th>Activité</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Yanis Belkacem</strong></td>
                      <td><span className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' }}>Étudiant</span></td>
                      <td>yanis.belkacem@etu.univ.fr</td>
                      <td><span className="badge badge-success">Actif</span></td>
                      <td>En ligne (Mobile)</td>
                    </tr>
                    <tr>
                      <td><strong>TechCorp SAS</strong></td>
                      <td><span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd' }}>Entreprise</span></td>
                      <td>hr@techcorp.com</td>
                      <td><span className="badge badge-success">Partenaire</span></td>
                      <td>En ligne (Web)</td>
                    </tr>
                    <tr>
                      <td><strong>Dr. Martin</strong></td>
                      <td><span className="badge" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#67e8f9' }}>Encadreur</span></td>
                      <td>martin@univ.fr</td>
                      <td><span className="badge badge-success">Enseignant</span></td>
                      <td>Il y a 10 min</td>
                    </tr>
                    <tr>
                      <td><strong>Directrice des Études</strong></td>
                      <td><span className="badge" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#fbcfe8' }}>Administration</span></td>
                      <td>admin.stages@univ.fr</td>
                      <td><span className="badge badge-success">Admin</span></td>
                      <td>En ligne (Web)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ADMIN SIGNATURE MODAL */}
      {showSignModal && (
        <div className="modal-overlay" onClick={() => setShowSignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Signature de l'Administration</h4>
              <button onClick={() => setShowSignModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              En apposant la signature, vous validez juridiquement la convention de stage de M. <strong>{studentProfile.name}</strong> au nom de l'université.
            </p>
            <SignaturePad 
              onSave={(dataUrl) => {
                if (dataUrl) {
                  onSignConvention('admin', dataUrl);
                  setShowSignModal(false);
                  alert("Signature administrative apposée ! La convention est désormais juridiquement active.");
                }
              }}
              placeholder="Signature autorisée de l'administration"
            />
          </div>
        </div>
      )}

    </div>
  );
}
