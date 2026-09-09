"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PiArrowRightThin } from "react-icons/pi";

const PopupComp = ({ isOpen, onClose, PopupData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-brand-dark border-brand-line text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{PopupData?.header}</DialogTitle>
          <DialogDescription className="text-brand-muted">
            {PopupData?.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          {PopupData?.message.map((message, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-zinc-300">
              <PiArrowRightThin className="w-5 h-5 mt-0.5 text-brand-blue shrink-0" />
              <span>{message}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-brand-yellow text-black hover:bg-brand-yellow/90 font-bold rounded-full px-6"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupComp;
