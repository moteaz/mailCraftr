import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { MESSAGES } from '@/constants';

export function usePDFExport() {
  const downloadPDF = async (content: string, fileName: string) => {
    try {
      const pdf = new jsPDF();
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      tempDiv.style.padding = '20px';
      tempDiv.style.width = '190mm';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
      toast.success(MESSAGES.SUCCESS.PDF_DOWNLOADED);
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error(MESSAGES.ERROR.PDF_FAILED);
    }
  };

  return { downloadPDF };
}
