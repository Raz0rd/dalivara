"use client";

import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import ItemChooser from "./ItemChooser";

interface Item {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface AdditionalSelectorProps {
  title: string;
  description: string;
  items: Item[];
  selectedItems: Item[];
  onSelectionChange: (items: Item[]) => void;
  minItems?: number;
  maxItems?: number;
  required?: boolean;
}

export default function AdditionalSelector({
  title,
  description,
  items,
  selectedItems,
  onSelectionChange,
  minItems = 0,
  maxItems = Infinity,
  required = false,
}: AdditionalSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemToggle = (item: Item, quantity: number) => {
    const existingIndex = selectedItems.findIndex((i) => i.id === item.id);
    
    if (quantity === 0) {
      // Remove item
      if (existingIndex !== -1) {
        const newItems = selectedItems.filter((i) => i.id !== item.id);
        onSelectionChange(newItems);
      }
    } else {
      // Add or update item
      if (existingIndex !== -1) {
        // Item already exists, just update (for future quantity support)
        onSelectionChange(selectedItems);
      } else {
        // Add new item if not at max
        if (selectedItems.length < maxItems) {
          onSelectionChange([...selectedItems, item]);
        }
      }
    }
  };

  const getItemQuantity = (itemId: string) => {
    return selectedItems.some((i) => i.id === itemId) ? 1 : 0;
  };

  return (
    <div className="bg-surface rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-200 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-semibold text-gray-900">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">{description}</p>
            {required && (
              <span className="bg-secondary text-white text-xs font-semibold px-2 py-1 rounded">
                Obrigatório
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          size={24}
          color="#8C14FF"
          strokeWidth={2}
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mb-4 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search size={16} color="#666666" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Pesquise pelo nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-white border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={16} color="#666666" strokeWidth={2} />
              </button>
            )}
          </div>

          <ul className="space-y-2">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <ItemChooser
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onQuantityChange={(qty) => handleItemToggle(item, qty)}
                  maxReached={selectedItems.length >= maxItems && !selectedItems.some(i => i.id === item.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
