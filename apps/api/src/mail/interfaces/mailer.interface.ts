import type { EmailTemplate } from "./email-template.interface.js";

export type SendProps = {
  to: string | string[];
  template: EmailTemplate;
};

export interface Mailer {
  send: (data: SendProps) => Promise<void>;
}
