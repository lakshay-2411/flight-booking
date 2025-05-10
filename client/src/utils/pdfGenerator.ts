// utils/pdfGenerator.ts
export const generateTicketPDF = (bookingId: string) => {
  const ticketUrl = `${import.meta.env.VITE_BACKEND_URL}/${bookingId}`;
  window.open(ticketUrl, '_blank');
};