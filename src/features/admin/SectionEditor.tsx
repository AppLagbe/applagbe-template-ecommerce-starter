"use client";

import React, { useState, useTransition } from "react";
import {
  reorderSection,
  toggleSectionVisibility,
  saveSectionDraft,
  publishAllSections,
} from "./section-actions";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit3,
  Check,
  Send,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface SectionConfigItem {
  id: string;
  sectionKey: string;
  title?: string | null;
  isEnabled: boolean;
  sortOrder: number;
  publishedContent: string;
  draftContent: string;
  hasUnpublishedChanges: boolean;
}

interface SectionEditorProps {
  sections: SectionConfigItem[];
}

export function SectionEditor({ sections }: SectionEditorProps) {
  const [editingSection, setEditingSection] = useState<SectionConfigItem | null>(null);
  const [draftJsonText, setDraftJsonText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasAnyUnpublished = sections.some((s) => s.hasUnpublishedChanges);

  const handleMove = (id: string, dir: "up" | "down") => {
    startTransition(async () => {
      await reorderSection(id, dir);
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleSectionVisibility(id, !current);
    });
  };

  const openEditor = (sec: SectionConfigItem) => {
    setEditingSection(sec);
    const contentToEdit = sec.draftContent || sec.publishedContent || "{}";
    try {
      // Pretty-print JSON
      const parsed = JSON.parse(contentToEdit);
      setDraftJsonText(JSON.stringify(parsed, null, 2));
    } catch {
      setDraftJsonText(contentToEdit);
    }
    setErrorMessage(null);
  };

  const handleSaveDraft = () => {
    if (!editingSection) return;
    setErrorMessage(null);

    startTransition(async () => {
      const res = await saveSectionDraft(editingSection.id, draftJsonText);
      if (res.success) {
        setEditingSection(null);
      } else {
        setErrorMessage(res.error || "Failed to save draft");
      }
    });
  };

  const handlePublishAll = () => {
    startTransition(async () => {
      await publishAllSections();
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Modular Landing Sections
            </h3>
            <p className="text-xs text-slate-500">
              Drag or move sections to optimize mobile conversion rates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/preview"
            target="_blank"
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Draft</span>
          </Link>

          <button
            type="button"
            disabled={isPending || !hasAnyUnpublished}
            onClick={handlePublishAll}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 ${
              hasAnyUnpublished
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {hasAnyUnpublished ? "Publish All Changes Live" : "All Changes Published"}
            </span>
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
              !sec.isEnabled ? "bg-slate-50 opacity-60" : "hover:bg-slate-50/50"
            }`}
          >
            {/* Title & Badge */}
            <div className="flex items-center gap-3.5">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {sec.title || sec.sectionKey}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400">
                    ({sec.sectionKey})
                  </span>
                  {sec.hasUnpublishedChanges && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                      Unpublished Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Status: {sec.isEnabled ? "Active & Visible" : "Hidden from customers"}
                </p>
              </div>
            </div>

            {/* Reorder and Edit Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Move Up */}
              <button
                type="button"
                disabled={isPending || idx === 0}
                onClick={() => handleMove(sec.id, "up")}
                title="Move Section Up"
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              {/* Move Down */}
              <button
                type="button"
                disabled={isPending || idx === sections.length - 1}
                onClick={() => handleMove(sec.id, "down")}
                title="Move Section Down"
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              {/* Toggle Visibility */}
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggle(sec.id, sec.isEnabled)}
                title={sec.isEnabled ? "Hide Section" : "Show Section"}
                className={`p-2 rounded-lg border transition ${
                  sec.isEnabled
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                {sec.isEnabled ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>

              {/* Edit Content */}
              <button
                type="button"
                onClick={() => openEditor(sec)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Content</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Content Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Editing Section Content (Draft)
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {editingSection.title} ({editingSection.sectionKey})
                </h3>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Section Props & Copy (JSON Format)
              </label>
              <p className="text-[11px] text-slate-500">
                You can customize headlines, subheadlines, button labels, and items. Saving as draft allows you to preview before publishing.
              </p>
              <textarea
                value={draftJsonText}
                onChange={(e) => setDraftJsonText(e.target.value)}
                rows={12}
                className="w-full flex-1 p-3.5 font-mono text-xs rounded-xl border border-slate-300 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleSaveDraft}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Section Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
