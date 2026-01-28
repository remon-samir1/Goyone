"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronDown,
  Mail,
  UploadCloud,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  Code,
  Quote,
  List,
  ListOrdered,
  Undo,
  Redo,
  Heading1,
  Heading2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
      isActive
        ? "bg-primary text-white"
        : disabled
          ? "text-gray-300 cursor-not-allowed"
          : "hover:bg-gray-100 text-body",
    )}
    title={title}
    type="button"
  >
    {children}
  </button>
);

const SendEmailModal: React.FC<SendEmailModalProps> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Placeholder.configure({
        placeholder: "Write your email content...",
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] px-4 py-3 text-sm text-body",
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-[32px] w-full max-w-[700px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col max-h-[90vh] overflow-hidden",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-mainText italic">
                Send Email
              </h2>
              <p className="text-sm text-body italic opacity-70">
                Compose an email to Sarah Johnson
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-5">
          {/* To */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              To
            </label>
            <div className="relative">
              <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-primary italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer">
                <option value="amr">~Amr Kamel</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
            </div>
          </div>

          {/* Cc */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Cc
            </label>
            <div className="relative">
              <select
                defaultValue=""
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Select an option
                </option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
            </div>
          </div>

          {/* Bcc */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Bcc
            </label>
            <div className="relative">
              <select
                defaultValue=""
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-primary italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Select an option
                </option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Subject
            </label>
            <input
              type="text"
              placeholder="new mail"
              defaultValue="new mail"
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-mainText italic focus:outline-none focus:border-primary bg-white"
            />
          </div>

          {/* Content - Tiptap Editor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="border border-[#F1F5F9] rounded-xl overflow-hidden">
              {/* Toolbar */}
              {editor && (
                <div className="flex items-center gap-1 p-2 border-b border-[#F1F5F9] flex-wrap bg-gray-50">
                  <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    isActive={editor.isActive("underline")}
                    title="Underline (Ctrl+U)"
                  >
                    <UnderlineIcon className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </MenuButton>

                  <div className="w-px h-6 bg-gray-200 mx-1" />

                  <MenuButton
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                  >
                    <Heading1 className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                  >
                    <Heading2 className="w-4 h-4" />
                  </MenuButton>

                  <div className="w-px h-6 bg-gray-200 mx-1" />

                  <MenuButton
                    onClick={setLink}
                    isActive={editor.isActive("link")}
                    title="Add Link"
                  >
                    <Link2 className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    title="Inline Code"
                  >
                    <Code className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                    isActive={editor.isActive("blockquote")}
                    title="Quote"
                  >
                    <Quote className="w-4 h-4" />
                  </MenuButton>

                  <div className="w-px h-6 bg-gray-200 mx-1" />

                  <MenuButton
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    isActive={editor.isActive("orderedList")}
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </MenuButton>

                  <div className="w-px h-6 bg-gray-200 mx-1" />

                  <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo className="w-4 h-4" />
                  </MenuButton>
                  <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo className="w-4 h-4" />
                  </MenuButton>
                </div>
              )}

              {/* Editor */}
              <div
                className="min-h-[150px] [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror]:outline-none
                [&_.ProseMirror_p]:my-2 [&_.ProseMirror_p]:first:mt-0
                [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:my-3
                [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:my-2
                [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:my-2
                [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:my-2
                [&_.ProseMirror_li]:my-1
                [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:my-2
                [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono
                [&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline
                [&_.ProseMirror_.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none"
              >
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Attachments
            </label>
            <div className="border-2 border-dashed border-[#F1F5F9] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group hover:border-primary transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                <UploadCloud className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              <div className="text-center">
                <p className="text-[13px] italic font-bold text-mainText">
                  <span className="text-primary">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-[10px] text-body italic opacity-50">
                  PDF, DOC, XLS (max. 10MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center justify-center gap-4 border-t border-[#F1F5F9]">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-8 rounded-full border border-primary text-primary font-bold italic text-[15px] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 py-3 px-8 rounded-full bg-primary text-white font-bold italic text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
            Send Email
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SendEmailModal;
