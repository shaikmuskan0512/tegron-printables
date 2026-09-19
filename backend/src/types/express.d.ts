export {};

declare global {
  namespace Express {
    interface Request {
      /** Set by authenticateUser from the verified JWT. Never taken from client input. */
      userId?: string;
      /** Set by authenticateAdmin from the verified admin JWT. */
      adminId?: string;
    }
  }
}
