// utils/pdfGenerator.ts
export const generateTicketPDF = (bookingId: string) => {
  const ticketUrl = `http://localhost:4000/api/tickets/${bookingId}`;
  window.open(ticketUrl, '_blank');
};