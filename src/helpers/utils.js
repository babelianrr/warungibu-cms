import { authenticatedUser } from "./isAuthenticated"

export const SUPER_USER = process.env.REACT_APP_SUPER_USER

export const AUTH = authenticatedUser()