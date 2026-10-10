import { Armchair, Info } from 'lucide-react';

const SeatMap = ({
  totalSeats = 32,
  bookedSeats = [],
  selectedSeats = [],
  onSeatToggle,
  pricePerSeat = 0,
}) => {
  // Generate rows A through H (or more depending on totalSeats)
  // Standard 2x2 layout: 4 seats per row (e.g. Row A: A1, A2 | aisle | A3, A4)
  const rowsCount = Math.ceil(totalSeats / 4);
  const rows = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let r = 0; r < rowsCount; r++) {
    const rowLetter = alphabet[r] || `R${r + 1}`;
    rows.push({
      letter: rowLetter,
      left: [`${rowLetter}1`, `${rowLetter}2`],
      right: [`${rowLetter}3`, `${rowLetter}4`],
    });
  }

  const getSeatStatus = (seatNo) => {
    if (bookedSeats.includes(seatNo)) return 'booked';
    if (selectedSeats.includes(seatNo)) return 'selected';
    return 'available';
  };

  const renderSeat = (seatNo) => {
    const status = getSeatStatus(seatNo);

    let seatClasses = 'seat-available';
    let titleText = `Seat ${seatNo} - Available (₹${pricePerSeat})`;

    if (status === 'booked') {
      seatClasses = 'seat-booked';
      titleText = `Seat ${seatNo} - Already Booked`;
    } else if (status === 'selected') {
      seatClasses = 'seat-selected';
      titleText = `Seat ${seatNo} - Selected`;
    }

    return (
      <button
        key={seatNo}
        type="button"
        disabled={status === 'booked'}
        onClick={() => onSeatToggle(seatNo)}
        title={titleText}
        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all duration-200 select-none ${seatClasses}`}
      >
        <span className="text-[10px] sm:text-xs leading-none">{seatNo}</span>
        {status === 'booked' && (
          <span className="text-[8px] uppercase tracking-tighter opacity-70">Booked</span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Armchair className="w-5 h-5 text-orange-500" />
          Interactive Seat Selection
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-emerald-50 border-2 border-emerald-400"></span>
            <span className="text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-orange-500 border-2 border-orange-600"></span>
            <span className="text-slate-600">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-slate-200 border-2 border-slate-300"></span>
            <span className="text-slate-400">Booked</span>
          </div>
        </div>
      </div>

      {/* Bus Interior Mockup */}
      <div className="py-6 flex justify-center">
        <div className="border-4 border-slate-300 rounded-3xl p-5 bg-slate-50/70 max-w-sm w-full relative shadow-inner">
          {/* Driver Cabin Row */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-dashed border-slate-200 text-slate-400">
            <div className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
              FRONT / ENTRY
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-200 rounded-lg text-slate-700 text-xs font-bold shadow-sm">
              <span className="text-xs">DRIVER</span>
              <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3.5">
            {rows.map((row) => (
              <div key={row.letter} className="flex items-center justify-between">
                {/* Left Pair */}
                <div className="flex gap-2">
                  {row.left.map((seatNo) => renderSeat(seatNo))}
                </div>

                {/* Aisle */}
                <div className="text-[10px] font-bold text-slate-300 select-none tracking-widest px-2">
                  AISLE
                </div>

                {/* Right Pair */}
                <div className="flex gap-2">
                  {row.right.map((seatNo) => renderSeat(seatNo))}
                </div>
              </div>
            ))}
          </div>

          {/* Rear Bus End */}
          <div className="mt-6 pt-3 border-t-2 border-dashed border-slate-200 text-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              REAR / EMERGENCY EXIT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
