interface LogData {
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  timestamp?: string;
  data?: any;
}

class Logger {
  private formatMessage(logData: LogData): string {
    const timestamp = logData.timestamp || new Date().toISOString();
    const level = logData.level.toUpperCase().padEnd(5);
    const message = logData.message;
    const data = logData.data ? JSON.stringify(logData.data) : '';
    
    return `[${timestamp}] ${level} ${message} ${data}`.trim();
  }

  info(message: string, data?: any) {
    console.log(this.formatMessage({ message, level: 'info', data }));
  }

  warn(message: string, data?: any) {
    console.warn(this.formatMessage({ message, level: 'warn', data }));
  }

  error(message: string, data?: any) {
    console.error(this.formatMessage({ message, level: 'error', data }));
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage({ message, level: 'debug', data }));
    }
  }
}

export const logger = new Logger();
