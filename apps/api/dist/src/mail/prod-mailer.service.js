import { injectable } from "@needle-di/core";
@injectable()
export class ProdMailerService {
    async send({ to, template }) {
        console.log(`Sending email to ${to}`);
        console.log(`Email: ${template}`);
        return await Promise.resolve();
    }
}
