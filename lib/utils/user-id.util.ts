/** Resolves user id from auth state (id) or API payloads (_id). */
export function getUserId(user: { id?: string | null; _id?: string } | null | undefined): string {
    return user?.id ?? user?._id ?? "";
}
