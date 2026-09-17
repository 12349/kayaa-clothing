import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../data/repository';
import { Order } from '../types';
import { Printer, ArrowLeft, Scissors, Pin, Calendar } from 'lucide-react';

export const OrderWorksheet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOrder(id).then((ord) => {
      setOrder(ord);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8 text-xs">Loading studio cutting worksheet...</div>;
  if (!order) return <div className="p-8 text-xs">Order not found.</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-8 print:p-0 font-sans">
      {/* Screen controls */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between no-print border-b pb-3">
        <Link to={`/order/${order.id}`} className="text-xs text-neutral-600 hover:text-black flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order</span>
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-semibold rounded hover:bg-neutral-800"
        >
          <Printer className="w-4 h-4" />
          <span>Print Studio Worksheet (Pin to Cutting Table)</span>
        </button>
      </div>

      {/* Cutting Sheet */}
      <div className="max-w-2xl mx-auto border-2 border-black p-6 sm:p-8 space-y-6 print:border-black print:p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-600">
              <Pin className="w-3.5 h-3.5" />
              <span>ATELIER WORKBENCH CUTTING SHEET</span>
            </div>
            <h1 className="font-display text-2xl font-bold mt-1">
              Order #{order.id}
            </h1>
            <p className="text-sm font-semibold">Client: {order.customer.fullName} ({order.customer.phone})</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-neutral-500 font-bold block">Promised Dispatch Due</span>
            <span className="font-mono text-xl font-bold text-black border-2 border-black px-2 py-0.5 inline-block mt-1">
              {new Date(order.dispatchByDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Customer Context / Event Notes */}
        <div className="bg-neutral-100 p-3 rounded border border-neutral-300 text-xs space-y-1">
          <strong className="block uppercase font-bold text-[10px] text-neutral-600">Client Event & Fit Notes:</strong>
          {order.occasion && <p>• <strong>Occasion:</strong> {order.occasion}</p>}
          {order.neededByDate && <p>• <strong>Need by event date:</strong> {order.neededByDate}</p>}
          {order.fitConcerns && <p>• <strong>Fit concern:</strong> {order.fitConcerns}</p>}
          {!order.occasion && !order.fitConcerns && <p className="text-neutral-500 italic">No special fit notes specified.</p>}
        </div>

        {/* Garments to Cut & Stitch */}
        <div className="space-y-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="border border-neutral-400 p-4 rounded space-y-3">
              <div className="flex items-start justify-between border-b border-neutral-300 pb-2">
                <div>
                  <h3 className="font-display font-bold text-base">{item.productName}</h3>
                  <p className="text-xs text-neutral-700 font-medium">{item.fabric}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 bg-black text-white rounded">
                    {item.size === 'made-to-measure' ? 'MADE-TO-MEASURE' : `SIZE ${item.size}`}
                  </span>
                  <span className="text-xs block text-neutral-600 mt-0.5">Qty: {item.quantity}</span>
                </div>
              </div>

              {/* Cutting Measurements in Large Legible Type */}
              {item.measurements ? (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-600 block">
                    Bespoke Pattern Measurements ({item.measurements.unit}):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3 border border-neutral-300 rounded font-mono text-sm">
                    <div>Bust: <strong className="text-base">{item.measurements.bust}&quot;</strong></div>
                    <div>Waist: <strong className="text-base">{item.measurements.waist}&quot;</strong></div>
                    <div>Hips: <strong className="text-base">{item.measurements.hips}&quot;</strong></div>
                    <div>Height: <strong className="text-base">{item.measurements.height}&quot;</strong></div>
                    {item.measurements.shoulder && (
                      <div>Shoulder: <strong className="text-base">{item.measurements.shoulder}&quot;</strong></div>
                    )}
                    {item.measurements.blouseSleeveLength && (
                      <div>Sleeve: <strong className="text-base">{item.measurements.blouseSleeveLength}&quot;</strong></div>
                    )}
                    {item.measurements.lehengaWaistToFloor && (
                      <div>Waist-to-Floor: <strong className="text-base">{item.measurements.lehengaWaistToFloor}&quot;</strong></div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold pt-1">
                    <span>Padding: {item.measurements.blousePadding ? 'YES [Cut Pads]' : 'NO'}</span>
                    <span>Fall & Pico: {item.measurements.fallAndPico ? 'YES [Hem Finished]' : 'NO'}</span>
                    <span>Petticoat: {item.measurements.petticoatNeeded ? 'YES [Include]' : 'NO'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-mono bg-neutral-50 p-2.5 rounded border">
                  Standard Atelier Pattern for Size <strong>{item.size}</strong>. Ensure 1.5-inch internal side seam margin.
                </div>
              )}

              {item.customNote && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 text-xs text-yellow-900 rounded">
                  <strong>Client Pattern Note:</strong> &ldquo;{item.customNote}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tailor Sign-Off Checklist */}
        <div className="pt-4 border-t-2 border-black grid grid-cols-4 gap-2 text-center text-[10px] font-mono uppercase">
          <div className="border border-neutral-400 p-2">[ ] Fabric Inspected</div>
          <div className="border border-neutral-400 p-2">[ ] Kalis Drafted</div>
          <div className="border border-neutral-400 p-2">[ ] Stitched & Padded</div>
          <div className="border border-neutral-400 p-2">[ ] Ironed & Tagged</div>
        </div>
      </div>
    </div>
  );
};
