import apiClient from './apiClient';

export const paymentApi = {
    createRazorpayOrder: async (data: { amount: number; appointmentId: string }) => {
        const response = await apiClient.post('/payments/razorpay/order', data);
        return response.data;
    },

    verifyRazorpayPayment: async (data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        appointmentId: string;
    }) => {
        const response = await apiClient.post('/payments/razorpay/verify', data);
        return response.data;
    },

    getWallet: async () => {
        const response = await apiClient.get('/payments/wallet');
        return response.data;
    },

    payWithWallet: async (data: { amount: number; appointmentId: string }) => {
        const response = await apiClient.post('/payments/wallet/pay', data);
        return response.data;
    },

    getTransactions: async (page: number = 1, limit: number = 10) => {
        const response = await apiClient.get(`/payments/transactions?page=${page}&limit=${limit}`);
        return response.data;
    },

    retryPayment: async (data: { appointmentId: string; method: string }) => {
        const response = await apiClient.post('/payments/retry', data);
        return response.data;
    },

    getAllTransactions: async (page: number = 1, limit: number = 10, search: string = '', status: string = '') => {
        const response = await apiClient.get(`/payments/admin/transactions?page=${page}&limit=${limit}&search=${search}&status=${status}`);
        return response.data;
    },

    getTransactionDetail: async (id: string) => {
        const response = await apiClient.get(`/payments/admin/transactions/${id}`);
        return response.data;
    },
    requestWithdrawal: async (amount: number) => {
        const response = await apiClient.post('/payments/wallet/withdraw/request', { amount });
        return response.data;
    },
    approveWithdrawal: async (id: string) => {
        const response = await apiClient.patch(`/payments/admin/transactions/${id}/approve`);
        return response.data;
    },
    rejectWithdrawal: async (id: string) => {
        const response = await apiClient.patch(`/payments/admin/transactions/${id}/reject`);
        return response.data;
    }
};
