import React, { useEffect, useState } from 'react';
import { Bus, Download, Printer, MapPin, Calendar, Clock, User, QrCode, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { generateTicketPDF } from '../utils/pdfGenerator';
import { useToast } from '../context/ToastContext';

const TicketCard = ({ booking, onCancel }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  const schedule = booking?.scheduleId || {};
  const bus = schedule?.busId || {};
  const route = schedule?.routeId || {};

  useEffect(() => {
    if (booking?.bookingId) {
      const qrData = JSON.stringify({
        id: booking.bookingId,
        passenger: booking.passengers?.[0]?.name,
        from: route.source,
        to: route.destination,
        date: schedule.journeyDate,
        seats: booking.selectedSeats,
        amount: booking.totalAmount,
      });

      QRCode.toDataURL(qrData, { width: 140, margin: 1, color: { dark: '#0f172a' } })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error(err));
    }
  }, [booking, route, schedule]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await generateTicketPDF(booking);
      toast.success('Ticket PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF ticket.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = booking?.bookingStatus === 'CANCELLED';

  return (
    <div className="space-y-6">
      {/* Printable Ticket Wrapper */}
      <div
        id="printable-ticket"
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto"
      >
        {/* Ticket Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Bus className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight">
                  Bus<span className="text-orange-500">Go</span>
                </span>
                <span className="block text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  Electronic Bus Ticket & Boarding Pass
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
                  isCancelled
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                }`}
              >
                {isCancelled ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    CANCELLED
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CONFIRMED
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
            <div>
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                Booking Reference (PNR)
              </span>
              <span className="text-base font-black text-white font-mono">{booking?.bookingId}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                Booking Date
              </span>
              <span className="font-semibold text-slate-200">
                {new Date(booking?.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">
                Total Fare
              </span>
              <span className="text-base font-black text-orange-400">
                ₹{booking?.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Tear-off Notch Separation */}
        <div className="relative h-6 bg-slate-50 border-y border-dashed border-slate-200 flex items-center justify-between px-3">
          <div className="w-5 h-5 -ml-6 bg-slate-50 rounded-full border border-slate-300 shadow-inner"></div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            TEAR ALONG DASHED LINE FOR BOARDING INSPECTION
          </div>
          <div className="w-5 h-5 -mr-6 bg-slate-50 rounded-full border border-slate-300 shadow-inner"></div>
        </div>

        {/* Ticket Body Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Origin & Destination Display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                DEPARTURE
              </span>
              <h4 className="text-xl font-black text-slate-900">{route.source || 'Mumbai'}</h4>
              <p className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                {schedule.departureTime || '08:00 AM'}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-1">{schedule.journeyDate}</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-24 sm:w-36 border-t-2 border-slate-300 border-dashed"></div>
                <Bus className="w-4 h-4 text-orange-500" />
                <div className="w-24 sm:w-36 border-t-2 border-slate-300 border-dashed"></div>
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">
                {route.duration || '4h'} ({route.distance || 'Direct'})
              </span>
            </div>

            <div className="space-y-1 text-left sm:text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ARRIVAL
              </span>
              <h4 className="text-xl font-black text-slate-900">{route.destination || 'Pune'}</h4>
              <p className="text-xs text-slate-600 font-semibold flex items-center justify-start sm:justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                {schedule.arrivalTime || '01:00 PM'}
              </p>
            </div>
          </div>

          {/* Coach & Seat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Operator
              </span>
              <p className="font-bold text-slate-900 text-sm truncate">
                {bus.operator || bus.name || 'Travels'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Bus / Coach Type
              </span>
              <p className="font-bold text-slate-900 text-sm truncate">
                {bus.busType || 'AC Sleeper'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Bus Number
              </span>
              <p className="font-bold text-slate-900 text-sm font-mono truncate">
                {bus.busNumber || 'MH-04-AZ-2024'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/50">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">
                Reserved Seat(s)
              </span>
              <div className="flex flex-wrap gap-1">
                {booking?.selectedSeats?.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 bg-orange-500 text-white font-black text-xs rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Passengers Table & QR Code */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 pt-4 border-t border-slate-100">
            {/* Passengers Table */}
            <div className="flex-1 w-full space-y-3">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-500" />
                Passenger Details
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 font-semibold">#</th>
                      <th className="py-2 font-semibold">Name</th>
                      <th className="py-2 font-semibold">Age</th>
                      <th className="py-2 font-semibold">Gender</th>
                      <th className="py-2 font-semibold">Seat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {booking?.passengers?.map((p, idx) => (
                      <tr key={idx} className="text-slate-800">
                        <td className="py-2 text-slate-400">{idx + 1}</td>
                        <td className="py-2 font-bold">{p.name}</td>
                        <td className="py-2">{p.age} yrs</td>
                        <td className="py-2">{p.gender}</td>
                        <td className="py-2 font-black text-orange-600">{p.seatNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 shrink-0 self-center md:self-start">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Ticket Boarding QR Code"
                  className="w-28 h-28 object-contain rounded-lg"
                />
              ) : (
                <div className="w-28 h-28 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider">
                Scan for Boarding
              </span>
            </div>
          </div>
        </div>

        {/* Boarding instructions */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 sm:px-8 py-3.5 text-xs text-slate-500 flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Carry original government ID (Aadhaar / Voter ID / Passport) during journey.
          </span>
          <span className="font-semibold text-slate-600">BusGo Care: 1800 200 4567</span>
        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden pt-2">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-105 text-sm cursor-pointer"
        >
          {downloading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Preparing PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Ticket PDF</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-sm transition-all text-sm cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Print Ticket</span>
        </button>

        {onCancel && !isCancelled && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl border border-rose-200 transition-all text-sm cursor-pointer"
          >
            <span>Cancel Booking</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
