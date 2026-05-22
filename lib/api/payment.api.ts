import apiClient from './apiClient';
import { PAYMENT_ENDPOINTS } from '../endpoints/payment';
import { handleApiError } from '../utils/api-error.handler';
import { ApiResponse, PaginatedResponse, RazorpayOrderPayload } from '../types/api.types';
import type { OwnerWallet, WalletTransaction } from '../types/owner/owner.types';
import type { Transaction } from '../types/admin/admin.types';

export const paymentApi = {
    createRazorpayOrder: async (data: { amount: number; appointmentId: string }): Promise<ApiResponse<RazorpayOrderPayload>> => {
        try {
            const response = await apiClient.post(PAYMENT_ENDPOINTS.CREATE_RAZORPAY_ORDER, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to create Razorpay order');
        }
    },

    verifyRazorpayPayment: async (data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        appointmentId: string;
    }): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.post(PAYMENT_ENDPOINTS.VERIFY_RAZORPAY_PAYMENT, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to verify Razorpay payment');
        }
    },

    getWallet: async (): Promise<ApiResponse<OwnerWallet>> => {
        try {
            const response = await apiClient.get(PAYMENT_ENDPOINTS.WALLET);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch wallet');
        }
    },

    payWithWallet: async (data: { amount: number; appointmentId: string }): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.post(PAYMENT_ENDPOINTS.WALLET_PAY, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to pay with wallet');
        }
    },

    getTransactions: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<WalletTransaction>>> => {
        try {
            const response = await apiClient.get(PAYMENT_ENDPOINTS.TRANSACTIONS(page, limit));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch transactions');
        }
    },

    retryPayment: async (data: { appointmentId: string; method: string }): Promise<ApiResponse<RazorpayOrderPayload>> => {
        try {
            const response = await apiClient.post(PAYMENT_ENDPOINTS.RETRY, data);
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to retry payment');
        }
    },

    getAllTransactions: async (page: number = 1, limit: number = 10, search: string = '', status: string = ''): Promise<ApiResponse<PaginatedResponse<Transaction>>> => {
        try {
            const response = await apiClient.get(PAYMENT_ENDPOINTS.ADMIN_TRANSACTIONS(page, limit, search, status));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch all transactions');
        }
    },

    getTransactionDetail: async (id: string): Promise<ApiResponse<Transaction>> => {
        try {
            const response = await apiClient.get(PAYMENT_ENDPOINTS.ADMIN_TRANSACTION_DETAIL(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to fetch transaction detail');
        }
    },

    requestWithdrawal: async (amount: number): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.post(PAYMENT_ENDPOINTS.REQUEST_WITHDRAWAL, { amount });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to request withdrawal');
        }
    },

    approveWithdrawal: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.patch(PAYMENT_ENDPOINTS.APPROVE_WITHDRAWAL(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to approve withdrawal');
        }
    },

    rejectWithdrawal: async (id: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiClient.patch(PAYMENT_ENDPOINTS.REJECT_WITHDRAWAL(id));
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, 'Failed to reject withdrawal');
        }
    }
};
