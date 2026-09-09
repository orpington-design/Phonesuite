'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const DICTIONARY = {
  en: {
    langCode: 'en',
    flag: '🇬🇧',
    label: 'English',
    country: 'United Kingdom',
    // Bottom Nav
    nav: {
      home: 'Home',
      bills: 'Bills',
      shop: 'SHOP',
      score: 'Score',
      settings: 'Settings'
    },
    // Header
    header: {
      customerPortal: 'Customer Portal',
      viewBag: 'View Shopping Bag',
      loadingPortal: 'Loading PhoneSuite Customer Portal...',
      fullWidth: 'Switch to Full Width',
      phoneShell: 'Switch to Mobile Phone Shell',
      switchLang: 'Change Language (EN / PT)'
    },
    // Dashboard Tab
    dashboard: {
      welcome: 'Valued Customer',
      customer: 'Customer',
      totalDue: 'Total Due',
      pendingBills: 'pending bills',
      pendingBill: 'pending bill',
      creditScore: 'Credit Score',
      limit: 'limit',
      payDueNow: 'Pay Due Balance Now',
      nextBillNotice: 'Next bill due in',
      days: 'days',
      repairTracker: 'Live Device Repair Tracker',
      readyForPickup: 'Ready for Collection',
      estimatedReady: 'Estimated ready',
      stepReceived: 'Received',
      stepDiagnosing: 'Diagnosing',
      stepRepairing: 'Repairing',
      stepReady: 'Ready',
      stepPickedUp: 'Picked Up',
      techNotes: 'Technician Notes',
      imei: 'IMEI / Serial',
      depositPaid: 'Deposit Paid',
      balanceDue: 'Balance Due',
      rtoActive: 'Active Hardware Financing (RTO)',
      installmentsPaid: 'installments paid',
      remainingBalance: 'Remaining Balance',
      monthlyRepayment: 'Monthly Repayment',
      quickActions: 'Quick Actions',
      shopTech: 'Shop Tech',
      myBills: 'My Bills',
      creditPower: 'Credit Power',
      storeHelp: 'Store Help'
    },
    // Bills Tab
    bills: {
      billsTitle: 'Bills & Invoices',
      billsSubtitle: 'Manage your store accounts, repair charges, and hire-purchase installments',
      outstandingBalance: 'Outstanding Balance',
      payTotalDue: 'Pay Total Due',
      tabDue: 'Due & Unpaid',
      tabPaid: 'Paid Archive',
      tabRto: 'RTO Schedules',
      payCard: 'Pay with Card / Stripe',
      paidOn: 'Paid on',
      receipt: 'Receipt',
      noUnpaid: 'No Unpaid Bills',
      noUnpaidSub: 'You are completely up-to-date! Your credit score is positively impacted.',
      openShop: 'Explore Shop Products',
      installmentsCompleted: 'installments completed',
      perMonth: '/mo',
      viewReceipt: 'View Receipt',
      agreementDate: 'Agreement Date',
      frequency: 'Frequency',
      monthly: 'Monthly'
    },
    // Shop Tab
    shop: {
      catalogTitle: 'Tech Catalog',
      catalogSubtitle: 'Buy outright or finance with 0% Rent-to-Own',
      searchPlaceholder: 'Search phones, iPads, laptops, consoles...',
      all: 'All Products',
      phones: 'Phones',
      ipads: 'iPads & Tablets',
      watches: 'Watches',
      audio: 'Airphones & Audio',
      laptops: 'Laptops',
      games: 'Videogames',
      accessories: 'Accessories',
      preapprovedCredit: 'Pre-approved credit limit',
      sortFeatured: 'Featured',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      sortRtoAsc: 'Lowest Monthly RTO',
      inStock: 'In Stock',
      left: 'left',
      financeRto: 'Finance with 0% RTO',
      addToBag: 'Add to Bag',
      viewSpecs: 'View Specs & Options',
      noProducts: 'No products match your filter',
      clearFilter: 'Clear filters'
    },
    // Product Detail Modal
    productDetail: {
      storage: 'Storage Option:',
      color: 'Select Colorway:',
      warranty: 'Includes 12-Month PhoneSuite Store Guarantee',
      rtoTitle: 'Rent-to-Own Financing (0% Interest)',
      rtoSub: 'Choose repayment term. Instant approval with your customer credit score.',
      tenure: 'Repayment Term:',
      months: 'Months',
      estimatedMonthly: 'Monthly Installment:',
      instantFinance: 'Instant Finance (No Deposit)',
      buyDirect: 'Add to Bag (Buy Outright)'
    },
    // Score Tab
    score: {
      scoreTitle: 'Credit & Loyalty Score',
      scoreSubtitle: 'Live trust calculation based on store payment history and verified ID',
      tierExcellent: 'EXCELLENT TIER',
      tierGood: 'GOOD TIER',
      outOf: 'out of 1,000 points',
      preapprovedHardwareLimit: 'Pre-Approved Hardware Limit',
      instantFinanceAnyDevice: 'Available for instant 0% financing across phones, iPads, laptops & tech.',
      shopWithCredit: 'Shop with Credit',
      scoreFactors: 'Score Composition Factors',
      factorPayment: 'On-Time Payment History',
      factorPaymentDesc: 'Zero missed payments across all bills and installments',
      factorDob: 'Verified UK ID & Date of Birth',
      factorDobDesc: 'Full regulatory compliance check verified',
      factorRepairs: 'Store Repairs & Hardware History',
      factorRepairsDesc: 'Loyal customer with completed repair orders',
      factorLoyalty: 'Account Longevity & Repeat Business',
      factorLoyaltyDesc: 'Active customer profile for over 18 months',
      tierPerks: 'Your Platinum Tier Perks',
      perk1: '0% Interest on all Rent-to-Own hardware agreements',
      perk2: 'Free tempered glass protector on every phone repair',
      perk3: 'Priority express queue with senior technicians',
      perk4: '15% off all accessories and charging kits',
      scoreSimulator: 'Live Score Boost Simulator',
      simulatorPrompt: 'What happens if I settle all pending bills today?',
      projectedScore: 'Projected Score',
      boostMessage: 'Settling all outstanding invoices adds +20 points to your score!'
    },
    // Settings Tab
    settings: {
      settingsTitle: 'Customer Settings',
      settingsSubtitle: 'Account security, verification, preferences and store details',
      customerProfile: 'Customer Profile',
      email: 'Email:',
      phone: 'Phone:',
      address: 'Address:',
      verifiedDob: 'Verified Date of Birth (UK Regulatory Check)',
      dobPassed: 'Identity & age verified for Rent-to-Own hardware credit agreements.',
      languageSetting: 'Language / Idioma',
      languageDesc: 'Choose your preferred language for the customer portal',
      englishUK: 'English (UK / England)',
      portugueseBR: 'Português (Brasil)',
      securityTitle: 'Security & Notifications',
      biometrics: 'Biometric Sign-In (Face ID / Fingerprint)',
      enabled: 'Enabled',
      disabled: 'Disabled',
      smsAlerts: 'SMS Repair Updates',
      branchTitle: 'Your Local Branch',
      branchHours: 'Mon-Sat: 09:00 - 18:30 | Sun: 10:30 - 16:30',
      callBranch: 'Call Store',
      whatsappTechnician: 'WhatsApp Tech',
      displayMode: 'Display Mode',
      fullWidthMode: 'Full Width Desktop Mode',
      mobileShellMode: 'Mobile Phone Shell Mode',
      switchProfile: 'Switch Demo Customer Profile'
    },
    // Cart Drawer
    cart: {
      bagTitle: 'My Tech Bag',
      item: 'item',
      items: 'items',
      bagEmpty: 'Your bag is empty',
      bagEmptyDesc: 'Browse phones, iPads, laptops and tech from the Shop tab!',
      chooseFulfillment: 'Choose Fulfillment Method:',
      inStorePickup: 'In-Store Pickup',
      inStoreSub: 'Free • Ready in 1hr',
      expressCourier: 'Express Courier',
      courierSub: '+£4.99 • Next Day',
      subtotal: 'Subtotal:',
      fulfillment: 'Fulfillment:',
      freeCollection: 'FREE Collection',
      totalAmount: 'Total Amount:',
      financeRtoBtn: 'Finance for',
      financeRtoSuffix: '/mo (0% RTO)',
      buyOutrightBtn: 'Buy Outright',
      rtoSuccessTitle: 'Rent-to-Own Agreement Created!',
      orderSuccessTitle: 'Order Placed Successfully!',
      rtoSuccessDesc: 'Hardware agreement signed for',
      rtoSuccessDescEnd: 'Ready for pickup or delivery!',
      orderSuccessDesc: 'charged to payment card. Confirmation dispatched.'
    },
    // Payment Modal
    paymentModal: {
      payTitle: 'Pay Invoice',
      securePayment: 'Secure Payment',
      amountToPay: 'Amount to Pay:',
      cardDetails: 'Card Details',
      cardNumber: 'Card Number',
      expiry: 'Expiry',
      cvc: 'CVC',
      nameOnCard: 'Name on Card',
      payNow: 'Pay Now',
      orPayWith: 'or pay instantly with',
      paymentSuccessTitle: 'Payment Confirmed!',
      paymentSuccessDesc: 'Your payment was processed securely. Receipt dispatched to your email.'
    }
  },
  pt: {
    langCode: 'pt',
    flag: '🇧🇷',
    label: 'Português',
    country: 'Brasil',
    // Bottom Nav
    nav: {
      home: 'Início',
      bills: 'Faturas',
      shop: 'LOJA',
      score: 'Score',
      settings: 'Ajustes'
    },
    // Header
    header: {
      customerPortal: 'Portal do Cliente',
      viewBag: 'Ver Sacola de Compras',
      loadingPortal: 'Carregando Portal do Cliente PhoneSuite...',
      fullWidth: 'Mudar para Tela Cheia',
      phoneShell: 'Mudar para Modo Celular',
      switchLang: 'Mudar Idioma (EN / PT)'
    },
    // Dashboard Tab
    dashboard: {
      welcome: 'Cliente Especial',
      customer: 'Cliente',
      totalDue: 'Total a Pagar',
      pendingBills: 'faturas pendentes',
      pendingBill: 'fatura pendente',
      creditScore: 'Pontuação de Crédito',
      limit: 'limite',
      payDueNow: 'Pagar Saldo Devedor Agora',
      nextBillNotice: 'Próxima fatura vence em',
      days: 'dias',
      repairTracker: 'Rastreamento do Conserto em Tempo Real',
      readyForPickup: 'Pronto para Retirada',
      estimatedReady: 'Previsão de entrega',
      stepReceived: 'Recebido',
      stepDiagnosing: 'Diagnóstico',
      stepRepairing: 'Em Reparo',
      stepReady: 'Pronto',
      stepPickedUp: 'Retirado',
      techNotes: 'Notas do Técnico',
      imei: 'IMEI / Serial',
      depositPaid: 'Sinal Pago',
      balanceDue: 'Saldo Restante',
      rtoActive: 'Financiamento de Aparelho Ativo (RTO)',
      installmentsPaid: 'parcelas pagas',
      remainingBalance: 'Saldo Devedor',
      monthlyRepayment: 'Parcela Mensal',
      quickActions: 'Ações Rápidas',
      shopTech: 'Comprar Tech',
      myBills: 'Minhas Faturas',
      creditPower: 'Meu Crédito',
      storeHelp: 'Ajuda da Loja'
    },
    // Bills Tab
    bills: {
      billsTitle: 'Faturas e Pagamentos',
      billsSubtitle: 'Gerencie suas contas da loja, taxas de reparo e parcelas de financiamento',
      outstandingBalance: 'Saldo Devedor',
      payTotalDue: 'Pagar Total Devedor',
      tabDue: 'Pendentes',
      tabPaid: 'Histórico Pago',
      tabRto: 'Parcelamentos RTO',
      payCard: 'Pagar com Cartão / Stripe',
      paidOn: 'Pago em',
      receipt: 'Recibo',
      noUnpaid: 'Nenhuma Fatura Pendente',
      noUnpaidSub: 'Você está 100% em dia! Seu score de crédito agradece.',
      openShop: 'Explorar Produtos da Loja',
      installmentsCompleted: 'parcelas concluídas',
      perMonth: '/mês',
      viewReceipt: 'Ver Recibo',
      agreementDate: 'Data do Contrato',
      frequency: 'Frequência',
      monthly: 'Mensal'
    },
    // Shop Tab
    shop: {
      catalogTitle: 'Catálogo de Tecnologia',
      catalogSubtitle: 'Compre à vista ou parcele com 0% no carnê RTO',
      searchPlaceholder: 'Buscar celulares, iPads, notebooks, videogames...',
      all: 'Todos os Produtos',
      phones: 'Celulares',
      ipads: 'iPads e Tablets',
      watches: 'Relógios / Smartwatches',
      audio: 'Fones e Áudio',
      laptops: 'Notebooks',
      games: 'Videogames',
      accessories: 'Acessórios',
      preapprovedCredit: 'Limite de crédito pré-aprovado',
      sortFeatured: 'Destaques',
      sortPriceAsc: 'Preço: Menor para Maior',
      sortPriceDesc: 'Preço: Maior para Menor',
      sortRtoAsc: 'Menor Parcela RTO',
      inStock: 'Em Estoque',
      left: 'restantes',
      financeRto: 'Financiar no RTO (0% Juros)',
      addToBag: 'Adicionar à Sacola',
      viewSpecs: 'Ver Detalhes e Opções',
      noProducts: 'Nenhum produto encontrado com este filtro',
      clearFilter: 'Limpar filtros'
    },
    // Product Detail Modal
    productDetail: {
      storage: 'Opção de Memória:',
      color: 'Escolha a Cor:',
      warranty: 'Inclui Garantia de 12 Meses PhoneSuite Store',
      rtoTitle: 'Financiamento RTO (0% de Juros)',
      rtoSub: 'Escolha o prazo de parcelamento. Aprovação instantânea com seu Score.',
      tenure: 'Prazo de Parcelamento:',
      months: 'Meses',
      estimatedMonthly: 'Parcela Mensal Estimada:',
      instantFinance: 'Financiar Agora (Sem Entrada)',
      buyDirect: 'Adicionar à Sacola (À Vista)'
    },
    // Score Tab
    score: {
      scoreTitle: 'Score de Crédito e Fidelidade',
      scoreSubtitle: 'Cálculo de confiança em tempo real baseado no histórico e documentos',
      tierExcellent: 'NÍVEL EXCELENTE',
      tierGood: 'NÍVEL BOM',
      outOf: 'de 1.000 pontos',
      preapprovedHardwareLimit: 'Limite de Aparelho Pré-Aprovado',
      instantFinanceAnyDevice: 'Disponível para financiamento imediato em celulares, iPads, notebooks e tecnologia.',
      shopWithCredit: 'Comprar com Crédito',
      scoreFactors: 'Fatores de Composição do Score',
      factorPayment: 'Histórico de Pagamentos em Dia',
      factorPaymentDesc: 'Nenhum atraso em faturas ou parcelamentos de aparelhos',
      factorDob: 'Documento e Data de Nasc. Verificados',
      factorDobDesc: 'Verificação regulatória de identidade concluída',
      factorRepairs: 'Histórico de Consertos e Aparelhos',
      factorRepairsDesc: 'Cliente fiel com histórico positivo de ordens de serviço',
      factorLoyalty: 'Tempo de Conta e Fidelidade',
      factorLoyaltyDesc: 'Perfil ativo há mais de 18 meses com compras recorrentes',
      tierPerks: 'Benefícios do Seu Nível Platinum',
      perk1: '0% de juros em todos os contratos de financiamento RTO',
      perk2: 'Película de vidro grátis em todo reparo de celular',
      perk3: 'Fila prioritária expressa com técnicos seniores',
      perk4: '15% de desconto em capas, cabos e carregadores',
      scoreSimulator: 'Simulador de Aumento de Score',
      simulatorPrompt: 'O que acontece se eu quitar todas as faturas hoje?',
      projectedScore: 'Score Projetado',
      boostMessage: 'Quitar todas as faturas pendentes adiciona +20 pontos ao seu Score!'
    },
    // Settings Tab
    settings: {
      settingsTitle: 'Configurações do Cliente',
      settingsSubtitle: 'Segurança da conta, verificações, preferências e dados da loja',
      customerProfile: 'Perfil do Cliente',
      email: 'E-mail:',
      phone: 'Telefone:',
      address: 'Endereço:',
      verifiedDob: 'Data de Nasc. Verificada (Conformidade Legal)',
      dobPassed: 'Identidade e idade verificadas para contratos de crédito RTO.',
      languageSetting: 'Idioma / Language',
      languageDesc: 'Escolha seu idioma de preferência para o portal',
      englishUK: 'English (UK / Inglaterra)',
      portugueseBR: 'Português (Brasil)',
      securityTitle: 'Segurança e Notificações',
      biometrics: 'Acesso Biométrico (Face ID / Digital)',
      enabled: 'Ativado',
      disabled: 'Desativado',
      smsAlerts: 'Atualizações de Reparo via SMS',
      branchTitle: 'Sua Loja de Atendimento',
      branchHours: 'Seg-Sáb: 09:00 - 18:30 | Dom: 10:30 - 16:30',
      callBranch: 'Ligar para Loja',
      whatsappTechnician: 'WhatsApp Técnico',
      displayMode: 'Modo de Exibição',
      fullWidthMode: 'Modo Tela Cheia',
      mobileShellMode: 'Modo Celular Mobile',
      switchProfile: 'Trocar Perfil de Demonstração'
    },
    // Cart Drawer
    cart: {
      bagTitle: 'Minha Sacola Tech',
      item: 'item',
      items: 'itens',
      bagEmpty: 'Sua sacola está vazia',
      bagEmptyDesc: 'Veja celulares, iPads, notebooks e eletrônicos na aba Loja!',
      chooseFulfillment: 'Escolha a Forma de Entrega / Retirada:',
      inStorePickup: 'Retirada na Loja',
      inStoreSub: 'Grátis • Pronto em 1h',
      expressCourier: 'Entrega Expressa',
      courierSub: '+£4.99 • Dia Seguinte',
      subtotal: 'Subtotal:',
      fulfillment: 'Entrega:',
      freeCollection: 'Retirada GRÁTIS',
      totalAmount: 'Valor Total:',
      financeRtoBtn: 'Financiar por',
      financeRtoSuffix: '/mês (0% RTO)',
      buyOutrightBtn: 'Comprar à Vista',
      rtoSuccessTitle: 'Contrato de Financiamento Criado!',
      orderSuccessTitle: 'Pedido Realizado com Sucesso!',
      rtoSuccessDesc: 'Contrato de aparelho assinado por',
      rtoSuccessDescEnd: 'Pronto para retirada ou envio!',
      orderSuccessDesc: 'cobrado no seu cartão. Confirmação enviada.'
    },
    // Payment Modal
    paymentModal: {
      payTitle: 'Pagar Fatura',
      securePayment: 'Pagamento Seguro',
      amountToPay: 'Valor a Pagar:',
      cardDetails: 'Dados do Cartão',
      cardNumber: 'Número do Cartão',
      expiry: 'Validade',
      cvc: 'CVC',
      nameOnCard: 'Nome Impresso no Cartão',
      payNow: 'Pagar Agora',
      orPayWith: 'ou pague instantaneamente com',
      paymentSuccessTitle: 'Pagamento Confirmado!',
      paymentSuccessDesc: 'Seu pagamento foi processado com sucesso. O recibo foi enviado por e-mail.'
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('phonesuite_customer_portal_lang');
      if (savedLang === 'pt' || savedLang === 'en') {
        setLanguageState(savedLang);
      } else {
        const browserLang = navigator.language || '';
        if (browserLang.toLowerCase().startsWith('pt')) {
          setLanguageState('pt');
        }
      }
    } catch (e) {
      // ignore SSR or storage restrictions
    }
  }, []);

  const setLanguage = (lang) => {
    if (lang === 'pt' || lang === 'en') {
      setLanguageState(lang);
      try {
        localStorage.setItem('phonesuite_customer_portal_lang', lang);
      } catch (e) {}
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'pt' : 'en';
    setLanguage(nextLang);
  };

  const t = DICTIONARY[language] || DICTIONARY.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: DICTIONARY.en
    };
  }
  return context;
}
