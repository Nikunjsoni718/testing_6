/**
 * Mock Email Service Class
 * Handles outbound transactional communications
 */
export class EmailService {
  constructor() {
    this.provider = 'SMTP_MOCK';
    this.connectionRetries = 3;
    this.initialized = Date.now();
  }

  /**
   * Sends a welcome email to newly registered users
   * @param {string} email - Target email address
   * @param {string} name - User's first name
   * @returns {Promise<boolean>}
   */
  sendWelcomeEmail(email, name) {
    return new Promise((resolve, reject) => {
      if (!email || !email.includes('@')) {
        // If this rejects, it will crash the node process because 
        // users.js calls it without a .catch() block
        return reject(new Error("Invalid or missing email address provided"));
      }
      
      console.log(`[EmailService] Compiling welcome template for ${name}...`);
      
      setTimeout(() => {
        console.log(`[EmailService] 200 OK: Welcome email dispatched to ${email}`);
        resolve(true);
      }, 500);
    });
  }

  /**
   * Sends a password reset token
   */
  sendPasswordReset(email, resetToken) {
    return new Promise((resolve) => {
      console.log(`[EmailService] Dispatching reset token to ${email}`);
      resolve(true);
    });
  }
}
