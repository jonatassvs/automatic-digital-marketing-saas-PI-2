"use client";

import { useState } from "react";
import type { ComponentName } from "@/types/page";
import { AddComponentModal } from "./AddComponentModal";
import { EditorCanvas } from "./EditorCanvas";
import { EditorTopbar } from "./EditorTopbar";
import { PropertiesPanel } from "./PropertiesPanel";
import type { AddTarget } from "./types";
import { usePageEditorState } from "./usePageEditorState";
import "../editor.scss";

// Owns the page editor state and coordinates the editor subcomponents.
export function PageEditor() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<AddTarget>({ kind: "root" });
  const editorState = usePageEditorState();

  function openAddModal(target: AddTarget) {
    setAddTarget(target);
    setAddModalOpen(true);
  }

  function addComponentFromModal(componentName: ComponentName) {
    if (addTarget.kind === "child") {
      editorState.addChildComponent(componentName, addTarget.parentId, addTarget.childIndex);
    } else {
      editorState.addRootComponent(componentName, addTarget.insertIndex);
    }

    setAddModalOpen(false);
  }

  return (
    <div className="editor-shell">
      <EditorTopbar
        page={editorState.page}
        validationErrorCount={editorState.validation.errors.length}
        validationIsValid={editorState.validation.valid}
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
