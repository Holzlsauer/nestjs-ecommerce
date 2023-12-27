import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
    orderLog(name, quantity, value) {
        return `\x1b[35m${this.context} - Name: ${name} - Qty: ${quantity} - Price ${value} \x1b[33m${this.getTimestamp()}`
    }
}
