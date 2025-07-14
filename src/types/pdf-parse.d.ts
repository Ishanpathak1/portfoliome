declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }
  
  interface PDFOptions {
    version?: string;
    [key: string]: any;
  }
  
  function pdfParse(buffer: Buffer, options?: PDFOptions): Promise<PDFData>;
  export = pdfParse;
} 