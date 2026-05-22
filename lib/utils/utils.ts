
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function getSpecialtyId(
    specialtyId?: string | { _id?: string; name?: string }
): string {
    if (!specialtyId) return "";
    if (typeof specialtyId === "string") return specialtyId;
    return specialtyId._id ?? "";
}

export function getSpecialtyLabel(
    specialtyId?: string | { _id?: string; name?: string },
    fallback = "Specialist"
): string {
    if (!specialtyId || typeof specialtyId === "string") return fallback;
    return specialtyId.name ?? fallback;
}

export function formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
}
