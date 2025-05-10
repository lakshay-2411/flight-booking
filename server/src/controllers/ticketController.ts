// controllers/TicketController.ts
import { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { Flight } from "../models/Flight";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Define an interface for the populated booking
interface PopulatedBooking extends Omit<Document, "flight"> {
  flight: {
    airline: string;
    departureTime: string;
    arrivalTime: string;
    [key: string]: any;
  };
  passenger: string; // JSON string of passenger details
  from: string;
  to: string;
  journeyDate: string;
  numPassengers: number;
  bookedOn: Date;
}

interface PassengerDetail {
  name: string;
  age: string;
  gender: string;
}

export const generateTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      res.status(400).json({ error: "Booking ID is required" });
      return;
    }

    const booking = (await Booking.findById(bookingId).populate(
      "flight"
    )) as unknown as PopulatedBooking;

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(28);
    doc.setTextColor(44, 62, 80);
    doc.text("Flight Ticket", 105, 20, { align: "center" });

    doc.setDrawColor(52, 152, 219);
    doc.setFillColor(52, 152, 219);
    doc.rect(14, 25, 182, 3, "F");

    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Reference:", 15, 40);
    doc.setFont("helvetica", "normal");
    doc.text(bookingId, 60, 40);

    autoTable(doc, {
      startY: 50,
      head: [["Booking Information", "Details"]],
      body: [
        ["From", booking.from],
        ["To", booking.to],
        ["Journey Date", booking.journeyDate],
        ["Number of Passengers", booking.numPassengers.toString()],
        ["Booked On", booking.bookedOn.toDateString()],
      ],
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      margin: { top: 50 },
    });

    let passengerDetails: PassengerDetail[] = [];
    try {
      passengerDetails = JSON.parse(booking.passenger);
    } catch (e) {
      console.error("Error parsing passenger details:", e);
      passengerDetails = [
        { name: booking.passenger, age: "N/A", gender: "N/A" },
      ];
    }

    const passengerY = (doc as any).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: passengerY,
      head: [["Passenger Details"]],
      body: [[""]],
      headStyles: {
        fillColor: [46, 134, 193],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      styles: { cellPadding: 2 },
      showHead: "firstPage",
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY,
      head: [["Name", "Age", "Gender"]],
      body: passengerDetails.map((p) => [p.name, p.age, p.gender]),
      headStyles: {
        fillColor: [93, 173, 226],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [235, 245, 251] },
      styles: { cellPadding: 4 },
    }); // 🛠️ Missing closing parenthesis was added here

    if (booking.flight) {
      const currentY = (doc as any).lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: currentY,
        head: [["Flight Details", "Information"]],
        body: [
          ["Airline", booking.flight.airline],
          ["Departure Time", booking.flight.departureTime],
          ["Arrival Time", booking.flight.arrivalTime],
        ],
        headStyles: {
          fillColor: [231, 76, 60],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [255, 240, 245] },
        margin: { top: 10 },
      });
    }

    const qrY = (doc as any).lastAutoTable.finalY + 15;
    doc.setDrawColor(0);
    doc.setFillColor("0");
    doc.roundedRect(75, qrY, 60, 60, 1, 1, "S");

    doc.setFillColor("0");
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (Math.random() > 0.7) {
          doc.rect(77 + j * 4, qrY + 2 + i * 4, 3, 3, "F");
        }
      }
    }

    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Scan for boarding", 105, qrY + 70, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Thank you for choosing our service. Have a pleasant journey!",
      105,
      280,
      { align: "center" }
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket-${bookingId}.pdf`
    );

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating ticket:", err);
    res.status(500).json({ error: "Failed to generate ticket" });
  }
};
