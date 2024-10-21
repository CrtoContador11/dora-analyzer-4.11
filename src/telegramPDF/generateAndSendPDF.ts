import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { FormDataType, Question, Category } from '../types';
import { generateChartData, chartOptions } from '../utils/chartUtils';

const TELEGRAM_BOT_TOKEN = '7979728776:AAF37aFpjmflfHrW0ykXbbIUTcd57X1X-rc';
const TELEGRAM_CHAT_ID = '763968348';

export const generateAndSendPDF = async (
  formData: FormDataType,
  questions: Question[],
  categories: Category[],
  language: 'es' | 'pt',
  chartImage: string
): Promise<boolean> => {
  console.log("Generating and sending PDF...");
  try {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Informe DORA', 105, 15, { align: 'center' });
    
    // Form details
    doc.setFontSize(12);
    doc.text(`Proveedor TIC/Departamento: ${formData.providerName}`, 20, 30);
    doc.text(`Entidad Financiera: ${formData.financialEntityName}`, 20, 40);
    doc.text(`Usuario: ${formData.userName}`, 20, 50);
    doc.text(`Fecha: ${new Date(formData.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR')}`, 20, 60);

    // Add chart to PDF
    if (chartImage) {
      doc.addImage(chartImage, 'PNG', 15, 70, 180, 100);
    } else {
      console.warn("Chart image not provided. Skipping chart in PDF.");
    }

    // Questions and Answers
    doc.addPage();
    const tableData = questions.map((q) => [
      q.text[language]
        .replace('{providerName}', formData.providerName)
        .replace('{financialEntityName}', formData.financialEntityName),
      q.options.find((opt) => opt.value === formData.answers[q.id])?.text[language] || '',
      formData.observations[q.id] || ''
    ]);

    doc.autoTable({
      head: [[language === 'es' ? 'Pregunta' : 'Pergunta', language === 'es' ? 'Respuesta' : 'Resposta', language === 'es' ? 'Observaciones' : 'Observações']],
      body: tableData,
      startY: 10,
      styles: { overflow: 'linebreak', cellWidth: 'wrap' },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 50 }, 2: { cellWidth: 60 } }
    });

    const pdfArrayBuffer = doc.output('arraybuffer');

    console.log("Sending message to Telegram...");
    const message = `Nuevo informe DORA:\nProveedor: ${formData.providerName}\nEntidad Financiera: ${formData.financialEntityName}\nUsuario: ${formData.userName}\nFecha: ${new Date(formData.date).toLocaleDateString()}`;
    
    const messageResponse = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    console.log("Message sent to Telegram:", messageResponse.data);

    console.log("Sending PDF to Telegram...");
    const formDataForTelegram = new FormData();
    formDataForTelegram.append('chat_id', TELEGRAM_CHAT_ID);
    formDataForTelegram.append('document', new Blob([pdfArrayBuffer], { type: 'application/pdf' }), 'informe_dora.pdf');

    const pdfResponse = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formDataForTelegram, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("PDF sent to Telegram:", pdfResponse.data);

    console.log('Mensaje y PDF enviados a Telegram con éxito');
    return true;
  } catch (error) {
    console.error('Error al generar o enviar PDF a Telegram:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
};