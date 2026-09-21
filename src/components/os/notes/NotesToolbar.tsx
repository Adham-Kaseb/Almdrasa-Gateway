import React from 'react';
import { TextDirection, TextAlign } from '../../../types/notes';
import { ToolbarDirectionAlign } from './ToolbarDirectionAlign';
import { ToolbarFormatting } from './ToolbarFormatting';
import { ToolbarInserts } from './ToolbarInserts';
import { ToolbarActions } from './ToolbarActions';

interface NotesToolbarProps {
  direction: TextDirection;
  textAlign: TextAlign;
  onToggleDirection: (dir: TextDirection) => void;
  onSetTextAlign: (align: TextAlign) => void;
  onFormat: (cmd: string, val?: string) => void;
  onInsertCallout: (type: 'tip' | 'warning' | 'question' | 'code') => void;
  onInsertImage: (file: File) => void;
  onOpenCodeModal?: () => void;
  onCopyAll: () => void;
  onExport: () => void;
  onReset: () => void;
  isCopied: boolean;
}

export const NotesToolbar: React.FC<NotesToolbarProps> = ({
  direction,
  textAlign,
  onToggleDirection,
  onSetTextAlign,
  onFormat,
  onInsertCallout,
  onInsertImage,
  onOpenCodeModal,
  onCopyAll,
  onExport,
  onReset,
  isCopied,
}) => {
  return (
    <div className="border-b border-[#E2DCCE] bg-[#F1EEE8] p-2 flex flex-wrap items-center justify-between gap-2 shrink-0 select-none text-[#3C3831]">
      <ToolbarDirectionAlign
        direction={direction}
        textAlign={textAlign}
        onToggleDirection={onToggleDirection}
        onSetTextAlign={onSetTextAlign}
      />

      <ToolbarFormatting onFormat={onFormat} direction={direction} />

      <ToolbarInserts
        onFormat={onFormat}
        onInsertCallout={onInsertCallout}
        onInsertImage={onInsertImage}
        onOpenCodeModal={onOpenCodeModal}
        direction={direction}
      />

      <ToolbarActions
        onCopyAll={onCopyAll}
        onExport={onExport}
        onReset={onReset}
        isCopied={isCopied}
        direction={direction}
      />
    </div>
  );
};
