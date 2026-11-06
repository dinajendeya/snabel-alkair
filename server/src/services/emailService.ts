export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  type: 'WELCOME' | 'APPLICATION_SUBMITTED' | 'APPLICATION_APPROVED' | 'APPLICATION_REJECTED' | 'PASSWORD_RESET';
}

export interface SentEmailRecord extends EmailPayload {
  id: string;
  sentAt: Date;
}

export class EmailService {
  private history: SentEmailRecord[] = [];

  async send(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const record: SentEmailRecord = {
      ...payload,
      id: messageId,
      sentAt: new Date(),
    };

    this.history.unshift(record);
    if (this.history.length > 100) {
      this.history.pop();
    }

    console.log(`[EMAIL DISPATCH] To: ${payload.to} | Type: ${payload.type} | Subject: "${payload.subject}"`);
    return { success: true, messageId };
  }

  getHistory(): SentEmailRecord[] {
    return this.history;
  }

  generateWelcomeEmail(userName: string): EmailPayload {
    return {
      to: '',
      subject: 'Welcome to Senabil Community Impact Platform',
      type: 'WELCOME',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #16a34a;">Welcome to Senabil, ${userName}!</h2>
          <p>Thank you for joining our humanitarian aid and community impact network.</p>
          <p>You can now explore active relief projects, submit applications, and track your humanitarian participation directly from your dashboard.</p>
          <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px;">
            <p style="margin: 0; color: #166534; font-weight: bold;">Building Sustainable Impact Across Gaza</p>
          </div>
        </div>
      `,
    };
  }

  generateApplicationSubmittedEmail(userName: string, projectTitle: string): EmailPayload {
    return {
      to: '',
      subject: `Application Received: ${projectTitle}`,
      type: 'APPLICATION_SUBMITTED',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0284c7;">Application Received</h2>
          <p>Dear ${userName},</p>
          <p>We have successfully received your application for <strong>${projectTitle}</strong>.</p>
          <p>Our review committee is actively evaluating all submissions. You will receive an in-app notification and email as soon as an update is available.</p>
          <p>Status: <span style="background-color: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 4px; font-weight: bold;">PENDING REVIEW</span></p>
        </div>
      `,
    };
  }

  generateApplicationReviewedEmail(
    userName: string,
    projectTitle: string,
    status: 'APPROVED' | 'REJECTED',
    notes?: string
  ): EmailPayload {
    const isApproved = status === 'APPROVED';
    const color = isApproved ? '#16a34a' : '#dc2626';
    const bgColor = isApproved ? '#f0fdf4' : '#fef2f2';

    return {
      to: '',
      subject: `Application Update: ${projectTitle} (${status})`,
      type: isApproved ? 'APPLICATION_APPROVED' : 'APPLICATION_REJECTED',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: ${color};">Application ${status}</h2>
          <p>Dear ${userName},</p>
          <p>Your application for <strong>${projectTitle}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
          ${notes ? `<div style="background: ${bgColor}; padding: 12px; border-radius: 6px; margin: 15px 0;"><strong>Committee Notes:</strong> ${notes}</div>` : ''}
          <p>You can view full details in your Senabil user profile.</p>
        </div>
      `,
    };
  }
}

export const emailService = new EmailService();

// Export legacy references for backwards compatibility
export const emailHistory = emailService.getHistory();
export const sendEmail = (payload: EmailPayload) => emailService.send(payload);
export const generateWelcomeEmail = (name: string) => emailService.generateWelcomeEmail(name);
export const generateApplicationSubmittedEmail = (name: string, title: string) =>
  emailService.generateApplicationSubmittedEmail(name, title);
export const generateApplicationReviewedEmail = (
  name: string,
  title: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
) => emailService.generateApplicationReviewedEmail(name, title, status, notes);
