"use client";

import { useState } from "react";
import type { ComponentName, LandingPageDocument, PageComponent } from "@/types/page";
import { AddComponentModal } from "./AddComponentModal";
import { EditorCanvas } from "./EditorCanvas";
import { EditorTopbar } from "./EditorTopbar";
import { PropertiesPanel } from "./PropertiesPanel";
import type { AddTarget } from "./types";
import { usePageEditorState } from "./usePageEditorState";
import "../editor.scss";

export type PageEditorProps = {
  initialPage?: LandingPageDocument;
  onSave?: (page: LandingPageDocument) => Promise<void>;
  onTogglePublish?: () => Promise<void>;
  isSaving?: boolean;
  saveMessage?: string | null;
  isPublishing?: boolean;
  backHref?: string;
  previewHref?: string;
};

// Owns the page editor state and coordinates the editor subcomponents.
export function PageEditor({
  initialPage,
  onSave,
  onTogglePublish,
  isSaving,
  saveMessage,
  isPublishing,
  backHref,
  previewHref
}: PageEditorProps = {}) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<AddTarget>({ kind: "root" });
  const editorState = usePageEditorState(initialPage);

  function openAddModal(target: AddTarget) {
    setAddTarget(target);
    setAddModalOpen(true);
  }

  function addComponentFromModal(componentOrNode: ComponentName | PageComponent) {
    if (addTarget.kind === "child") {
      editorState.addChildComponent(componentOrNode, addTarget.parentId, addTarget.childIndex);
    } else {
      editorState.addRootComponent(componentOrNode, addTarget.insertIndex);
    }

    setAddModalOpen(false);
  }

  return (
    <div className="editor-shell">
      <EditorTopbar
        page={editorState.page}
        validationErrorCount={editorState.validation.errors.length}
        validationIsValid={editorState.validation.valid}
        onSave={() => onSave?.(editorState.page)}
        isSaving={isSaving}
        saveMessage={saveMessage}
        onTogglePublish={onTogglePublish}
        isPublishing={isPublishing}
        backHref={backHref}
        previewHref={previewHref}
      />

      <main className="editor-workspace">
        <EditorCanvas
          page={editorState.page}
          selectedId={editorState.selectedId}
          selectedComponent={editorState.selectedComponent}
          selectedSchema={editorState.selectedSchema}
          selectedSiblingPosition={editorState.selectedSiblingPosition}
          onAddChild={(parentId, childIndex) => openAddModal({ kind: "child", parentId, childIndex })}
          onAddRootAt={(insertIndex) => openAddModal({ insertIndex, kind: "root" })}
          onDeleteComponent={editorState.deleteComponent}
          onDuplicateComponent={editorState.duplicateSelectedComponent}
          onMoveComponentDown={(componentId) => editorState.moveSelectedComponent(componentId, "down")}
          onMoveComponentUp={(componentId) => editorState.moveSelectedComponent(componentId, "up")}
          onSelectComponent={editorState.setSelectedId}
          onUpdateComponentProp={editorState.updateComponentProp}
        />

        <PropertiesPanel
          page={editorState.page}
          selectedComponent={editorState.selectedComponent}
          selectedSchema={editorState.selectedSchema}
          validation={editorState.validation}
          onDeleteSelected={editorState.deleteSelectedComponent}
          onPageChange={editorState.setPage}
          onUpdateSelectedProp={editorState.updateSelectedProp}
        />
      </main>

      <AddComponentModal
        canAddChild={editorState.canAddChild}
        target={addTarget}
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSelect={addComponentFromModal}
      />
    </div>
  );
}
