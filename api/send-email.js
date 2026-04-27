// Test 1 : Bienvenue client
briblueSendMail('account_created', 'briblue83@hotmail.com', { prenom: 'Sophie', nom: 'Martin' })

// Test 2 : Confirmation RDV
briblueSendMail('rdv_confirmed', 'briblue83@hotmail.com', { 
  prenom: 'Sophie', 
  forfait: 'Forfait Confort', 
  date: '15 mai 2026 à 14h',
  ville: 'Hyères',
  totalPrice: 1365
})

// Test 3 : Confirmation commande
briblueSendMail('order_confirmed', 'briblue83@hotmail.com', {
  prenom: 'Sophie',
  orderId: '12345',
  items: [
    { name: 'Chlore choc 5kg', qty: 2, price: 24.90 },
    { name: 'pH+ 1kg', qty: 1, price: 9.50 }
  ],
  total: 59.30
})
