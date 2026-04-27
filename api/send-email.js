fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template: 'account_created',
    to: 'briblue83@hotmail.com',
    data: { prenom: 'Test', nom: 'Final' }
  })
}).then(r => r.json()).then(console.log).catch(console.error)
