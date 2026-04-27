// ============================================================================
// /api/send-email.js
// Fonction serverless Vercel qui envoie des emails via Resend
// La clé API RESEND_API_KEY est stockée dans les variables d'environnement Vercel
// ============================================================================

const FROM_EMAIL = 'Bri\'Blue <contact@briblue83.com>';
const ADMIN_EMAIL = 'briblue83@hotmail.com';
const REPLY_TO = 'briblue83@hotmail.com';

// ----------------------------------------------------------------------------
// TEMPLATES HTML
// ----------------------------------------------------------------------------

function baseTemplate(content, preheader = '') {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bri'Blue</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f0f9ff;color:#0f172a">
<div style="display:none;max-height:0;overflow:hidden;color:#f0f9ff">${preheader}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f0f9ff;padding:24px 12px">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(10,79,140,.08)">
      <!-- HEADER -->
      <tr><td style="background:linear-gradient(135deg,#0a4f8c,#1a8fd1);padding:28px 30px;text-align:center">
        <div style="font-size:28px;font-weight:800;color:white;letter-spacing:0.5px">Bri'Blue</div>
        <div style="font-size:13px;color:#bae6fd;margin-top:4px;font-style:italic">Votre eau à l'état pur</div>
      </td></tr>

      <!-- CONTENT -->
      <tr><td style="padding:32px 30px">
        ${content}
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#f8fafc;padding:20px 30px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0">
        <strong style="color:#0a4f8c">Bri'Blue</strong> · Technicien de Piscine<br>
        📞 06 67 18 61 15 · ✉️ briblue83@hotmail.com<br>
        <span style="font-size:11px;color:#94a3b8">SIRET 84345436400053</span>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function btn(label, url) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0"><tr><td style="background:linear-gradient(135deg,#0a4f8c,#1a8fd1);border-radius:10px"><a href="${url}" style="display:inline-block;padding:13px 30px;color:white;text-decoration:none;font-weight:700;font-size:15px">${label}</a></td></tr></table>`;
}

const TEMPLATES = {

  // 1. Création de compte client
  account_created: ({ prenom, nom }) => ({
    subject: 'Bienvenue chez Bri\'Blue 💧',
    html: baseTemplate(`
      <h1 style="margin:0 0 16px;color:#0a4f8c;font-size:22px">Bienvenue ${prenom} ! 🎉</h1>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Votre compte client Bri'Blue a bien été créé.</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Vous pouvez désormais :</p>
      <ul style="font-size:15px;line-height:1.8;padding-left:20px;margin:0 0 14px">
        <li>Demander un rendez-vous d'intervention</li>
        <li>Commander nos produits d'entretien</li>
        <li>Suivre l'historique de vos commandes</li>
      </ul>
      ${btn('Accéder à mon compte', 'https://briblue8383.vercel.app')}
      <p style="margin:18px 0 0;font-size:13px;color:#64748b">Une question ? Répondez simplement à cet email.</p>
    `, `Bienvenue ${prenom}, votre compte Bri'Blue est créé.`)
  }),

  // 2. Confirmation de commande de produits
  order_confirmed: ({ prenom, nom, items, total, orderId }) => {
    const itemsHtml = (items || []).map(it => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:14px">${escapeHtml(it.name || 'Produit')}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;text-align:center">${Number(it.qty || 1)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;text-align:right">${Number(it.price || 0).toFixed(2)} €</td>
      </tr>`).join('');
    return {
      subject: `Confirmation de votre commande #${orderId} ✅`,
      html: baseTemplate(`
        <h1 style="margin:0 0 16px;color:#0a4f8c;font-size:22px">Merci pour votre commande, ${prenom} !</h1>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Votre commande <strong>#${orderId}</strong> est bien enregistrée. Nous la préparons et vous tiendrons informé(e) de l'expédition.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden">
          <tr style="background:#0a4f8c;color:white">
            <th style="padding:12px 8px;text-align:left;font-size:13px">Produit</th>
            <th style="padding:12px 8px;text-align:center;font-size:13px">Qté</th>
            <th style="padding:12px 8px;text-align:right;font-size:13px">Prix</th>
          </tr>
          ${itemsHtml}
          <tr style="background:#0a4f8c;color:white">
            <td colspan="2" style="padding:14px 8px;font-weight:700;font-size:14px">Total</td>
            <td style="padding:14px 8px;text-align:right;font-weight:700;font-size:15px">${Number(total || 0).toFixed(2)} €</td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:13px;color:#64748b">Pour toute question, répondez à cet email ou appelez le 06 67 18 61 15.</p>
      `, `Commande #${orderId} confirmée — ${Number(total || 0).toFixed(2)} €`)
    };
  },

  // 3. Confirmation de RDV/intervention
  rdv_confirmed: ({ prenom, nom, forfait, date, ville, totalPrice }) => ({
    subject: '✅ Votre rendez-vous Bri\'Blue est confirmé',
    html: baseTemplate(`
      <h1 style="margin:0 0 16px;color:#0a4f8c;font-size:22px">Rendez-vous confirmé ! 🌊</h1>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Bonjour ${prenom},</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Nous avons bien reçu votre demande et confirmons votre intervention.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;background:#f0f9ff;border-radius:10px;overflow:hidden">
        <tr><td style="padding:14px 18px;border-bottom:1px solid #bae6fd;font-size:14px">
          <span style="color:#64748b">Formule :</span> <strong style="color:#0a4f8c">${escapeHtml(forfait || '—')}</strong>
        </td></tr>
        <tr><td style="padding:14px 18px;border-bottom:1px solid #bae6fd;font-size:14px">
          <span style="color:#64748b">Date souhaitée :</span> <strong style="color:#0a4f8c">${escapeHtml(date || 'À définir')}</strong>
        </td></tr>
        <tr><td style="padding:14px 18px;border-bottom:1px solid #bae6fd;font-size:14px">
          <span style="color:#64748b">Ville :</span> <strong style="color:#0a4f8c">${escapeHtml(ville || '—')}</strong>
        </td></tr>
        ${totalPrice ? `<tr><td style="padding:14px 18px;font-size:14px">
          <span style="color:#64748b">Tarif estimé :</span> <strong style="color:#0a4f8c">${Number(totalPrice).toFixed(0)} €</strong>
        </td></tr>` : ''}
      </table>
      <p style="margin:18px 0 0;font-size:14px;line-height:1.6">Je vous recontacte dans les <strong>24 heures</strong> pour planifier précisément l'intervention. À très vite !</p>
    `, `RDV confirmé pour ${escapeHtml(forfait || '')}`)
  }),

  // 4. Rappel avant intervention
  rdv_reminder: ({ prenom, nom, forfait, date, ville }) => ({
    subject: '🔔 Rappel : votre intervention Bri\'Blue arrive',
    html: baseTemplate(`
      <h1 style="margin:0 0 16px;color:#0a4f8c;font-size:22px">Petit rappel ⏰</h1>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Bonjour ${prenom},</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Je viens vous rappeler notre rendez-vous d'entretien :</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;background:#fef3c7;border-radius:10px;overflow:hidden">
        <tr><td style="padding:18px;font-size:15px;color:#78350f">
          <strong>📅 ${escapeHtml(date || 'Date à confirmer')}</strong><br>
          <span style="font-size:14px">Formule : ${escapeHtml(forfait || '—')}</span><br>
          <span style="font-size:14px">Lieu : ${escapeHtml(ville || '—')}</span>
        </td></tr>
      </table>
      <p style="margin:18px 0 6px;font-size:14px;line-height:1.6">Pour préparer la visite, pensez à :</p>
      <ul style="font-size:14px;line-height:1.7;padding-left:20px;margin:0 0 14px">
        <li>Dégager l'accès au local technique</li>
        <li>Vérifier que la piscine est accessible</li>
      </ul>
      <p style="margin:18px 0 0;font-size:13px;color:#64748b">En cas d'imprévu, contactez-moi au 06 67 18 61 15.</p>
    `, `Rappel : intervention le ${escapeHtml(date || '')}`)
  }),

  // 5. Notification ADMIN (à vous)
  admin_new_order: ({ type, clientName, clientEmail, clientPhone, details }) => ({
    subject: `🔔 Nouvelle ${type === 'rdv' ? 'demande de RDV' : (type === 'devis' ? 'demande de devis' : 'commande')} — ${clientName}`,
    html: baseTemplate(`
      <h1 style="margin:0 0 16px;color:#0a4f8c;font-size:22px">Nouvelle activité sur le site 🔔</h1>
      <p style="margin:0 0 14px;font-size:15px">Vous avez reçu une nouvelle ${type === 'rdv' ? 'demande de rendez-vous' : (type === 'devis' ? 'demande de devis' : 'commande')} :</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;background:#f8fafc;border-radius:10px;overflow:hidden">
        <tr><td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px">
          <span style="color:#64748b">Client :</span> <strong>${escapeHtml(clientName || '—')}</strong>
        </td></tr>
        <tr><td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px">
          <span style="color:#64748b">Email :</span> <a href="mailto:${escapeHtml(clientEmail || '')}" style="color:#0a4f8c">${escapeHtml(clientEmail || '—')}</a>
        </td></tr>
        ${clientPhone ? `<tr><td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px">
          <span style="color:#64748b">Téléphone :</span> <a href="tel:${escapeHtml(clientPhone)}" style="color:#0a4f8c">${escapeHtml(clientPhone)}</a>
        </td></tr>` : ''}
        <tr><td style="padding:14px 18px;font-size:14px;background:#fff;border-top:2px solid #0a4f8c">
          <span style="color:#64748b">Détails :</span><br>
          <pre style="font-family:inherit;font-size:13px;margin:6px 0 0;white-space:pre-wrap">${escapeHtml(details || '—')}</pre>
        </td></tr>
      </table>
      ${btn('Voir dans l\'admin', 'https://briblue8383.vercel.app')}
    `, `Nouvelle ${type} de ${clientName}`)
  }),
};

// ----------------------------------------------------------------------------
// UTILITAIRES
// ----------------------------------------------------------------------------

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ----------------------------------------------------------------------------
// HANDLER PRINCIPAL
// ----------------------------------------------------------------------------

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY manquante dans les variables Vercel');
    return res.status(500).json({ error: 'Configuration serveur manquante' });
  }

  try {
    const { template, to, data } = req.body || {};

    if (!template || !TEMPLATES[template]) {
      return res.status(400).json({ error: 'Template inconnu : ' + template });
    }
    if (!to || typeof to !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({ error: 'Adresse email destinataire invalide' });
    }

    // Générer le contenu de l'email
    const { subject, html } = TEMPLATES[template](data || {});

    // Appel à l'API Resend
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        reply_to: REPLY_TO,
        subject,
        html,
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      console.error('Erreur Resend:', result);
      return res.status(resp.status).json({ error: result.message || 'Erreur Resend', details: result });
    }

    return res.status(200).json({ ok: true, id: result.id });
  } catch (e) {
    console.error('Erreur send-email:', e);
    return res.status(500).json({ error: e.message || 'Erreur serveur' });
  }
}
