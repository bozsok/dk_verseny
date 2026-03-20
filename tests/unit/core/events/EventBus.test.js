import EventBus from '@/core/events/EventBus.js';

describe('EventBus', () => {
  let eventBus;
  let mockLogger;

  beforeEach(() => {
    eventBus = new EventBus();
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn()
    };
  });

  describe('Basic Functionality', () => {
    it('should register and notify listeners', () => {
      const callback = jest.fn();
      eventBus.on('test-event', callback);
      
      const testData = { foo: 'bar' };
      eventBus.emit('test-event', testData);
      
      expect(callback).toHaveBeenCalledWith(testData, expect.any(Object));
    });

    it('should handle multiple listeners for same event', () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      eventBus.on('test-event', cb1);
      eventBus.on('test-event', cb2);
      
      eventBus.emit('test-event', {});
      expect(cb1).toHaveBeenCalled();
      expect(cb2).toHaveBeenCalled();
    });

    it('should handle once listeners', () => {
      const callback = jest.fn();
      eventBus.once('test-event', callback);
      
      eventBus.emit('test-event', {});
      eventBus.emit('test-event', {});
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(eventBus.listenerCount('test-event')).toBe(0);
    });

    it('should remove listeners with off()', () => {
      const callback = jest.fn();
      const id = eventBus.on('test-event', callback);
      
      eventBus.off('test-event', id);
      eventBus.emit('test-event', {});
      
      expect(callback).not.toHaveBeenCalled();
    });

    it('should remove all listeners for an event with off(event)', () => {
        eventBus.on('test-event', jest.fn());
        eventBus.on('test-event', jest.fn());
        
        eventBus.off('test-event');
        expect(eventBus.listenerCount('test-event')).toBe(0);
    });
  });

  describe('Advanced Features', () => {
    it('should respect priority', () => {
      const executionOrder = [];
      eventBus.on('test', () => executionOrder.push('low'), { priority: 0 });
      eventBus.on('test', () => executionOrder.push('high'), { priority: 100 });
      eventBus.on('test', () => executionOrder.push('medium'), { priority: 50 });
      
      eventBus.emit('test');
      expect(executionOrder).toEqual(['high', 'medium', 'low']);
    });

    it('should run middleware', () => {
      const middleware = jest.fn(data => {
        data.data.modified = true;
        return data;
      });
      eventBus.use(middleware);
      
      const callback = jest.fn();
      eventBus.on('test', callback);
      
      eventBus.emit('test', { original: true });
      expect(middleware).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({ modified: true }), expect.any(Object));
    });

    it('should maintain history and stats', () => {
      eventBus.emit('event1', { a: 1 });
      eventBus.emit('event2', { b: 2 });
      
      const stats = eventBus.getStats();
      expect(stats.historySize).toBe(2);
      expect(stats.totalEvents).toBe(0); // No listeners yet
      
      eventBus.on('event1', () => {});
      expect(eventBus.getStats().totalEvents).toBe(1);
    });
  });

  describe('Diagnostics and Errors', () => {
    it('should log via provided logger', () => {
      eventBus.setLogger(mockLogger);
      eventBus.on('test', () => {});
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('listener registered'), expect.any(Object));
      
      eventBus.emit('test');
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('Event emitted'), expect.any(Object));
    });

    it('should handle errors in listeners', () => {
      eventBus.setLogger(mockLogger);
      eventBus.on('test', () => {
        throw new Error('Boom');
      });
      
      const result = eventBus.emit('test');
      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('execution failed'), expect.any(Object));
    });

    it('should handle errors in middleware', () => {
        eventBus.setLogger(mockLogger);
        eventBus.use(() => { throw new Error('Middleware fail'); });
        
        // Should not crash emit
        const result = eventBus.emit('test');
        expect(result).toBe(true);
        expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Middleware execution failed'), expect.any(Object));
    });

    it('should handle async errors in listeners', async () => {
        eventBus.setLogger(mockLogger);
        eventBus.on('test', async () => {
            throw new Error('Async Boom');
        });
        
        eventBus.emit('test');
        
        // Wait for async catch
        await new Promise(r => setTimeout(r, 0));
        expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Async event listener failed'), expect.any(Object));
    });
  });

  describe('Administrative', () => {
    it('should reset completely', () => {
      eventBus.on('test', () => {});
      eventBus.use(() => {});
      eventBus.emit('test');
      
      eventBus.reset();
      const stats = eventBus.getStats();
      expect(stats.totalEvents).toBe(0);
      expect(stats.middlewareCount).toBe(0);
      expect(stats.historySize).toBe(0);
    });
    
    it('should generate unique listener IDs', () => {
        const id1 = eventBus.generateListenerId();
        const id2 = eventBus.generateListenerId();
        expect(id1).not.toEqual(id2);
    });
  });
});
