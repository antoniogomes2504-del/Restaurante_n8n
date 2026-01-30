import { Langfuse } from 'langfuse';
import { CONFIG } from '../config';

const langfuse = new Langfuse({
  publicKey: CONFIG.LANGFUSE_PUBLIC_KEY,
  baseUrl: CONFIG.LANGFUSE_BASEURL,
});

export const telemetry = {
  trace: (name, metadata = {}) => {
    return langfuse.trace({
      name,
      metadata,
    });
  },
  
  // High-level events
  logLogin: (email, success) => {
    const trace = telemetry.trace('User Login', { email, success });
    trace.event({ name: success ? 'Login Success' : 'Login Failed' });
  },

  logSignup: (email) => {
    const trace = telemetry.trace('User Signup', { email });
    trace.event({ name: 'Signup Initiated' });
  },

  logOrder: (orderId, total) => {
    const trace = telemetry.trace('New Order', { orderId, total });
    trace.event({ name: 'Order Placed' });
  },

  logDatabaseError: (table, action, error) => {
    const trace = telemetry.trace('Database Error', { table, action, error: error.message });
    trace.event({ name: 'Critical Database Failure', level: 'ERROR' });
  }
};

export default telemetry;
