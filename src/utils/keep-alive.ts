import https from 'https';
import http from 'http';

class KeepAlive {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly url: string;
  private readonly intervalMs: number;
  private readonly isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.url = this.isProduction 
      ? 'https://backend-ferre.onrender.com/health'
      : `http://localhost:${process.env.PORT || 4000}/health`;
    this.intervalMs = 14 * 60 * 1000; // 14 minutos (antes de los 15 min de suspensión)
  }

  start() {
    if (!this.isProduction) {
      console.log('⚠️  Keep-alive deshabilitado en desarrollo');
      return;
    }

    console.log('🔄 Iniciando keep-alive service...');
    console.log(`📡 URL de ping: ${this.url}`);
    console.log(`⏰ Intervalo: ${this.intervalMs / 1000 / 60} minutos`);

    // Primer ping después de 5 minutos de iniciado
    setTimeout(() => {
      this.ping();
      
      // Luego pings regulares cada 14 minutos
      this.intervalId = setInterval(() => {
        this.ping();
      }, this.intervalMs);
    }, 5 * 60 * 1000); // 5 minutos
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 Keep-alive service detenido');
    }
  }

  private ping() {
    const startTime = Date.now();
    const client = this.url.startsWith('https') ? https : http;

    const request = client.get(this.url, (res) => {
      const duration = Date.now() - startTime;
      
      if (res.statusCode === 200) {
        console.log(`✅ Keep-alive ping exitoso (${duration}ms) - ${new Date().toISOString()}`);
      } else {
        console.log(`⚠️  Keep-alive ping con código ${res.statusCode} (${duration}ms)`);
      }

      // Consumir la respuesta para liberar memoria
      res.resume();
    });

    request.on('error', (error) => {
      const duration = Date.now() - startTime;
      console.error(`❌ Error en keep-alive ping (${duration}ms):`, error.message);
    });

    request.on('timeout', () => {
      request.destroy();
      console.error('❌ Timeout en keep-alive ping');
    });

    // Timeout de 30 segundos
    request.setTimeout(30000);
  }

  // Método para ping manual (útil para testing)
  async manualPing(): Promise<{ success: boolean; duration: number; status?: number }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const client = this.url.startsWith('https') ? https : http;

      const request = client.get(this.url, (res) => {
        const duration = Date.now() - startTime;
        res.resume();
        resolve({ 
          success: res.statusCode === 200, 
          duration, 
          status: res.statusCode 
        });
      });

      request.on('error', () => {
        const duration = Date.now() - startTime;
        resolve({ success: false, duration });
      });

      request.setTimeout(30000);
    });
  }
}

export const keepAlive = new KeepAlive();
