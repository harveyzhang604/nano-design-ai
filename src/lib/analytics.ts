// 用户行为分析工具

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private enabled: boolean = true;

  // 追踪功能使用
  trackFeatureUse(featureId: string, presetId?: string) {
    if (!this.enabled) return;
    
    this.track('feature_use', {
      feature_id: featureId,
      preset_id: presetId,
      timestamp: Date.now()
    });
  }

  // 追踪预设选择
  trackPresetSelect(featureId: string, presetId: string) {
    if (!this.enabled) return;
    
    this.track('preset_select', {
      feature_id: featureId,
      preset_id: presetId,
      timestamp: Date.now()
    });
  }

  // 追踪参数调整
  trackParamChange(featureId: string, paramId: string, value: any) {
    if (!this.enabled) return;
    
    this.track('param_change', {
      feature_id: featureId,
      param_id: paramId,
      value: value,
      timestamp: Date.now()
    });
  }

  // 追踪图片处理
  trackImageProcess(featureId: string, success: boolean, duration?: number) {
    if (!this.enabled) return;
    
    this.track('image_process', {
      feature_id: featureId,
      success: success,
      duration: duration,
      timestamp: Date.now()
    });
  }

  // 追踪错误
  trackError(featureId: string, error: string) {
    if (!this.enabled) return;
    
    this.track('error', {
      feature_id: featureId,
      error: error,
      timestamp: Date.now()
    });
  }

  // 基础追踪方法
  private track(event: string, properties?: Record<string, any>) {
    // 发送到后端API
    if (typeof window !== 'undefined') {
      // 使用 localStorage 暂存数据
      const key = 'analytics_events';
      const events = JSON.parse(localStorage.getItem(key) || '[]');
      events.push({ event, properties, timestamp: Date.now() });
      
      // 保留最近1000条
      if (events.length > 1000) {
        events.shift();
      }
      
      localStorage.setItem(key, JSON.stringify(events));
      
      // 批量发送到服务器（可选）
      this.sendBatch();
    }
  }

  // 批量发送数据
  private async sendBatch() {
    // TODO: 实现批量发送到服务器
    // 可以使用 fetch 发送到 /api/analytics
  }

  // 获取统计数据
  getStats() {
    if (typeof window === 'undefined') return null;
    
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    
    // 统计功能使用次数
    const featureUse: Record<string, number> = {};
    const presetUse: Record<string, number> = {};
    
    events.forEach((e: AnalyticsEvent) => {
      if (e.event === 'feature_use' && e.properties?.feature_id) {
        featureUse[e.properties.feature_id] = (featureUse[e.properties.feature_id] || 0) + 1;
      }
      if (e.event === 'preset_select' && e.properties?.preset_id) {
        const key = `${e.properties.feature_id}:${e.properties.preset_id}`;
        presetUse[key] = (presetUse[key] || 0) + 1;
      }
    });
    
    return {
      totalEvents: events.length,
      featureUse,
      presetUse,
      topFeatures: Object.entries(featureUse)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
      topPresets: Object.entries(presetUse)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
    };
  }

  // 清除数据
  clear() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_events');
    }
  }
}

// 导出单例
export const analytics = new Analytics();
