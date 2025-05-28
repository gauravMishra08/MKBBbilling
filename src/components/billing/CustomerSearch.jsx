import React, { useState, useEffect } from 'react';
    import { Check, ChevronsUpDown, UserPlus, Users } from 'lucide-react';
    import { cn } from '@/lib/utils';
    import { Button } from '@/components/ui/button';
    import {
      Command,
      CommandEmpty,
      CommandGroup,
      CommandInput,
      CommandItem,
      CommandList,
    } from '@/components/ui/command';
    import {
      Popover,
      PopoverContent,
      PopoverTrigger,
    } from '@/components/ui/popover';
    import { useToast } from '@/components/ui/use-toast';

    const CustomerSearch = ({ onCustomerSelect, onAddNewCustomer }) => {
      const [open, setOpen] = useState(false);
      const [customers, setCustomers] = useState([]);
      const [searchTerm, setSearchTerm] = useState("");
      const { toast } = useToast();

      useEffect(() => {
        const storedCustomers = localStorage.getItem('customers');
        if (storedCustomers) {
          setCustomers(JSON.parse(storedCustomers));
        } else {
          localStorage.setItem('customers', JSON.stringify([]));
          setCustomers([]);
        }
      }, []);

      const handleSelect = (customer) => {
        onCustomerSelect(customer);
        setOpen(false);
        toast({
          title: `Selected: ${customer.name}`,
          description: "Customer details populated.",
        });
      };
      
      const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.mobile && customer.mobile.includes(searchTerm))
      );

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between text-muted-foreground hover:text-foreground"
            >
              Search Existing Customer...
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput 
                placeholder="Search by name or mobile..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>
                  No customer found.
                  <Button variant="link" onClick={() => { setOpen(false); onAddNewCustomer(); }} className="mt-2">
                    <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
                  </Button>
                </CommandEmpty>
                <CommandGroup heading={<div className="flex items-center"><Users className="mr-2 h-4 w-4" /> Customers</div>}>
                  {filteredCustomers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={`${customer.name} ${customer.mobile}`}
                      onSelect={() => handleSelect(customer)}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p>{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.mobile} - {customer.address ? customer.address.substring(0,20) + '...' : 'No address'}</p>
                      </div>
                       <Check className={cn("h-4 w-4", "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    };

    export default CustomerSearch;