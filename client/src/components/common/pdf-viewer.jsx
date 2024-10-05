// PdfViewer.js
import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';

// Set the workerSrc to the appropriate path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;

const PdfViewer = ({ url }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1); // Load the first page

      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    };

    loadPdf();
  }, [url]);

  return <canvas ref={canvasRef} className="w-full h-auto" />;
};

export default PdfViewer;
