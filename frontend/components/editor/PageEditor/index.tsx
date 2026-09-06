"use client";

import { useState } from "react";
import type { ComponentName } from "@/types/page";
import { AddComponentModal } from "./AddComponentModal";
import { EditorCanvas } from "./EditorCanvas";
import { EditorTopbar } from "./EditorTopbar";
import { PropertiesPanel } from "./PropertiesPanel";
import type { AddMode } from "./types";
import { usePageEditorState } from "./usePageEditorState";
import "../editor.css";

// Owns the page editor state and coordinates the editor subcomponents.
export function PageEditor() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSectionPanelOpen, setSectionPanelOpen] = useState(false);
  const [addMode, setAddMode] = useState<AddMode>("root");
  const editorState = usePageEditorState();

  function openAddModal(mode: AddMode) {
    setAddMode(mode);
    setAddModalOpen(true);
  }

  function addComponentFromModal(componentName: ComponentName) {
    if (addMode === "child") {
      editorState.addChildComponent(componentName);
    } else {
      editorState.addRootComponent(componentName);
    }

    setAddModalOpen(false);
  }

  return (
    <div className="editor-shell">
      <EditorTopbar
        page={editorState.page}
        validationErrorCount={editorState.validation.errors.length}
        validationIsValid={editorState.validation.valid}
        onAddRoot={() => openAddModal("root")}
      />

      <main className="editor-workspace">
        <EditorCanvas
          canAddChild={editorState.canAddChild}
          isSectionPanelOpen={isSectionPanelOpen}
          page={editorState.page}
          selectedId={editorState.selectedId}
          onAddChild={() => openAddModal("child")}
          onAddRoot={() => openAddModal("root")}
          onCloseSectionPanel={() => setSectionPanelOpen(false)}
          onDeleteComponent={editorState.deleteComponent}
          onDuplicateComponent={editorState.duplicateSelectedComponent}
          onMoveComponentDown={(componentId) => editorState.moveSelectedComponent(componentId, "down")}
          onMoveComponentUp={(componentId) => editorState.moveSelectedComponent(componentId, "up")}
          onSelectComponent={editorState.setSelectedId}
          onToggleSectionPanel={() => setSectionPanelOpen((isOpen) => !isOpen)}
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
        mode={addMode}
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSelect={addComponentFromModal}
      />
    </div>
  );
}
