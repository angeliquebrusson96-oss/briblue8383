// ============================================================================
// /api/send-email.js - Fonction serverless Vercel
// ============================================================================

const FROM_EMAIL = "Bri'Blue <contact@briblue83.com>";
const ADMIN_EMAIL = 'briblue83@hotmail.com';
const REPLY_TO = 'briblue83@hotmail.com';

function baseTemplate(content, preheader = '') {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bri'Blue</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f0f9ff">
<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f0f9ff;padding:40px 16px">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(10,79,140,.12)">
      <tr><td style="background:#ffffff;padding:32px 30px;text-align:center;border-bottom:3px solid #00b4d8">
        <div style="font-size:36px;font-weight:900;color:#0f172a;letter-spacing:-0.5px">Bri'Blue</div>
        <div style="font-size:14px;color:#64748b;margin-top:6px;font-weight:500;font-style:italic">Votre eau à l'état pur</div>
      </td></tr>
      <tr><td style="padding:40px 35px">${content}</td></tr>
      <tr><td style="background:#f8fafc;padding:24px 35px;text-align:center;border-top:1px solid #e2e8f0">
        <div style="font-size:15px;font-weight:700;color:#0a4f8c;margin-bottom:8px">Bri'Blue – Technicien de Piscine</div>
        <div style="font-size:13px;color:#64748b;line-height:1.6">📞 06 67 18 61 15<br>✉️ briblue83@hotmail.com<br><span style="font-size:12px;color:#94a3b8;margin-top:6px;display:inline-block">SIRET 84345436400053</span></div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

const TEMPLATES = {
  account_created: ({ prenom, nom }) => ({
    subject: "🎉 Bienvenue chez Bri'Blue !",
    html: baseTemplate(`<div style="text-align:center;margin-bottom:24px"><div style="display:inline-flex;align-items:center;justify-content:center;width:80px;height:80px;background:linear-gradient(135deg,#00b4d8,#1a8fd1);border-radius:50%;font-size:40px;box-shadow:0 8px 24px rgba(10,79,140,.2)">🌊</div></div><h1 style="margin:0 0 12px;color:#0f172a;font-size:26px;font-weight:800;text-align:center">Bienvenue ${esc(prenom || "chez Bri'Blue")} ! 🎉</h1><p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;text-align:center">Votre compte client a bien été créé. Vous faites maintenant partie de notre famille !</p><div style="background:#ecfeff;border-left:4px solid #06b6d4;border-radius:10px;padding:20px 22px;margin:20px 0"><div style="font-size:15px;color:#0a4f8c;font-weight:600;margin-bottom:12px">✨ Vous pouvez désormais :</div><ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#475569"><li>Réserver vos interventions en ligne</li><li>Commander nos produits d'entretien</li><li>Suivre l'historique de vos demandes</li><li>Accéder à votre espace client personnel</li></ul></div><p style="margin:28px 0 0;font-size:14px;color:#64748b;text-align:center;line-height:1.6">Une question ? Répondez simplement à cet email ou appelez-nous.<br>Nous sommes là pour vous accompagner ! 💙</p>`, `Bienvenue ${esc(prenom || '')} chez Bri'Blue`)
  }),
  
  order_confirmed: ({ prenom, nom, items, total, orderId }) => {
    const rows = (items || []).map(it => `<tr><td style="padding:12px 8px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a">${esc(it.name||'Produit')}</td><td style="padding:12px 8px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center">×${Number(it.qty||1)}</td><td style="padding:12px 8px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0a4f8c;text-align:right;font-weight:600">${Number(it.price||0).toFixed(2)} €</td></tr>`).join('');
    return {
      subject: `✅ Commande #${orderId} confirmée`,
      html: baseTemplate(`<div style="text-align:center;margin-bottom:24px"><div style="display:inline-flex;align-items:center;justify-content:center;width:80px;height:80px;background:linear-gradient(135deg,#10b981,#1a8fd1);border-radius:50%;font-size:40px;box-shadow:0 8px 24px rgba(10,79,140,.2)">📦</div></div><h1 style="margin:0 0 12px;color:#0f172a;font-size:26px;font-weight:800;text-align:center">Merci ${esc(prenom||'')} !</h1><p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;text-align:center">Votre commande <strong style="color:#0a4f8c">#${esc(orderId)}</strong> est bien enregistrée.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden"><tr style="background:#0a4f8c"><th style="padding:14px 8px;text-align:left;font-size:13px;font-weight:600;color:white;letter-spacing:0.5px">PRODUIT</th><th style="padding:14px 8px;text-align:center;font-size:13px;font-weight:600;color:white;letter-spacing:0.5px">QTÉ</th><th style="padding:14px 8px;text-align:right;font-size:13px;font-weight:600;color:white;letter-spacing:0.5px">PRIX</th></tr>${rows}<tr style="background:#0a4f8c"><td colspan="2" style="padding:16px 8px;font-weight:700;font-size:15px;color:white">TOTAL</td><td style="padding:16px 8px;text-align:right;font-weight:800;font-size:18px;color:white">${Number(total||0).toFixed(2)} €</td></tr></table><p style="margin:28px 0 0;font-size:14px;color:#64748b;text-align:center">Besoin d'aide ? Nous sommes joignables au 06 67 18 61 15</p>`, `Commande #${orderId} confirmée`)
    };
  },

  rdv_confirmed: ({ prenom, forfait, date, ville, totalPrice }) => ({
    subject: "✅ Votre rendez-vous Bri'Blue est confirmé",
    html: baseTemplate(`<div style="text-align:center;margin-bottom:24px"><div style="display:inline-flex;align-items:center;justify-content:center;width:80px;height:80px;background:linear-gradient(135deg,#0a4f8c,#1a8fd1);border-radius:50%;font-size:40px;box-shadow:0 8px 24px rgba(10,79,140,.2)">📅</div></div><h1 style="margin:0 0 12px;color:#0f172a;font-size:26px;font-weight:800;text-align:center">Rendez-vous confirmé !</h1><p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;text-align:center">Bonjour ${esc(prenom||'cher client')},<br>Nous avons bien reçu votre demande d'intervention.</p><div style="background:#f0f9ff;border:2px solid #0a4f8c;border-radius:12px;padding:24px;margin:24px 0"><div style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b;font-size:14px">🎯 Formule</span><strong style="color:#0a4f8c;font-size:14px">${esc(forfait||'—')}</strong></div><div style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b;font-size:14px">📅 Date souhaitée</span><strong style="color:#0a4f8c;font-size:14px">${esc(date||'À définir')}</strong></div><div style="display:flex;justify-content:space-between;padding:14px 0${totalPrice?';border-bottom:1px solid #e2e8f0':''}"><span style="color:#64748b;font-size:14px">📍 Lieu</span><strong style="color:#0a4f8c;font-size:14px">${esc(ville||'—')}</strong></div>${totalPrice?`<div style="display:flex;justify-content:space-between;padding:14px 0"><span style="color:#64748b;font-size:14px">💰 Tarif estimé</span><strong style="color:#0a4f8c;font-size:14px">${Number(totalPrice).toFixed(0)} €</strong></div>`:''}</div><div style="background:#ecfeff;border-left:4px solid #06b6d4;border-radius:10px;padding:20px 22px;margin:20px 0"><div style="font-size:15px;color:#0a4f8c;font-weight:700;margin-bottom:10px">⏰ Suite de votre demande</div><div style="font-size:14px;color:#475569;line-height:1.8">Je vous recontacte dans les <strong>24 heures</strong> pour planifier précisément l'intervention et répondre à toutes vos questions.</div></div><p style="margin:28px 0 0;font-size:14px;color:#64748b;text-align:center;line-height:1.7">Impatient de prendre soin de votre piscine ! 🌊<br>À très vite</p>`, `RDV confirmé — ${esc(forfait||"Bri'Blue")}`)
  }),

  rdv_reminder: ({ prenom, forfait, date, ville }) => ({
    subject: "🔔 Rappel : votre intervention Bri'Blue",
    html: baseTemplate(`<div style="text-align:center;margin-bottom:24px"><div style="display:inline-flex;align-items:center;justify-content:center;width:80px;height:80px;background:linear-gradient(135deg,#f59e0b,#1a8fd1);border-radius:50%;font-size:40px;box-shadow:0 8px 24px rgba(10,79,140,.2)">⏰</div></div><h1 style="margin:0 0 12px;color:#0f172a;font-size:26px;font-weight:800;text-align:center">Petit rappel !</h1><p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;text-align:center">Bonjour ${esc(prenom||'cher client')},<br>Notre rendez-vous approche à grands pas.</p><div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;padding:28px;text-align:center;margin:24px 0"><div style="font-size:18px;font-weight:800;color:#78350f;margin-bottom:12px">📅 ${esc(date||'Date à confirmer')}</div><div style="font-size:14px;color:#92400e;line-height:1.7"><strong>${esc(forfait||'Intervention')}</strong><br>📍 ${esc(ville||'—')}</div></div><div style="background:#f0f9ff;border-left:4px solid #0a4f8c;border-radius:10px;padding:20px 22px;margin:20px 0"><div style="font-size:14px;color:#0a4f8c;font-weight:600;margin-bottom:10px">✅ Pour préparer la visite :</div><ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#475569"><li>Dégagez l'accès au local technique</li><li>Vérifiez que la piscine est accessible</li><li>Préparez vos questions éventuelles</li></ul></div><p style="margin:28px 0 0;font-size:14px;color:#64748b;text-align:center;line-height:1.7">Un imprévu ? Contactez-moi au 06 67 18 61 15<br>À bientôt ! 💙</p>`, `Rappel intervention ${esc(date||'')}`)
  }),

  admin_new_order: ({ type, clientName, clientEmail, clientPhone, details }) => ({
    subject: `🔔 ${type==='rdv'?'Nouvelle demande de RDV':type==='devis'?'Nouveau devis':type==='order'?'Nouvelle commande':'Nouveau message'} — ${clientName}`,
    html: baseTemplate(`<div style="text-align:center;margin-bottom:24px"><div style="display:inline-flex;align-items:center;justify-content:center;width:80px;height:80px;background:linear-gradient(135deg,#0a4f8c,#1a8fd1);border-radius:50%;font-size:40px;box-shadow:0 8px 24px rgba(10,79,140,.2)">🔔</div></div><h1 style="margin:0 0 12px;color:#0f172a;font-size:26px;font-weight:800;text-align:center">Nouvelle activité sur le site</h1><p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;text-align:center">${type==='rdv'?'Demande de rendez-vous':type==='devis'?'Demande de devis':type==='order'?'Commande':'Message de contact'}</p><div style="background:#f8fafc;border-radius:12px;padding:24px;margin:24px 0"><div style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b;font-size:14px">👤 Client</span><strong style="color:#0a4f8c;font-size:14px">${esc(clientName||'—')}</strong></div><div style="display:flex;justify-content:space-between;padding:14px 0${clientPhone?';border-bottom:1px solid #e2e8f0':''}"><span style="color:#64748b;font-size:14px">✉️ Email</span><strong style="color:#0a4f8c;font-size:14px">${esc(clientEmail||'—')}</strong></div>${clientPhone?`<div style="display:flex;justify-content:space-between;padding:14px 0"><span style="color:#64748b;font-size:14px">📞 Téléphone</span><strong style="color:#0a4f8c;font-size:14px">${esc(clientPhone)}</strong></div>`:''}</div><div style="background:#f0f9ff;border-left:4px solid #0a4f8c;border-radius:10px;padding:20px 22px;margin:20px 0"><div style="font-size:14px;color:#0a4f8c;font-weight:600;margin-bottom:10px">📋 Détails</div><pre style="font-family:inherit;font-size:13px;margin:0;white-space:pre-wrap;color:#475569;line-height:1.7">${esc(details||'—')}</pre></div><p style="margin:28px 0 0;font-size:14px;color:#64748b;text-align:center">Connectez-vous à l'admin pour traiter cette demande</p>`, `Nouvelle ${type} de ${clientName}`)
  }),
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[send-email] RESEND_API_KEY manquante');
    return res.status(500).json({ error: 'Configuration serveur manquante' });
  }

  try {
    const { template, to, data } = req.body || {};
    if (!template || !TEMPLATES[template]) return res.status(400).json({ error: 'Template inconnu' });
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return res.status(400).json({ error: 'Email invalide' });

    const { subject, html } = TEMPLATES[template](data || {});
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], reply_to: REPLY_TO, subject, html })
    });

    const result = await resp.json();
    if (!resp.ok) {
      console.error('[send-email] Erreur Resend:', result);
      return res.status(resp.status).json({ error: result.message || 'Erreur Resend', details: result });
    }

    return res.status(200).json({ ok: true, id: result.id });
  } catch (e) {
    console.error('[send-email] Exception:', e);
    return res.status(500).json({ error: e.message || 'Erreur serveur' });
  }
}
