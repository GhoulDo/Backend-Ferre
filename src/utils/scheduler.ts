class TaskScheduler {
  private tasks: Map<string, NodeJS.Timeout> = new Map();

  scheduleTask(name: string, fn: () => void, intervalMs: number) {
    // Cancelar tarea existente si existe
    this.cancelTask(name);
    
    const intervalId = setInterval(() => {
      try {
        fn();
      } catch (error) {
        console.error(`❌ Error en tarea programada '${name}':`, error);
      }
    }, intervalMs);
    
    this.tasks.set(name, intervalId);
    console.log(`⏰ Tarea '${name}' programada cada ${intervalMs / 1000 / 60} minutos`);
  }

  cancelTask(name: string) {
    const intervalId = this.tasks.get(name);
    if (intervalId) {
      clearInterval(intervalId);
      this.tasks.delete(name);
      console.log(`🛑 Tarea '${name}' cancelada`);
    }
  }

  cancelAllTasks() {
    for (const [name, intervalId] of this.tasks) {
      clearInterval(intervalId);
      console.log(`🛑 Tarea '${name}' cancelada`);
    }
    this.tasks.clear();
  }

  getActiveTasks(): string[] {
    return Array.from(this.tasks.keys());
  }
}

export const scheduler = new TaskScheduler();

// Función para programar tareas de mantenimiento
export function scheduleMaintenanceTasks() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Limpiar logs cada 6 horas
    scheduler.scheduleTask('cleanup-logs', () => {
      console.log('🧹 Ejecutando limpieza de logs...');
      // Aquí puedes implementar limpieza de logs si es necesario
    }, 6 * 60 * 60 * 1000);

    // Verificar salud del sistema cada hora
    scheduler.scheduleTask('health-monitor', () => {
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();
      
      console.log(`💊 Monitor de salud - Uptime: ${Math.floor(uptime / 60)}min, Memory: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
      
      // Alerta si el uso de memoria es muy alto
      if (memoryUsage.heapUsed > 400 * 1024 * 1024) { // 400MB
        console.warn('⚠️  Alto uso de memoria detectado');
      }
    }, 60 * 60 * 1000); // 1 hora
  }
}
