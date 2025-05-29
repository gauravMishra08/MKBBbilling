import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const BillPreview = ({ billData }) => {
  const { toast } = useToast();

  if (!billData) return (
    <Card className="shadow-xl bg-white min-h-[300px] flex items-center justify-center">
      <p className="text-muted-foreground text-lg">Bill preview will appear here.</p>
    </Card>
  );

  const { 
    customerName, customerAddress, customerMobile, customerPincode,
    items, currency, paymentMethod, 
    subtotal, discountAmount, totalAmount 
  } = billData;
  
  const currencySymbol = currency === 'INR' ? '₹' : 'रु';
  const currencyName = currency === 'INR' ? 'INR' : 'NPR';
  const billNumber = `INV-${String(Date.now()).slice(-6)}`;
  const billDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const shopDetails = {
    gstin: "GSTIN: 09AXDPM6796R1Z9",
    seedLic: "SEED LIC. No. 491/49090",
    pesticideLic: "PESTICIDE LIC. No. 13/MG/2014",
    name: "मिश्रा कृषि बीज भण्डार",
    address: "हरदी डाली, नौतनवां, जिला- महराजगंज (उ.प्र.)",
    mobiles: ["+919554154276", "+919118123644"],
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!customerMobile) {
      toast({
        variant: "destructive",
        title: "शेयर नहीं कर सकते",
        description: "व्हाट्सएप पर शेयर करने के लिए ग्राहक का मोबाइल नंबर आवश्यक है।",
      });
      return;
    }

    let message = `*${shopDetails.name} - बिल सारांश*\n\n`;
    message += `बिल नं: ${billNumber}\n`;
    message += `दिनांक: ${billDate}\n\n`;
    message += `ग्राहक: ${customerName}\n`;
    if (customerAddress) message += `पता: ${customerAddress}\n`;
    if (customerPincode) message += `पिनकोड: ${customerPincode}\n`;
    message += `मोबाइल: ${customerMobile}\n\n`;
    message += "*वस्तुएँ:*\n";
    items.forEach(item => {
      message += `- ${item.name} (मात्रा: ${item.quantity}) @ ${currencySymbol}${item.price.toFixed(2)} ${currencyName}\n`;
    });
    message += `\nउप-योग: ${currencySymbol}${subtotal.toFixed(2)} ${currencyName}\n`;
    if (discountAmount > 0) {
      message += `छूट: -${currencySymbol}${discountAmount.toFixed(2)} ${currencyName}\n`;
    }
    message += `*कुल राशि: ${currencySymbol}${totalAmount.toFixed(2)} ${currencyName}*\n\n`;
    message += `भुगतान विधि: ${paymentMethod}\n\n`;
    message += `खरीदारी के लिए धन्यवाद!\nहमसे फिर से खरीदारी करें।\n${shopDetails.name}`;

    const whatsappUrl = `https://wa.me/${customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const hindiFontStyle = { fontFamily: "'Noto Sans Devanagari', sans-serif" };
  const englishFontStyle = { fontFamily: "'Arial', sans-serif" };

  // Function to detect if text contains Devanagari characters
  const isDevanagari = (text) => {
    return /[\u0900-\u097F]/.test(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-xl print-area bg-white relative overflow-hidden border border-gray-300 p-0 max-w-[80mm] mx-auto">
        <div className="p-2">
          <CardHeader className="p-0 mb-1">
            {/* Shop Header */}
            <div className="text-center mb-1">
              <h1 className="text-lg font-bold" style={hindiFontStyle}>{shopDetails.name}</h1>
              <p className="text-xs" style={hindiFontStyle}>{shopDetails.address}</p>
              <div className="flex justify-center gap-2 text-[10px] mt-1">
                {shopDetails.mobiles.map((m, i) => (
                  <span key={i} style={hindiFontStyle}>{m}</span>
                ))}
              </div>
            </div>

            {/* Bill Info */}
            <div className="flex justify-between items-center text-xs mb-1 border-b border-dotted pb-1">
              <p style={hindiFontStyle}>नं०: <span className="font-mono">{billNumber.replace('INV-', '')}</span></p>
              <p style={hindiFontStyle}>दिनांक: <span className="font-mono">{billDate}</span></p>
            </div>

            {/* Customer Info */}
            <div className="text-xs space-y-1 mb-2">
              <div className="flex">
                <p style={hindiFontStyle} className="w-12">नाम:</p>
                <p className="border-b border-dotted border-black flex-grow" style={isDevanagari(customerName) ? hindiFontStyle : englishFontStyle}>
                  {customerName || '........................'}
                </p>
              </div>
              <div className="flex">
                <p style={hindiFontStyle} className="w-12">मो०:</p>
                <p className="border-b border-dotted border-black flex-grow">{customerMobile || '............'}</p>
              </div>
              <div className="flex">
                <p style={hindiFontStyle} className="w-12">पता:</p>
                <p className="border-b border-dotted border-black flex-grow" style={isDevanagari(customerAddress) ? hindiFontStyle : englishFontStyle}>
                  {customerAddress || '........................'}
                </p>
              </div>
              {customerPincode && (
                <div className="flex">
                  <p style={hindiFontStyle} className="w-12">पिन:</p>
                  <p className="border-b border-dotted border-black flex-grow">{customerPincode}</p>
                </div>
              )}
            </div>
          </CardHeader>
        
          <CardContent className="p-0 mb-1">
            {/* Items Table */}
            <Table className="border-collapse border border-black text-xs">
              <TableHeader>
                <TableRow className="h-6">
                  <TableHead className="border border-black text-center p-0 w-[8%]" style={hindiFontStyle}>क्र.</TableHead>
                  <TableHead className="border border-black text-center p-0" style={hindiFontStyle}>विवरण</TableHead>
                  <TableHead className="border border-black text-center p-0 w-[15%]" style={hindiFontStyle}>मात्रा</TableHead>
                  <TableHead className="border border-black text-center p-0 w-[15%]" style={hindiFontStyle}>दर</TableHead>
                  <TableHead className="border border-black text-center p-0 w-[20%]" style={hindiFontStyle}>मूल्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items && items.length > 0 ? items.map((item, index) => (
                  <TableRow key={item.billItemId} className="h-5">
                    <TableCell className="border border-black text-center p-0 font-mono">{index + 1}</TableCell>
                    <TableCell className="border border-black p-0 pl-1 truncate max-w-[80px]" style={isDevanagari(item.name) ? hindiFontStyle : englishFontStyle}>
                      {item.name}
                    </TableCell>
                    <TableCell className="border border-black text-right p-0 pr-1 font-mono">{item.quantity}</TableCell>
                    <TableCell className="border border-black text-right p-0 pr-1 font-mono">{item.price.toFixed(2)}</TableCell>
                    <TableCell className="border border-black text-right p-0 pr-1 font-mono">{(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                )) : (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={`empty-${i}`} className="h-5">
                      <TableCell className="border border-black p-0"> </TableCell>
                      <TableCell className="border border-black p-0"> </TableCell>
                      <TableCell className="border border-black p-0"> </TableCell>
                      <TableCell className="border border-black p-0"> </TableCell>
                      <TableCell className="border border-black p-0"> </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Totals */}
            <div className="text-xs mt-1">
              <div className="flex justify-between border-b border-black">
                <p style={hindiFontStyle} className="font-bold">कुल ({currencyName}):</p>
                <p className="font-mono">{subtotal.toFixed(2)}</p>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between border-b border-black">
                  <p style={hindiFontStyle} className="font-bold">छूट ({currencyName}):</p>
                  <p className="font-mono text-red-600">-{discountAmount.toFixed(2)}</p>
                </div>
              )}
              <div className="flex justify-between border-b border-black">
                <p style={hindiFontStyle} className="font-bold">महायोग ({currencyName}):</p>
                <p className="font-mono font-bold">{totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-1">
                <p style={hindiFontStyle}>भुगतान:</p>
                <p>{paymentMethod}</p>
              </div>
            </div>

            {/* Licenses */}
            <div className="text-[8px] mt-2">
              <p>{shopDetails.gstin}</p>
              <p>{shopDetails.seedLic}</p>
              <p>{shopDetails.pesticideLic}</p>
            </div>

          </CardContent>
        </div>
      </Card>

      {/* Action Buttons */}
      <CardFooter className="p-4 flex flex-col sm:flex-row justify-center items-center gap-2 no-print mt-4">
        <Button 
          variant="outline" 
          onClick={handleShareWhatsApp} 
          className="w-full sm:w-auto text-green-600 border-green-600 hover:bg-green-600/10"
          size="sm"
        >
          <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
        </Button>
        <Button 
          variant="outline" 
          onClick={handlePrint} 
          className="w-full sm:w-auto text-primary border-primary hover:bg-primary/10"
          size="sm"
        >
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
      </CardFooter>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap');
        
        @page {
          size: 80mm auto;
          margin: 0;
        }
        
        .print-area {
          width: 80mm;
          font-size: 10px;
          font-family: 'Arial', sans-serif;
          padding: 2mm;
        }
        
        .print-area [style*="font-family: 'Noto Sans Devanagari'"] {
          font-family: 'Noto Sans Devanagari', sans-serif !important;
        }

        @media print {
          body * {
            visibility: hidden;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            margin: 0;
            padding: 2mm;
            border: none !important;
            box-shadow: none !important;
            page-break-after: avoid;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default BillPreview;
