import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../data/repository';
import { Order } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { Printer, ArrowLeft, Scissors, QrCode } from 'lucide-react';

export const OrderReceipt: React.FC = () => {
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

  if (loading) {
    return <div className="p-12 text-center text-xs">Loading printable packing slip...</div>;
  }

  if (!order) {
    return <div className="p-12 text-center text-xs">Order not found.</div>;
  }

  const formatInr = (amt: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);

  const balanceDue = Math.max(0, order.grandTotalInr - order.paidAmountInr);

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-8 md:p-12 print:p-0 font-sans">
      {/* Screen-only Controls */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print border-b pb-4">
        <Link
          to={`/order/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order Tracking</span>
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-semibold rounded shadow hover:bg-neutral-800 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Packing Slip (A4 / A5)</span>
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div className="max-w-3xl mx-auto border border-neutral-300 print:border-none p-6 sm:p-10 print:p-0 space-y-8 bg-white print-container">
        {/* Studio Header & Brand Mark */}
        <div className="flex items-start justify-between border-b-2 border-black pb-5">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold tracking-tight">KAYAA CLOTHING</h1>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-neutral-700">
              Home Studio Atelier · Shahpur Jat, New Delhi
            </p>
            <p className="text-[10px] text-neutral-600 max-w-sm">
              {BRAND_CONFIG.studioAddress}
            </p>
            <p className="text-[10px] text-neutral-600">
              Official WhatsApp: <strong>{BRAND_CONFIG.officialWhatsAppNumber}</strong> | GSTIN: {BRAND_CONFIG.gstinPlaceholder}
            </p>
          </div>

          {/* QR Verification Mockup */}
          <div className="text-right flex flex-col items-end">
            <div className="w-20 h-20 border-2 border-black p-1 flex flex-col items-center justify-center text-center">
              <QrCode className="w-12 h-12 stroke-[1.5]" />
              <span className="text-[8px] font-mono tracking-tighter uppercase font-bold">VERIFY</span>
            </div>
            <span className="text-[9px] font-mono mt-1 text-neutral-600">kayaaclothing.com/verify</span>
          </div>
        </div>

        {/* Order Meta & Addresses Grid */}
        <div className="grid grid-cols-2 gap-6 text-xs pb-4 border-b border-neutral-300">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
              Ship To & Contact
            </span>
            <p className="font-bold text-sm">{order.customer.fullName}</p>
            <p>{order.customer.addressLine1}</p>
            {order.customer.addressLine2 && <p>{order.customer.addressLine2}</p>}
            <p>
              {order.customer.city}, {order.customer.state} {order.customer.postalCode}
            </p>
            <p className="font-semibold">{order.customer.country}</p>
            <p className="pt-1 font-mono">WhatsApp: {order.customer.phone}</p>
            <p className="font-mono">{order.customer.email}</p>
          </div>

          <div className="space-y-1 text-right">
            <div className="bg-neutral-100 p-2.5 rounded border border-neutral-300 inline-block text-right">
              <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                Official Order ID
              </span>
              <span className="font-mono text-xl font-bold tracking-wider">{order.id}</span>
            </div>
            <p className="pt-2">
              Order Date: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
            </p>
            <p>
              Promised Dispatch: <strong>{new Date(order.dispatchByDate).toLocaleDateString()}</strong>
            </p>
            <p>
              Payment Method: <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})
            </p>
            {order.occasion && (
              <p className="text-[11px] italic text-neutral-600">
                Occasion: {order.occasion}
              </p>
            )}
          </div>
        </div>

        {/* Itemised Table */}
        <div className="space-y-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black font-mono uppercase text-[10px] tracking-wider">
                <th className="py-2 font-bold">Piece & Fabric</th>
                <th className="py-2 font-bold">Size / Cut</th>
                <th className="py-2 text-right font-bold">Unit Price</th>
                <th className="py-2 text-center font-bold">Qty</th>
                <th className="py-2 text-right font-bold">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {order.items.map((item, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    <td className="py-3 pr-2">
                      <strong className="block text-sm">{item.productName}</strong>
                      <span className="text-[11px] text-neutral-600">{item.fabric}</span>
                      {item.customNote && (
                        <span className="text-[10px] italic block mt-0.5 text-neutral-700">
                          Tailor Note: &ldquo;{item.customNote}&rdquo;
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-semibold">
                      {item.size === 'made-to-measure' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-black">
                          <Scissors className="w-3 h-3" />
                          <span>Made to Measure</span>
                        </span>
                      ) : (
                        `Size ${item.size}`
                      )}
                    </td>
                    <td className="py-3 text-right font-mono">{formatInr(item.unitPriceInr)}</td>
                    <td className="py-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 text-right font-mono font-bold">
                      {formatInr(item.lineTotalInr)}
                    </td>
                  </tr>

                  {/* Complete Measurements Block for Cutting Table */}
                  {item.measurements && (
                    <tr className="bg-neutral-50 print:bg-transparent">
                      <td colSpan={5} className="py-2.5 px-3 border-t border-dashed border-neutral-400">
                        <div className="text-[10px] space-y-1">
                          <strong className="uppercase tracking-wider font-bold block">
                            Atelier Tailor Measurements (Pin to Fabric During Cutting):
                          </strong>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 font-mono">
                            <span>Bust: <strong>{item.measurements.bust}{item.measurements.unit}</strong></span>
                            <span>Waist: <strong>{item.measurements.waist}{item.measurements.unit}</strong></span>
                            <span>Hips: <strong>{item.measurements.hips}{item.measurements.unit}</strong></span>
                            <span>Height: <strong>{item.measurements.height}{item.measurements.unit}</strong></span>
                            {item.measurements.shoulder && (
                              <span>Shoulder: <strong>{item.measurements.shoulder}{item.measurements.unit}</strong></span>
                            )}
                            {item.measurements.blouseSleeveLength && (
                              <span>Sleeve: <strong>{item.measurements.blouseSleeveLength}{item.measurements.unit}</strong></span>
                            )}
                            {item.measurements.lehengaWaistToFloor && (
                              <span>Skirt Lgth: <strong>{item.measurements.lehengaWaistToFloor}{item.measurements.unit}</strong></span>
                            )}
                          </div>
                          <div className="flex gap-3 text-[9px] pt-0.5 text-neutral-700">
                            {item.measurements.blousePadding && <span>[✓] Padded Blouse</span>}
                            {item.measurements.fallAndPico && <span>[✓] Fall & Pico Edging</span>}
                            {item.measurements.petticoatNeeded && <span>[✓] Matching Inskirt</span>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end pt-2 border-t border-black">
          <div className="w-64 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">{formatInr(order.subtotalInr)}</span>
            </div>
            {order.m2mSurchargeTotalInr > 0 && (
              <div className="flex justify-between">
                <span>Made-to-Measure Surcharge</span>
                <span className="font-mono">+{formatInr(order.m2mSurchargeTotalInr)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping ({order.customer.country})</span>
              <span className="font-mono">
                {order.shippingInr === 0 ? 'FREE' : formatInr(order.shippingInr)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>GST (5% Apparel placeholder)</span>
              <span className="font-mono">+{formatInr(order.gstPlaceholderInr)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-black">
              <span>Grand Total</span>
              <span className="font-mono">{formatInr(order.grandTotalInr)}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Amount Paid</span>
              <span className="font-mono">{formatInr(order.paidAmountInr)}</span>
            </div>
            {balanceDue > 0 && (
              <div className="flex justify-between font-bold text-black border-t border-dashed pt-1">
                <span>Balance Due at Delivery</span>
                <span className="font-mono">{formatInr(balanceDue)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Personal Handwritten-Feel Note & Care Guidance */}
        <div className="pt-4 border-t border-neutral-300 text-xs space-y-2">
          <p className="font-display italic text-sm text-neutral-800">
            &ldquo;Thank you for welcoming my hand-stitched craft into your wardrobe. Every seam was cut with care in our New Delhi home studio. May this piece bring you warmth and grace at your celebration.&rdquo;
          </p>
          <div className="flex justify-between items-end pt-2 text-[10px] text-neutral-600">
            <div>
              <strong>Fabric Care:</strong> Store wrapped in unbleached cotton muslin. Keep away from direct damp or perfume sprays. Dry clean recommended.
            </div>
            <div className="font-display italic text-base text-black font-semibold">
              Kayaa Sharma
            </div>
          </div>
        </div>

        {/* TEAR-OFF SHIPPING LABEL BLOCK */}
        <div className="pt-6 border-t-2 border-dashed border-black">
          <div className="border-2 border-black p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest border-b border-black pb-1">
              <span>TEAR-OFF PARCEL SHIPPING LABEL</span>
              <span>EXPRESS COURIER DISPATCH</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] uppercase font-semibold text-neutral-500 block">Deliver To:</span>
                <p className="font-bold text-base leading-tight">{order.customer.fullName}</p>
                <p className="text-xs leading-tight mt-1">{order.customer.addressLine1}</p>
                {order.customer.addressLine2 && <p className="text-xs">{order.customer.addressLine2}</p>}
                <p className="text-xs font-bold mt-1">
                  {order.customer.city}, {order.customer.state} {order.customer.postalCode}
                </p>
                <p className="text-sm font-bold uppercase mt-1">{order.customer.country}</p>
                <p className="text-xs font-mono mt-1">Phone: {order.customer.phone}</p>
              </div>

              <div className="text-right flex flex-col justify-between text-[10px]">
                <div>
                  <span className="text-[9px] uppercase font-semibold text-neutral-500 block">Return / Shipper:</span>
                  <p className="font-bold text-xs">KAYAA CLOTHING ATELIER</p>
                  <p>{BRAND_CONFIG.studioAddress}</p>
                  <p>WhatsApp: {BRAND_CONFIG.officialWhatsAppNumber}</p>
                </div>
                <div className="font-mono text-sm font-bold border-t border-neutral-300 pt-1">
                  ORDER: {order.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
