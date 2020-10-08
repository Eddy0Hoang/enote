declare module 'uuid' {
  /**
   * (timestamp) UUID
   */
  export const v1: () => string;
  /**
   *  (namespace w/ MD5) UUID
   */
  export const v3: () => string;
  /**
   * (random) UUID
   */
  export const v4: () => string;
  /**
   *  (namespace w/ SHA-1) UUID
   */
  export const v5: () => string;
}