
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
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

const MOCK_PRODUCTS = [
  { id: 'prod_1', name: 'Urea Fertilizer (46-0-0)', priceINR: 270, category: 'Fertilizer' },
  { id: 'prod_2', name: 'DAP Fertilizer (18-46-0)', priceINR: 1350, category: 'Fertilizer' },
  { id: 'prod_3', name: 'Glyphosate Herbicide 1L', priceINR: 600, category: 'Pesticide' },
  { id: 'prod_4', name: 'Cypermethrin Insecticide 250ml', priceINR: 350, category: 'Pesticide' },
  { id: 'prod_5', name: 'Hybrid Maize Seeds (1kg)', priceINR: 400, category: 'Seeds' },
  { id: 'prod_6', name: 'Paddy Seeds - Basmati (1kg)', priceINR: 150, category: 'Seeds' },
  { id: 'prod_7', name: 'Neem Oil Organic Pesticide 500ml', priceINR: 300, category: 'Organic' },
  { id: 'prod_8', name: 'Vermicompost Organic Fertilizer (5kg)', priceINR: 250, category: 'Organic' },
];

const ProductSearch = ({ onProductSelect }) => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
      setProducts(MOCK_PRODUCTS);
    }
  }, []);
  
  const handleSelect = (product) => {
    onProductSelect(product);
    setOpen(false);
    toast({
      title: `${product.name} added`,
      description: "You can adjust quantity now.",
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground hover:text-foreground"
        >
          Search and add product...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search product by name..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product)}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p>{product.name}</p>
                    <p className="text-xs text-muted-foreground">₹{product.priceINR.toFixed(2)}</p>
                  </div>
                   <PlusCircle className="h-4 w-4 text-primary/70" />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSearch;
