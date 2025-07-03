'use client';

import { X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import ColorPicker from './ColorPicker';
import styles from './color-picker-dialog.module.css';

interface ColorPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentColors: Record<string, string>;
  onColorsChange: (colors: Record<string, string>) => void;
}

const ColorPickerDialog = ({
  open,
  onOpenChange,
  currentColors,
  onColorsChange,
}: ColorPickerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">
                Customize Resume Colors
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Choose from preset themes or create your own custom color scheme
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4">
          <ColorPicker
            currentColors={currentColors}
            onColorsChange={onColorsChange}
          />
        </div>
        
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="mr-2">
              Hide
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorPickerDialog;