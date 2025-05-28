import React from 'react';
    import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Download, Printer, MessageSquare } from 'lucide-react'; // Added MessageSquare for WhatsApp
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';

    const BillPreview = ({ billData }) => {
      const { toast } = useToast();

      if (!billData) return (
        <Card className="shadow-xl bg-white min-h-[600px] flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Bill preview will appear here.</p>
        </Card>
      );

      const { 
        customerName, customerAddress, customerMobile, // Removed customerFatherName
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
        headerSymbol: "ॐ", 
        memoType: "कैश मेमो",
        name: "मिश्रा कृषि बीज भण्डार",
        address: "हरदी डाली, नौतनवां, जिला- महराजगंज (उ.प्र.)",
        mobiles: ["Mob. 9554154276", "7668624715", "9598657271", "9118123644"],
      };

      const terms = [
        "न्याय क्षेत्र महराजगंज।",
        "बीज बोने से पहले जमाव देख लें। जमाव न होने पर एक सप्ताह के अन्दर वापिस कर दें।",
        "फसल और पैदावार की कोई जिम्मेदारी नहीं होगी।",
        "भूल चूक लेनी देनी।"
      ];

      const handlePrint = () => {
        window.print();
      };

      const handleShareWhatsApp = () => {
        if (!customerMobile) {
          toast({
            variant: "destructive",
            title: "Cannot Share",
            description: "Customer mobile number is required to share on WhatsApp.",
          });
          return;
        }

        let message = `*${shopDetails.name} - Bill Summary*\n\n`;
        message += `Bill No: ${billNumber}\n`;
        message += `Date: ${billDate}\n\n`;
        message += `Customer: ${customerName}\n`;
        if (customerAddress) message += `Address: ${customerAddress}\n`;
        message += `Mobile: ${customerMobile}\n\n`;
        message += "*Items:*\n";
        items.forEach(item => {
          message += `- ${item.name} (Qty: ${item.quantity}) @ ${currencySymbol}${item.price.toFixed(2)} ${currencyName}\n`;
        });
        message += `\nSubtotal: ${currencySymbol}${subtotal.toFixed(2)} ${currencyName}\n`;
        if (discountAmount > 0) {
          message += `Discount: -${currencySymbol}${discountAmount.toFixed(2)} ${currencyName}\n`;
        }
        message += `*Total Amount: ${currencySymbol}${totalAmount.toFixed(2)} ${currencyName}*\n\n`;
        message += `Payment Method: ${paymentMethod}\n\n`;
        message += `Thank you for your business!\n${shopDetails.name}`;

        const whatsappUrl = `https://wa.me/${customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      };
      
      const hindiFontStyle = { fontFamily: "'Noto Sans Devanagari', sans-serif" };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl print-area bg-white relative overflow-hidden border-2 border-black p-1">
            <div className="border border-black p-4">
              <CardHeader className="p-0 mb-2">
                <div className="text-xs text-right">
                  {shopDetails.mobiles.map(m => <p key={m}>{m}</p>)}
                </div>
                <div className="flex justify-between items-start text-xs mb-1">
                  <div>
                    <p>{shopDetails.gstin}</p>
                    <p>{shopDetails.seedLic}</p>
                    <p>{shopDetails.pesticideLic}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold" style={hindiFontStyle}>{shopDetails.headerSymbol}</p>
                    <p style={hindiFontStyle}>{shopDetails.memoType}</p>
                  </div>
                  <div className="w-1/4"></div>
                </div>
                
                <div className="text-center mb-2">
                  <h1 className="text-2xl font-bold" style={hindiFontStyle}>{shopDetails.name}</h1>
                  <p className="text-sm" style={hindiFontStyle}>{shopDetails.address}</p>
                </div>

                <div className="flex justify-between items-center text-sm mb-2">
                  <p style={hindiFontStyle}>नं० <span className="font-mono">{billNumber.replace('INV-', '')}</span></p>
                  <p style={hindiFontStyle}>दिनांक: <span className="font-mono">{billDate}</span></p>
                </div>

                <div className="text-sm space-y-0.5">
                  <div className="flex">
                    <p style={hindiFontStyle} className="w-20">नाम:</p>
                    <p className="border-b border-dotted border-black flex-grow mr-2">{customerName || '....................................................'}</p>
                    <p style={hindiFontStyle} className="w-20">मो० नं०:</p>
                    <p className="border-b border-dotted border-black flex-grow">{customerMobile || '....................'}</p>
                  </div>
                  {/* Removed Father's Name row */}
                  <div className="flex">
                    <p style={hindiFontStyle} className="w-20">पता:</p>
                    <p className="border-b border-dotted border-black flex-grow">{customerAddress || '.....................................................'}</p>
                  </div>
                </div>
              </CardHeader>
            
              <CardContent className="p-0 mb-2">
                <Table className="border-collapse border border-black">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border border-black text-center w-[8%]" style={hindiFontStyle}>क्र.</TableHead>
                      <TableHead className="border border-black text-center w-[42%]" style={hindiFontStyle}>विवरण</TableHead>
                      <TableHead className="border border-black text-center w-[15%]" style={hindiFontStyle}>मात्रा</TableHead>
                      <TableHead className="border border-black text-center w-[15%]" style={hindiFontStyle}>दर ({currencyName})</TableHead>
                      <TableHead className="border border-black text-center w-[20%]" style={hindiFontStyle}>मूल्य ({currencyName})</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items && items.length > 0 ? items.map((item, index) => (
                      <TableRow key={item.billItemId} className="h-8">
                        <TableCell className="border border-black text-center text-sm font-mono">{index + 1}</TableCell>
                        <TableCell className="border border-black text-sm pl-1">{item.name}</TableCell>
                        <TableCell className="border border-black text-right text-sm pr-1 font-mono">{item.quantity}</TableCell>
                        <TableCell className="border border-black text-right text-sm pr-1 font-mono">{item.price.toFixed(2)}</TableCell>
                        <TableCell className="border border-black text-right text-sm pr-1 font-mono">{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    )) : (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={`empty-${i}`} className="h-8">
                          <TableCell className="border border-black">&nbsp;</TableCell>
                          <TableCell className="border border-black">&nbsp;</TableCell>
                          <TableCell className="border border-black">&nbsp;</TableCell>
                          <TableCell className="border border-black">&nbsp;</TableCell>
                          <TableCell className="border border-black">&nbsp;</TableCell>
                        </TableRow>
                      ))
                    )}
                    {items && items.length < 5 && [...Array(5 - items.length)].map((_, i) => (
                        <TableRow key={`fill-${i}`} className="h-8">
                          <TableCell className="border border-black">&nbsp;</TableCell>
                          <TableCell className="border border-black">&nbsp;</TableCell>
                          <TableCell className="border border-black">&nbsp;</TableCell>
                          <TableCell className="border border-black">&nbsp;</TableCell>
                          <TableCell className="border border-black">&nbsp;</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="border border-black"></TableCell>
                      <TableCell className="border border-black text-right font-bold pr-1" style={hindiFontStyle}>कुल ({currencyName})</TableCell>
                      <TableCell className="border border-black text-right font-bold pr-1 font-mono">{subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                    {discountAmount > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="border border-black"></TableCell>
                        <TableCell className="border border-black text-right font-bold pr-1" style={hindiFontStyle}>छूट ({currencyName})</TableCell>
                        <TableCell className="border border-black text-right font-bold pr-1 font-mono text-red-600">-{discountAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    )}
                     <TableRow>
                      <TableCell colSpan={3} className="border border-black"></TableCell>
                      <TableCell className="border border-black text-right font-bold pr-1" style={hindiFontStyle}>महायोग ({currencyName})</TableCell>
                      <TableCell className="border border-black text-right font-bold pr-1 font-mono">{totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="text-xs mt-2">
                  {terms.map((term, i) => <p key={i} style={hindiFontStyle} className={i === terms.length -1 ? 'text-center' : ''}>{term}</p>)}
                </div>

                <div className="flex justify-between mt-8 text-sm">
                  <p style={hindiFontStyle}>ह० क्रेता</p>
                  <p style={hindiFontStyle}>ह० विक्रेता</p>
                </div>
              </CardContent>
            </div>
          </Card>
          <CardFooter className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-3 no-print mt-4">
              <Button variant="outline" onClick={handleShareWhatsApp} className="w-full sm:w-auto text-green-600 border-green-600 hover:bg-green-600/10">
                <MessageSquare className="mr-2 h-4 w-4" /> Share on WhatsApp
              </Button>
              <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto text-primary border-primary hover:bg-primary/10">
                <Printer className="mr-2 h-4 w-4" /> Print Bill
              </Button>
              <Button disabled className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-opacity">
                <Download className="mr-2 h-4 w-4" /> Save as PDF (Soon)
              </Button>
          </CardFooter>

          <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap');
            
            .print-area {
              font-family: 'Arial', sans-serif;
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
                width: 100%;
                margin: 0;
                padding: 0;
                border: none !important;
                box-shadow: none !important;
              }
              .no-print {
                display: none !important;
              }
              .print-area [style*="font-family: 'Noto Sans Devanagari'"] {
                 font-family: 'Noto Sans Devanagari', sans-serif !important;
              }
            }
          `}</style>
        </motion.div>
      );
    };

    export default BillPreview;