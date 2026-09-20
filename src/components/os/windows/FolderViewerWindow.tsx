import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  FileCode,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { WindowState } from '../../../types/os';
import { WindowFrame } from '../WindowFrame';
import { soundFx } from '../../../utils/audio';

interface FolderViewerWindowProps {
  folderId: string;
  onClose: () => void;
}

export const FolderViewerWindow: React.FC<FolderViewerWindowProps> = ({
  folderId,
  onClose,
}) => {
  const { desktopItems, renameDesktopItem, removeDesktopItem, addFileToFolder } = useOS();
  const folder = desktopItems.find((item) => item.id === folderId);

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState(folder?.title || '');
  const [newFileName, setNewFileName] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  if (!folder) return null;

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameInput.trim()) {
      soundFx.playClick();
      renameDesktopItem(folderId, renameInput.trim());
      setIsRenaming(false);
    }
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      soundFx.playPop();
      addFileToFolder(folderId, newFileName.trim(), 'مستند تم إنشاؤه بواسطة المستخدم في نظام Almdrasa Gateway.');
      setNewFileName('');
      setIsAddingFile(false);
    }
  };

  const handleDeleteFolder = () => {
    soundFx.playClick(260, 0.04);
    removeDesktopItem(folderId);
    onClose();
  };

  const syntheticWindowState: WindowState = {
    id: 'settings', // standard valid WindowId
    title: folder.title,
    icon: 'Folder',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 35,
    position: { x: 190, y: 110 },
    size: { width: 680, height: 460 },
  };

  const selectedFile = folder.files?.find((f) => f.id === selectedFileId);

  return (
    <WindowFrame
      windowState={syntheticWindowState}
      theme="ivory"
      onClose={onClose}
    >
          <div className="p-6 space-y-6 text-[#191816] select-text h-full flex flex-col">
            {/* Header / Folder Details */}
            <div className="border-b border-[#E5E0D6] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#C5A370] text-[#191816] flex items-center justify-center shadow-sm">
                  <Folder className="w-6 h-6 fill-current/20 stroke-[1.8]" />
                </div>
                <div>
                  {isRenaming ? (
                    <form onSubmit={handleRenameSubmit} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={renameInput}
                        onChange={(e) => setRenameInput(e.target.value)}
                        className="px-2.5 py-1 text-[16px] font-bold font-serif rounded-lg border border-[#2F6FCE] bg-white text-[#191816] focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg bg-[#292724] text-[#F8F4EC] hover:bg-[#191816]"
                        title="حفظ"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRenaming(false)}
                        className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-[#504A43]"
                        title="إلغاء"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-[24px] font-bold text-[#191816]">
                        {folder.title}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setRenameInput(folder.title);
                          setIsRenaming(true);
                        }}
                        className="p-1 rounded hover:bg-black/5 text-[#756F66]"
                        title="إعادة تسمية المجلد"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-[12px] text-[#756F66]">
                    سطح المكتب / {folder.title} · {folder.files?.length || 0} عناصر
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingFile(true)}
                  className="px-3.5 py-2 rounded-lg bg-[#292724] text-[#F8F4EC] text-[12px] font-semibold flex items-center gap-1.5 hover:bg-[#191816] transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ملف جديد</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteFolder}
                  className="px-3 py-2 rounded-lg border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف المجلد</span>
                </button>
              </div>
            </div>

            {/* New File Input Box */}
            {isAddingFile && (
              <form
                onSubmit={handleCreateFile}
                className="p-4 rounded-xl bg-white/80 border border-[#E5E0D6] flex items-center gap-3 shadow-sm animate-in fade-in duration-150"
              >
                <FileText className="w-5 h-5 text-[#2F6FCE]" />
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="اكتب اسم الملف الجديد (مثال: مواصفات_المعمارية.md)"
                  className="flex-1 px-3 py-1.5 text-[13px] rounded-lg border border-[#D4CFC5] bg-white text-[#191816] focus:outline-none focus:ring-1 focus:ring-[#2F6FCE]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[#2F6FCE] text-white text-[12px] font-semibold hover:bg-[#255bb0] transition-colors"
                >
                  إنشاء
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingFile(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#D4CFC5] text-[#504A43] text-[12px] hover:bg-black/5 transition-colors"
                >
                  إلغاء
                </button>
              </form>
            )}

            {/* Files Grid & Content Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden min-h-55">
              {/* Files List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {(!folder.files || folder.files.length === 0) ? (
                  <div className="h-48 rounded-2xl border-2 border-dashed border-[#D4CFC5] flex flex-col items-center justify-center p-6 text-center text-[#756F66]">
                    <Folder className="w-10 h-10 stroke-[1.2] opacity-40 mb-2" />
                    <p className="font-serif font-bold text-[16px] text-[#191816]">هذا المجلد فارغ حالياً</p>
                    <p className="text-[12px] mt-1 text-[#756F66]">
                      انقر على زر "ملف جديد" بالأعلى لإنشاء ملاحظات ومستندات داخل هذا المجلد.
                    </p>
                  </div>
                ) : (
                  folder.files.map((file) => {
                    const isSelected = selectedFileId === file.id;
                    return (
                      <div
                        key={file.id}
                        onClick={() => {
                          soundFx.playClick(450, 0.02);
                          setSelectedFileId(file.id);
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#2F6FCE]/10 border-[#2F6FCE] shadow-sm'
                            : 'bg-white/60 border-[#E5E0D6] hover:bg-white hover:border-[#D4CFC5]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F1EEE8] flex items-center justify-center text-[#292724]">
                            <FileCode className="w-4 h-4 text-[#76654D]" />
                          </div>
                          <div>
                            <div className="font-medium text-[13px] text-[#191816]">{file.name}</div>
                            <div className="flex items-center gap-2 text-[11px] text-[#756F66] mt-0.5">
                              <span className="flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                {file.size}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {file.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[11px] font-semibold text-[#2F6FCE]">عرض المحتوى</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* File Preview Panel */}
              {selectedFile && (
                <div className="w-full md:w-64 p-4 rounded-xl bg-white/80 border border-[#E5E0D6] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#756F66] tracking-wider">
                      معاينة المستند
                    </span>
                    <h4 className="font-serif font-bold text-[15px] text-[#191816] mt-1">
                      {selectedFile.name}
                    </h4>
                    <p className="text-[12px] text-[#504A43] mt-2.5 leading-relaxed bg-[#F8F6F1] p-3 rounded-lg border border-[#E5E0D6] font-mono whitespace-pre-wrap">
                      {selectedFile.content || 'لا توجد بيانات نصية إضافية.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E5E0D6] text-[11px] text-[#756F66] flex justify-between">
                    <span>الحجم: {selectedFile.size}</span>
                    <span>التاريخ: {selectedFile.date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </WindowFrame>
  );
};
