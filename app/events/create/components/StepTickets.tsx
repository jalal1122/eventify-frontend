"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { EventFormValues } from "../schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreVertical, Calendar, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type TicketModalType = "PAID" | "FREE" | null;

export default function StepTickets() {
  const { control } = useFormContext<EventFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketType, setTicketType] = useState<TicketModalType>(null);

  // Local state for the ticket form
  const [ticketName, setTicketName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [salesStartDate, setSalesStartDate] = useState<Date | undefined>();
  const [salesStartTime, setSalesStartTime] = useState("");
  const [salesEndDate, setSalesEndDate] = useState<Date | undefined>();
  const [salesEndTime, setSalesEndTime] = useState("");

  const resetModal = () => {
    setTicketType(null);
    setTicketName("");
    setQuantity("");
    setPrice("");
    setAccountType("");
    setAccountNumber("");
    setSalesStartDate(undefined);
    setSalesStartTime("");
    setSalesEndDate(undefined);
    setSalesEndTime("");
  };

  const openModal = () => {
    resetModal();
    setIsModalOpen(true);
  };

  const handleSaveTicket = () => {
    if (!ticketName || !quantity) {
      alert("Please fill in the required fields: Name and Quantity.");
      return;
    }

    append({
      id: crypto.randomUUID(),
      type: ticketType === "PAID" ? "PAID" : "FREE",
      name: ticketName,
      quantity: parseInt(quantity, 10),
      price: ticketType === "PAID" ? parseFloat(price) : 0,
      paymentAccountType: accountType,
      paymentAccountNumber: accountNumber,
      salesStartDate,
      salesStartTime,
      salesEndDate,
      salesEndTime,
    });

    setIsModalOpen(false);
    resetModal();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-1">Tickets</h2>
        <p className="text-gray-500">Create ticket tiers for your event attendees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* The "Create New Ticket" dashed card */}
        <div
          onClick={openModal}
          className="h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#006782] hover:bg-slate-50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
            <Plus className="w-6 h-6 text-[#006782]" />
          </div>
          <h3 className="font-semibold text-[#001F29] text-lg">Create new tickets</h3>
          <p className="text-sm text-gray-500 mt-1">Add paid, free or donation tiers</p>
        </div>

        {/* Render Created Tickets */}
        {fields.map((ticket, index) => (
          <div key={ticket.id} className="h-64 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 flex-1 relative">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Active
                </span>
                <button onClick={() => remove(index)} className="text-gray-400 hover:text-red-500" title="Remove Ticket">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h4 className="text-xl font-bold text-[#001F29] truncate">{ticket.name}</h4>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="w-4 h-4 mr-1.5" />
                {ticket.salesStartDate ? format(ticket.salesStartDate, "MMM d, yyyy") : "Starts immediately"}
              </div>
            </div>
            
            <div className="bg-slate-50 p-5 border-t border-gray-100 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Price</p>
                <p className="text-xl font-bold text-[#001F29]">
                  {ticket.type === "FREE" ? "Rs: 00" : `Rs: ${ticket.price}`}
                </p>
              </div>
              <div className={`text-sm font-bold ${ticket.type === "FREE" ? "text-teal-600" : "text-[#006782]"}`}>
                {ticket.type}
              </div>
            </div>
            <button className="w-full py-3 bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors border-t border-gray-200 flex justify-center items-center">
              ✏️ Edit ticket
            </button>
          </div>
        ))}
      </div>

      {/* Add Tickets Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-0 rounded-3xl">
          <div className="h-2 w-full bg-gradient-to-r from-[#006782] to-[#004E63]" />
          
          {!ticketType ? (
            // Initial Selection View
            <div className="p-8">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-bold text-[#001F29]">Add tickets</DialogTitle>
                <p className="text-gray-500 mt-1">Choose a ticket type to get started.</p>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setTicketType("PAID")}
                  className="p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#006782] hover:bg-slate-50 text-center transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 text-[#006782] rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">$</div>
                  <h3 className="font-bold text-lg text-[#001F29]">Paid</h3>
                  <p className="text-sm text-gray-500 mt-1">Create a ticket that attendees pay for.</p>
                </div>
                <div 
                  onClick={() => setTicketType("FREE")}
                  className="p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#006782] hover:bg-slate-50 text-center transition-all"
                >
                  <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">F</div>
                  <h3 className="font-bold text-lg text-[#001F29]">Free</h3>
                  <p className="text-sm text-gray-500 mt-1">Create a free ticket for your event.</p>
                </div>
              </div>
            </div>
          ) : (
            // Form View
            <div className="p-8 pb-4 max-h-[85vh] overflow-y-auto">
              <DialogHeader className="mb-6 flex flex-row items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold text-[#001F29]">Add tickets</DialogTitle>
                </div>
              </DialogHeader>

              {/* Type Toggle Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-lg mb-8 max-w-xs">
                 <button 
                   onClick={() => setTicketType("PAID")}
                   className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${ticketType === "PAID" ? "bg-white text-[#001F29] shadow-sm" : "text-gray-500"}`}
                 >
                   Paid
                 </button>
                 <button 
                   onClick={() => setTicketType("FREE")}
                   className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${ticketType === "FREE" ? "bg-white text-[#001F29] shadow-sm" : "text-gray-500"}`}
                 >
                   Free
                 </button>
              </div>

              <div className="space-y-6">
                {/* Basic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>TICKET NAME *</Label>
                    <Input placeholder="e.g. General Admission" value={ticketName} onChange={(e) => setTicketName(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>AVAILABLE QUANTITY *</Label>
                    <Input type="number" placeholder="100" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>PRICE *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">Rs.</span>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={ticketType === "FREE" ? "00" : price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        disabled={ticketType === "FREE"}
                        className="h-11 pl-10" 
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Details (Only for Paid) */}
                {ticketType === "PAID" && (
                  <div className="bg-slate-50 border border-[#006782]/20 rounded-xl p-5 space-y-4">
                    <h3 className="font-semibold text-[#001F29]">Organizer Payment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Account Type</Label>
                        <Select value={accountType} onValueChange={setAccountType}>
                          <SelectTrigger className="h-11 bg-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easypaisa">Easypaisa</SelectItem>
                            <SelectItem value="jazzcash">JazzCash</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Account Number</Label>
                        <Input placeholder="03XXXXXXXXX" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="h-11 bg-white" />
                      </div>
                    </div>
                    <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg flex items-start gap-2">
                      <Info className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>Attendees will see these details during checkout and must upload a payment receipt to complete registration.</p>
                    </div>
                  </div>
                )}

                {/* Sales Duration */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-[#001F29] mb-4">Sales Duration (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500 font-bold uppercase">Sales Start</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                           <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-11", !salesStartDate && "text-muted-foreground")}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {salesStartDate ? format(salesStartDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="start">
                          <CalendarComponent mode="single" selected={salesStartDate} onSelect={setSalesStartDate} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500 font-bold uppercase">Start Time</Label>
                      <Input type="time" value={salesStartTime} onChange={(e) => setSalesStartTime(e.target.value)} className="h-11" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500 font-bold uppercase">Sales End</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                           <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-11", !salesEndDate && "text-muted-foreground")}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {salesEndDate ? format(salesEndDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="start">
                          <CalendarComponent mode="single" selected={salesEndDate} onSelect={setSalesEndDate} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500 font-bold uppercase">End Time</Label>
                      <Input type="time" value={salesEndTime} onChange={(e) => setSalesEndTime(e.target.value)} className="h-11" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveTicket} className="bg-[#006782] hover:bg-[#004E63] text-white">Save Ticket</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


