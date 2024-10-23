export interface AviationUser {
    name: string,
    surname: string,
    email: string,
    password: string,
    phoneNumber?: string | undefined,
    age?: number | undefined
}