/**
 * Centralized configuration for the application
 */

const env = import.meta.env;

export const CONFIG = {
  ENV: env.VITE_APP_ENV || 'production',
  USE_TEST_DB: String(env.VITE_USE_TEST_DB).toLowerCase() === 'true',
  SUPABASE_URL: env.VITE_SUPABASE_URL,
  SUPABASE_KEY: env.VITE_SUPABASE_ANON_KEY,
  N8N_BASE_URL: env.VITE_N8N_BASE_URL,
  LANGFUSE_PUBLIC_KEY: env.VITE_LANGFUSE_PUBLIC_KEY,
  LANGFUSE_BASEURL: env.VITE_LANGFUSE_BASEURL,
};

/**
 * Utility for unified logging
 */
export const logger = {
  db: (table, op, extra = '') => {
    if (CONFIG.ENV === 'development') {
      console.log(`[DB] Table: ${table} | Op: ${op} ${extra ? `| ${extra || ''}` : ''}`);
    }
  },
  error: (context, error) => {
    console.error(`[ERROR] ${context}:`, error);
  }
};
