export {}

// Create a type for the roles
// export type Roles = 'admin' | 'moderator'

 export type Roles = 'admin' | 'doctor' | 'nurse' | 'lab_technician' | 'cashier' | 'patient';


declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}