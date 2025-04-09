import React from "react";
import { useModal } from "../context/ModalContext";

export const GlobalModal: React.FC = () => {
  const { isOpen, nodeData, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 999999,
        width: "400px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        padding: "20px",
        color: "#000000",
      }}
    >
      <button
        onClick={closeModal}
        style={{
          border: "none",
          background: "#000000",
          color: "#ffffff",
          padding: "4px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
        }}
      >
        Close
      </button>
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#000000" }}>
          Node Details
        </h2>
      </div>
      {nodeData && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span style={{ fontWeight: "500", color: "#000000" }}>Type:</span>
            <span style={{ color: "#000000" }}>{nodeData.type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span style={{ fontWeight: "500", color: "#000000" }}>Label:</span>
            <span style={{ color: "#000000" }}>{nodeData.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span style={{ fontWeight: "500", color: "#000000" }}>ID:</span>
            <span style={{ color: "#000000" }}>{nodeData.id}</span>
          </div>
        </div>
      )}
    </div>
  );
};
