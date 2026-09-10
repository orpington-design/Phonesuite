'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const StaffLanguageContext = createContext();

export const STAFF_DICTIONARY = {
  en: {
    langCode: 'en',
    flag: '🇬🇧',
    label: 'English',
    country: 'United Kingdom',
    // Bottom Navigation
    nav: {
      dashboard: 'Dashboard',
      finance: 'Finance',
      invoices: 'Invoices',
      sale: 'SALE',
      orders: 'Orders',
      shop: 'Shop',
      settings: 'Settings'
    },
    // Header
    header: {
      staffPortal: 'Staff Operations',
      activeBranch: 'Active Branch',
      switchBranch: 'Switch Store',
      fullWidth: 'Switch to Full Width',
      phoneShell: 'Switch to Mobile Phone Shell',
      switchLang: 'Change Language (EN / PT)',
      quickNotification: 'Notifications'
    },
    // Dashboard Tab
    dashboard: {
      welcomeStaff: 'Store Operations',
      staffRole: 'Senior Technician & Sales',
      branchTag: 'Branch',
      kpiTodaySales: "Today's Sales",
      kpiActiveRepairs: 'Active Repairs',
      kpiOverdueInvoices: 'Overdue Invoices',
      kpiRtoFinancing: 'Active RTO Contracts',
      quickActions: 'Quick Operational Actions',
      actNewSale: 'New Sale / POS',
      actNewRepair: 'New Repair Job',
      actNewInvoice: 'Create Invoice',
      actAddCustomer: 'Add Customer',
      actAddProduct: 'Add Product to Shop',
      overdueAlertTitle: 'Attention: Overdue Bills Requiring Collection',
      overdueAlertDesc: 'total outstanding across',
      accounts: 'accounts',
      remindAll: 'Send WhatsApp Reminders',
      viewAllOverdue: 'View Overdue Invoices',
      liveRepairJobs: 'Live Electronics Repair Jobs',
      allRepairs: 'All Repairs',
      repairReadyNotice: 'Ready for customer pickup',
      stepReceived: 'Received',
      stepDiagnosing: 'Diagnosing',
      stepRepairing: 'Repairing',
      stepReady: 'Ready for Pickup',
      stepPickedUp: 'Completed & Picked Up',
      assignedTo: 'Assigned to',
      estCost: 'Est. Cost',
      updateStatus: 'Advance Status',
      recentTransactions: 'Recent Sales & Invoices',
      viewAllSales: 'View All Sales',
      noActiveRepairs: 'No active repair jobs in queue',
      noOverdue: 'All store accounts are currently up to date!'
    },
    // Invoices Tab
    invoices: {
      title: 'Invoices & Billing',
      subtitle: 'Manage client accounts, repair charges, and installment receivables',
      searchPlaceholder: 'Search invoice #, customer name, device...',
      tabAll: 'All Invoices',
      tabOverdue: 'Overdue',
      tabPending: 'Pending',
      tabPaid: 'Paid',
      tabRto: 'RTO Installments',
      btnNewInvoice: 'Create Invoice',
      overdueBadge: 'OVERDUE',
      pendingBadge: 'PENDING',
      paidBadge: 'PAID',
      dueDate: 'Due Date',
      markAsPaid: 'Mark Paid',
      remindWhatsApp: 'Remind',
      printReceipt: 'Receipt',
      totalCollected: 'Total Collected',
      totalPending: 'Pending Balance',
      totalOverdue: 'Overdue Debt',
      noInvoicesFound: 'No invoices found matching criteria'
    },
    // Sale Tab (POS & Financing)
    sale: {
      title: 'Point of Sale & Financing',
      subtitle: 'Process outright purchases or execute 0% Rent-to-Own agreements',
      stepCustomer: '1. Select Customer',
      searchCustomer: 'Search customer name, phone or email...',
      orQuickAddCustomer: '+ Add New Customer',
      selectedCustomer: 'Active Customer',
      creditScore: 'Credit Score',
      creditLimit: 'Credit Limit',
      stepItems: '2. Select Products or Services',
      tabCatalog: 'Shop Inventory',
      tabCustomService: 'Custom Repair / Labor Charge',
      addToSale: 'Add to Sale',
      serviceDesc: 'Service / Repair Description',
      serviceCost: 'Charge Amount (£)',
      addCustomCharge: 'Add Service Fee',
      saleSummary: 'Order Summary',
      itemsCount: 'items',
      subtotal: 'Subtotal',
      vatTax: 'VAT / Tax (20%)',
      totalPayable: 'Total Payable',
      stepPayment: '3. Payment & Financing Structure',
      methodOutright: 'Outright Payment',
      methodRto: 'Rent-to-Own (RTO) Agreement',
      outrightCash: 'Cash at Counter',
      outrightCard: 'Card / Stripe Terminal',
      rtoTenure: 'Repayment Term',
      months: 'months',
      rtoDeposit: 'Initial Deposit (£)',
      rtoMonthlyEst: 'Monthly Repayment:',
      rtoWeeklyEst: 'Weekly Repayment:',
      creditCheckApproved: 'Approved for RTO financing with instant customer score check',
      creditCheckWarning: 'Warning: Order total exceeds customer approved credit limit',
      btnCompleteSale: 'Complete Sale & Print Receipt',
      btnGenerateAgreement: 'Generate & Sign RTO Agreement',
      cartEmpty: 'No items in sale basket. Choose products from the catalog above.'
    },
    // Shop Tab (Manage Customer Portal Catalog)
    shop: {
      title: 'Customer Shop Manager',
      subtitle: 'Create and edit products visible to customers on the online portal',
      btnAddProduct: 'Add New Product',
      searchProducts: 'Search products in store...',
      allCategories: 'All Categories',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      editProduct: 'Edit Product',
      deleteProduct: 'Hide / Delete',
      price: 'Price',
      rtoMonthly: 'RTO / Month',
      unitsAvailable: 'units in stock',
      visibleOnPortal: 'Live on Customer Shop',
      confirmDelete: 'Are you sure you want to remove this product from the customer portal?'
    },
    // Settings Tab
    settings: {
      title: 'Staff & Branch Operations',
      subtitle: 'Hardware store preferences, staff profile, and portal switching',
      staffProfile: 'Staff Member Profile',
      currentBranch: 'Current Store Branch',
      switchBranchNotice: 'Branch controls inventory availability and financial reporting.',
      quickSwitchers: 'Quick Portal Switchers',
      openCustomerPortal: 'Open Customer Portal View',
      customerPortalDesc: 'View the app exactly as your customers experience it',
      openDesktopAdmin: 'Open Desktop Admin Dashboard',
      desktopAdminDesc: 'Access full-screen multi-branch analytics, RLS policies, and platform settings',
      storeSettings: 'Hardware Store Parameters',
      currency: 'Default Currency',
      vatRate: 'Store VAT Rate (%)',
      businessPhone: 'Business WhatsApp Hotline',
      languagePreferences: 'Language Preferences',
      systemVersion: 'PhoneSuite Operations v2.4 (Staff Mobile Edition)'
    },
    // Modals
    modals: {
      createRepairTitle: 'Create New Repair Job Ticket',
      customer: 'Customer',
      deviceType: 'Device Type',
      deviceModel: 'Device Model (e.g. iPhone 15 Pro, iPad Air)',
      deviceSerial: 'Serial Number / IMEI',
      faultDesc: 'Reported Issue / Fault Description',
      diagnosticNotes: 'Technician Initial Diagnostic Notes',
      assignedTech: 'Assign Technician',
      estFee: 'Estimated Repair Cost (£)',
      depositAmount: 'Initial Deposit Received (£)',
      btnSubmitRepair: 'Create Repair Job Ticket',

      createInvoiceTitle: 'Create Customer Invoice',
      invoiceDesc: 'Description of charges or items',
      invoiceAmount: 'Amount (£)',
      dueDate: 'Payment Due Date',
      paymentMethod: 'Payment Terms',
      btnSubmitInvoice: 'Generate & Issue Invoice',

      addCustomerTitle: 'Register New Customer Profile',
      fullName: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      address: 'Postal Address',
      initialCreditLimit: 'Initial Credit Limit (£)',
      btnSubmitCustomer: 'Save Customer Profile',

      productEditorTitleNew: 'Add New Product to Customer Shop',
      productEditorTitleEdit: 'Edit Customer Shop Product',
      productName: 'Product Name',
      category: 'Product Category',
      brand: 'Brand',
      sellPrice: 'Outright Retail Price (£)',
      rtoMonthlyPrice: 'Monthly RTO Price (£/mo)',
      stockQuantity: 'Stock Quantity',
      condition: 'Item Condition',
      specs: 'Key Specifications',
      description: 'Product Description',
      imageUrl: 'Image URL',
      usePresetImage: 'Or select a high-res tech preset image:',
      colors: 'Available Colors (comma separated)',
      storage: 'Storage Options (comma separated)',
      btnSaveProduct: 'Save Product to Shop',

      receiptTitle: 'Official Store Receipt',
      storeName: 'PhoneSuite UK & Operations',
      transactionDate: 'Transaction Date',
      totalCharged: 'Total Charged',
      paidVia: 'Paid via',
      statusPaid: 'PAID IN FULL',
      btnPrint: 'Print / Save Receipt',
      btnClose: 'Close'
    },
    common: {
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      filter: 'Filter',
      search: 'Search',
      loading: 'Loading...'
    }
  },
  pt: {
    langCode: 'pt',
    flag: '🇧🇷',
    label: 'Português',
    country: 'Brasil',
    // Bottom Navigation
    nav: {
      dashboard: 'Painel',
      finance: 'Financiamento',
      invoices: 'Faturas',
      sale: 'VENDA',
      orders: 'Pedidos',
      shop: 'Loja',
      settings: 'Ajustes'
    },
    // Header
    header: {
      staffPortal: 'Operações da Equipe',
      activeBranch: 'Unidade Ativa',
      switchBranch: 'Mudar Loja',
      fullWidth: 'Modo Tela Cheia',
      phoneShell: 'Modo Celular Mobile',
      switchLang: 'Mudar Idioma (EN / PT)',
      quickNotification: 'Notificações'
    },
    // Dashboard Tab
    dashboard: {
      welcomeStaff: 'Operações da Loja',
      staffRole: 'Técnico Sênior & Vendas',
      branchTag: 'Filial',
      kpiTodaySales: 'Vendas de Hoje',
      kpiActiveRepairs: 'Reparos em Andamento',
      kpiOverdueInvoices: 'Faturas Vencidas',
      kpiRtoFinancing: 'Contratos RTO Ativos',
      quickActions: 'Ações Operacionais Rápidas',
      actNewSale: 'Nova Venda / PDV',
      actNewRepair: 'Novo Reparo / Ordem',
      actNewInvoice: 'Gerar Fatura',
      actAddCustomer: 'Novo Cliente',
      actAddProduct: 'Adicionar à Loja',
      overdueAlertTitle: 'Atenção: Contas Vencidas para Cobrança',
      overdueAlertDesc: 'total pendente em',
      accounts: 'clientes',
      remindAll: 'Enviar Cobrança WhatsApp',
      viewAllOverdue: 'Ver Faturas Vencidas',
      liveRepairJobs: 'Reparos de Eletrônicos em Tempo Real',
      allRepairs: 'Todos os Reparos',
      repairReadyNotice: 'Pronto para retirada pelo cliente',
      stepReceived: 'Recebido',
      stepDiagnosing: 'Em Diagnóstico',
      stepRepairing: 'Em Reparo',
      stepReady: 'Pronto para Entrega',
      stepPickedUp: 'Entregue / Concluído',
      assignedTo: 'Responsável',
      estCost: 'Valor Estimado',
      updateStatus: 'Avançar Etapa',
      recentTransactions: 'Últimas Vendas & Faturas',
      viewAllSales: 'Ver Todas as Vendas',
      noActiveRepairs: 'Nenhum reparo ativo na fila',
      noOverdue: 'Todas as contas de clientes estão em dia!'
    },
    // Invoices Tab
    invoices: {
      title: 'Faturas & Cobranças',
      subtitle: 'Gerencie contas de clientes, serviços de reparo e parcelas a receber',
      searchPlaceholder: 'Buscar por fatura, cliente ou aparelho...',
      tabAll: 'Todas as Faturas',
      tabOverdue: 'Vencidas',
      tabPending: 'Pendentes',
      tabPaid: 'Pagas',
      tabRto: 'Parcelas RTO',
      btnNewInvoice: 'Criar Fatura',
      overdueBadge: 'VENCIDA',
      pendingBadge: 'PENDENTE',
      paidBadge: 'PAGO',
      dueDate: 'Vencimento',
      markAsPaid: 'Dar Baixa',
      remindWhatsApp: 'Cobrar',
      printReceipt: 'Recibo',
      totalCollected: 'Total Recebido',
      totalPending: 'Saldo a Vencer',
      totalOverdue: 'Dívida Vencida',
      noInvoicesFound: 'Nenhuma fatura encontrada com esses filtros'
    },
    // Sale Tab (POS & Financing)
    sale: {
      title: 'Ponto de Venda & Financiamento',
      subtitle: 'Realize vendas à vista ou crie contratos de Rent-to-Own (0% juros)',
      stepCustomer: '1. Selecionar Cliente',
      searchCustomer: 'Buscar por nome, telefone ou e-mail...',
      orQuickAddCustomer: '+ Cadastrar Novo Cliente',
      selectedCustomer: 'Cliente Ativo',
      creditScore: 'Pontuação de Crédito',
      creditLimit: 'Limite Aprovado',
      stepItems: '2. Selecionar Produtos ou Serviços',
      tabCatalog: 'Estoque da Loja',
      tabCustomService: 'Mão de Obra / Reparo Avulso',
      addToSale: 'Adicionar à Venda',
      serviceDesc: 'Descrição do Serviço ou Peça',
      serviceCost: 'Valor Cobrado (£)',
      addCustomCharge: 'Inserir Serviço',
      saleSummary: 'Resumo do Pedido',
      itemsCount: 'itens',
      subtotal: 'Subtotal',
      vatTax: 'Imposto / IVA (20%)',
      totalPayable: 'Total a Cobrar',
      stepPayment: '3. Forma de Pagamento & Financiamento',
      methodOutright: 'Pagamento à Vista',
      methodRto: 'Contrato Rent-to-Own (RTO)',
      outrightCash: 'Dinheiro no Balcão',
      outrightCard: 'Cartão / Maquininha Stripe',
      rtoTenure: 'Prazo de Parcelamento',
      months: 'meses',
      rtoDeposit: 'Entrada Inicial (£)',
      rtoMonthlyEst: 'Parcela Mensal Estimada:',
      rtoWeeklyEst: 'Parcela Semanal Estimada:',
      creditCheckApproved: 'Aprovado para financiamento RTO com base no score do cliente',
      creditCheckWarning: 'Atenção: O total do pedido ultrapassa o limite aprovado do cliente',
      btnCompleteSale: 'Finalizar Venda & Emitir Recibo',
      btnGenerateAgreement: 'Gerar & Assinar Contrato RTO',
      cartEmpty: 'Nenhum item na venda. Selecione produtos no catálogo acima.'
    },
    // Shop Tab (Manage Customer Portal Catalog)
    shop: {
      title: 'Gestor da Loja do Cliente',
      subtitle: 'Crie e edite os produtos visíveis no catálogo online dos clientes',
      btnAddProduct: 'Adicionar Novo Produto',
      searchProducts: 'Buscar no catálogo da loja...',
      allCategories: 'Todas as Categorias',
      inStock: 'Em Estoque',
      lowStock: 'Estoque Baixo',
      outOfStock: 'Esgotado',
      editProduct: 'Editar Produto',
      deleteProduct: 'Ocultar / Excluir',
      price: 'Preço',
      rtoMonthly: 'RTO / Mês',
      unitsAvailable: 'unidades em estoque',
      visibleOnPortal: 'Ativo na Loja do Cliente',
      confirmDelete: 'Tem certeza de que deseja remover este produto da loja do cliente?'
    },
    // Settings Tab
    settings: {
      title: 'Operações & Configurações da Filial',
      subtitle: 'Preferências da loja física, perfil da equipe e atalhos do sistema',
      staffProfile: 'Perfil do Funcionário',
      currentBranch: 'Filial Atual',
      switchBranchNotice: 'A filial define a disponibilidade de estoque e os relatórios financeiros.',
      quickSwitchers: 'Atalhos Rápidos de Acesso',
      openCustomerPortal: 'Abrir Portal do Cliente',
      customerPortalDesc: 'Veja o aplicativo exatamente como os seus clientes enxergam',
      openDesktopAdmin: 'Abrir Painel Admin Desktop',
      desktopAdminDesc: 'Acesse análises em tela cheia, multi-filiais, políticas RLS e regras da plataforma',
      storeSettings: 'Parâmetros da Loja',
      currency: 'Moeda Padrão',
      vatRate: 'Taxa de Imposto / IVA (%)',
      businessPhone: 'WhatsApp Comercial da Loja',
      languagePreferences: 'Preferências de Idioma',
      systemVersion: 'PhoneSuite Operations v2.4 (Edição Mobile Staff)'
    },
    // Modals
    modals: {
      createRepairTitle: 'Abrir Nova Ordem de Reparo',
      customer: 'Cliente',
      deviceType: 'Tipo de Dispositivo',
      deviceModel: 'Modelo do Aparelho (ex: iPhone 15 Pro, iPad Air)',
      deviceSerial: 'Número de Série / IMEI',
      faultDesc: 'Defeito Relatado pelo Cliente',
      diagnosticNotes: 'Notas Iniciais do Diagnóstico Técnico',
      assignedTech: 'Técnico Responsável',
      estFee: 'Custo Estimado do Reparo (£)',
      depositAmount: 'Sinal / Adiantamento Pago (£)',
      btnSubmitRepair: 'Criar Ordem de Reparo',

      createInvoiceTitle: 'Emitir Nova Fatura',
      invoiceDesc: 'Descrição dos itens ou serviços',
      invoiceAmount: 'Valor (£)',
      dueDate: 'Data de Vencimento',
      paymentMethod: 'Condição de Pagamento',
      btnSubmitInvoice: 'Gerar & Emitir Fatura',

      addCustomerTitle: 'Cadastrar Novo Cliente',
      fullName: 'Nome Completo',
      phone: 'Telefone / WhatsApp',
      email: 'E-mail',
      address: 'Endereço Completo',
      initialCreditLimit: 'Limite de Crédito Inicial (£)',
      btnSubmitCustomer: 'Salvar Cadastro',

      productEditorTitleNew: 'Adicionar Produto à Loja do Cliente',
      productEditorTitleEdit: 'Editar Produto da Loja do Cliente',
      productName: 'Nome do Produto',
      category: 'Categoria',
      brand: 'Marca',
      sellPrice: 'Preço à Vista (£)',
      rtoMonthlyPrice: 'Preço Mensal RTO (£/mês)',
      stockQuantity: 'Quantidade em Estoque',
      condition: 'Condição do Aparelho',
      specs: 'Especificações Principais',
      description: 'Descrição do Produto',
      imageUrl: 'URL da Imagem',
      usePresetImage: 'Ou escolha uma foto de alta resolução:',
      colors: 'Cores Disponíveis (separadas por vírgula)',
      storage: 'Opções de Memória (separadas por vírgula)',
      btnSaveProduct: 'Salvar na Loja do Cliente',

      receiptTitle: 'Recibo Oficial da Loja',
      storeName: 'PhoneSuite UK & Operações',
      transactionDate: 'Data da Transação',
      totalCharged: 'Valor Total',
      paidVia: 'Pago via',
      statusPaid: 'PAGO INTEGRALMENTE',
      btnPrint: 'Imprimir / Salvar Recibo',
      btnClose: 'Fechar'
    },
    common: {
      save: 'Salvar Alterações',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      close: 'Fechar',
      filter: 'Filtrar',
      search: 'Buscar',
      loading: 'Carregando...'
    }
  }
};

export function StaffLanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('phonesuite_staff_portal_lang');
      if (savedLang === 'pt' || savedLang === 'en') {
        setLanguageState(savedLang);
      } else {
        const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en';
        if (browserLang.toLowerCase().startsWith('pt')) {
          setLanguageState('pt');
        }
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang) => {
    if (lang === 'pt' || lang === 'en') {
      setLanguageState(lang);
      try {
        localStorage.setItem('phonesuite_staff_portal_lang', lang);
      } catch (e) {}
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'pt' : 'en';
    setLanguage(nextLang);
  };

  const t = STAFF_DICTIONARY[language] || STAFF_DICTIONARY.en;

  return (
    <StaffLanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </StaffLanguageContext.Provider>
  );
}

export function useStaffLanguage() {
  const context = useContext(StaffLanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: STAFF_DICTIONARY.en
    };
  }
  return context;
}
