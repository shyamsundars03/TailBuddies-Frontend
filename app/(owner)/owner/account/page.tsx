"use client"


import { AccountForm } from "../../../../components/owner/AccountForm"
import { useAppSelector } from "../../../../lib/redux/hooks"

export default function OwnerAccountPage() {
    const { user } = useAppSelector((state) => state.auth)

    const userData = {
        username: user?.username || "",
        email: user?.email || "",
        gender: user?.gender || "Female",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        country: user?.country || "",
        pincode: user?.pincode || "",
    }

    return (
        <AccountForm initialData={userData} />
    )
}
