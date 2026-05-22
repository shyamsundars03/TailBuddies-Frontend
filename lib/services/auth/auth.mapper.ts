import { AuthUser } from "../../types/auth/auth.types";

interface RawApiUser {
    id?: string;
    _id?: string;
    email: string;
    role: AuthUser["role"];
    username: string;
    googleId?: string;
    profilePic?: string;
    phone?: string;
    gender?: string;
}

/**
 * Standardizes the user object from the API to the frontend format.
 * Handles differences like MongoDB _id vs frontend id.
 */
export const mapAuthUser = (apiUser: RawApiUser): AuthUser => {
    return {
        id: apiUser.id || apiUser._id || "",
        email: apiUser.email,
        role: apiUser.role,
        username: apiUser.username,
        googleId: apiUser.googleId,
        profilePic: apiUser.profilePic,
        phone: apiUser.phone,
        gender: apiUser.gender,
    };
};
