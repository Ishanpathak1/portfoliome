declare module 'insane' {
  interface InsaneOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
  }
  function insane(html: string, options?: InsaneOptions): string;
  export default insane;
}
