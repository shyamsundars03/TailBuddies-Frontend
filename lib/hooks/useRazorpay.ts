"use client"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

type RazorpayHandler = (response: Record<string, string>) => void | Promise<void>;

interface OpenRazorpayOptions {
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    orderId?: string;
    handler?: RazorpayHandler;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
    theme?: {
        color?: string;
    };
    onSuccess?: RazorpayHandler;
    onDismiss?: () => void;
}

interface RazorpayOptions extends OpenRazorpayOptions {
    key: string;
    handler: RazorpayHandler;
}

interface RazorpayWindow extends Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
}

export const useRazorpay = () => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(() => {
        if (typeof window === "undefined") return false;
        const rzpWindow = window as unknown as RazorpayWindow;
        return !!rzpWindow.Razorpay;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        const rzpWindow = window as unknown as RazorpayWindow;
        if (rzpWindow.Razorpay) {
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => {
            setIsScriptLoaded(false);
            toast.error("Failed to load Razorpay SDK");
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const openRazorpay = useCallback((options: OpenRazorpayOptions) => {
        const rzpWindow = window as unknown as RazorpayWindow;
        if (!isScriptLoaded || !rzpWindow.Razorpay) {
            toast.error("Razorpay SDK is not loaded yet. Please wait.");
            return;
        }

        const { onSuccess, onDismiss, handler, modal, ...rest } = options;

        const rzpOptions = {
            ...rest,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
            handler: handler ?? ((response) => {
                onSuccess?.(response);
            }),
            modal: {
                ...modal,
                ondismiss: modal?.ondismiss ?? onDismiss,
            },
        } as RazorpayOptions;

        const rzp = new rzpWindow.Razorpay(rzpOptions);
        rzp.open();
    }, [isScriptLoaded]);

    return {
        isScriptLoaded,
        openRazorpay,
    };
};
