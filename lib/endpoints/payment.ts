export const PAYMENT_ENDPOINTS = {
    CREATE_RAZORPAY_ORDER: '/payments/razorpay/order',
    VERIFY_RAZORPAY_PAYMENT: '/payments/razorpay/verify',
    WALLET: '/payments/wallet',
    WALLET_PAY: '/payments/wallet/pay',
    TRANSACTIONS: (page: number = 1, limit: number = 10) => `/payments/transactions?page=${page}&limit=${limit}`,
    RETRY: '/payments/retry',
    ADMIN_TRANSACTIONS: (page: number = 1, limit: number = 10, search: string = '', status: string = '') => 
        `/payments/admin/transactions?page=${page}&limit=${limit}&search=${search}&status=${status}`,
    ADMIN_TRANSACTION_DETAIL: (id: string) => `/payments/admin/transactions/${id}`,
    REQUEST_WITHDRAWAL: '/payments/wallet/withdraw/request',
    APPROVE_WITHDRAWAL: (id: string) => `/payments/admin/transactions/${id}/approve`,
    REJECT_WITHDRAWAL: (id: string) => `/payments/admin/transactions/${id}/reject`,
} as const;
