import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { DiagramUseCaseSpecificationService } from "../../../backend/services/DiagramUseCaseSpecificationService";

export type FlowType = "NORMAL" | "ALTERNATIVE" | "EXCEPTION";

interface FlowStep {
  id: string;
  description: string;
}

interface SequenceFlow {
  id: string;
  type: FlowType;
  name: string;
  entry_point?: string;
  exit_point?: string;
  steps: FlowStep[];
}

interface SpecificationsData {
  preconditions: string[];
  postconditions: string[];
  flows: SequenceFlow[];
}

interface UseCaseSpecificationsProps {
  specifications: SpecificationsData;
  onChange: (changes: Partial<SpecificationsData>) => void;
  useCaseId: string;
  onSave?: () => void;
}

const TEST_MODE = false; // Set to true to use static Gemini text for testing
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("Test mode " + TEST_MODE.toString());

export const UseCaseSpecifications: React.FC<UseCaseSpecificationsProps> = ({
  specifications,
  onChange,
  useCaseId,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<"PREPOST" | string>("PREPOST");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [diagramImage, setDiagramImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddFlow = (type: FlowType) => {
    const newFlow: SequenceFlow = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      name: type === "ALTERNATIVE" ? "Alternative flow" : "Exception flow",
      entry_point: "",
      exit_point: "",
      steps: [{ id: `step-1`, description: "" }],
    };
    onChange({ flows: [...specifications.flows, newFlow] });
    setActiveTab(newFlow.id);
  };

  const handleAddStep = (flowId: string) => {
    onChange({
      flows: specifications.flows.map((flow) =>
        flow.id === flowId
          ? {
              ...flow,
              steps: [
                ...flow.steps,
                { id: `step-${flow.steps.length + 1}`, description: "" },
              ],
            }
          : flow
      ),
    });
  };

  const generateSequenceImage = async () => {
    console.log("[generateSequenceImage] Start");
    setLoading(true);
    setDiagramImage(null);

    // 1. Get the steps for the active flow
    const activeFlow = specifications.flows.find((f) => f.id === activeTab);
    if (!activeFlow) {
      toast.error("No active flow selected.");
      setLoading(false);
      console.log("[generateSequenceImage] No active flow selected.");
      return;
    }
    const stepsText = activeFlow.steps
      .map((step) => step.description)
      .join("\n")
      .trim();
    console.log("[generateSequenceImage] Extracted stepsText:", stepsText);
    if (!stepsText) {
      toast.error("No steps to generate.");
      setLoading(false);
      console.log("[generateSequenceImage] No steps to generate.");
      return;
    }

    // 2. Build the Gemini prompt
    const geminiPrompt = `
Transform the following plain English use case steps into a structured flow in this exact format:
Primary Actors: ActorName <<stereotype>>  
Secondary Actors: ActorName <<stereotype>>  

Alternate Flow: NameOfAlternateFlow  
sender -> receiver: actions/message  
...  
else NameOfAlternateFlow  
sender -> receiver: actions/message  
...  
end  

Main Flow:  
sender -> receiver: actions/message  
...  
loop LoopName  
end  
sender -> receiver: actions/message  
...  
startconcurrency  
sender -> receiver: actions/message  
...  
endconcurrency

[Additional info, implement MVC (Model-View-Controller) architecture. Stereotypes are: actor, boundary, controller, entity.
The MVC architecture consists of three components:
- View layer corresponds to the presentation components that users interact with directly.
- Controller layer handles user requests, processes input, and coordinates between View and Model.
- Model layer manages application data, business logic, and data persistence.
Controllers should be named based on their functionality (e.g., UserController).
Models should represent domain objects and data structures (e.g., UserModel).
Views should represent UI components (e.g., UserProfileView).
Make sure each function is named like functionName() and includes appropriate parameters.
For actor use naming Actor, for model/entity use naming AbcModel, and make sure there is no duplicate between any model or actor]

Example:
Input:
Manager clicks uploadMaterialsButton at UploadMaterialsPageView.  
Manager require UploadMaterial at UploadMaterialsPageView.  
UploadMaterialsPageView shows materialsForm at 
UploadMaterialsPageView.  
Manager fills fillForm at UploadMaterialsPageView.  
Manager uploads uploadMaterials at UploadMaterialsPageView.  
UploadMaterialsPageView validates UploadForm at 
UploadMaterialsController.  
UploadMaterialsController sends MaterialContent at MaterialModel. 
UploadMaterialsController shows successMessage at 
UploadMaterialsPageView. 
If the uploadForm is fails, UploadMaterialsController shows an 
errorMessage at UploadMaterialsPageView. 

Output:
Primary Actor: Manager<<Actor>> 
Secondary Actor: UploadMaterialsPage<<boundary>>, 
UploadMaterialsController<<controller>>, Material<<entity>> 
Main Flow: 
Manager-> UploadMaterialsPage: Click uploadMaterialsButton() 
Manager-> UploadMaterialsPage: requestsUploadMaterials() 
UploadMaterialsPage->UploadMaterialsPage:  displayUploadMaterialsForm() 
Manager-> UploadMaterialsPage: fillForm() 
Manager-> UploadMaterialsPage: uploadMaterials() 
UploadMaterialsPage-> UploadMaterialsController:  validatesUploadForm() 
 
Alternate Flow: validatesUploadMaterialsForm()==true 
  UploadMaterialsController->Material: uploadMaterials() 
  UploadMaterialsController->UploadMaterialsPage: displaySuccess() 
else validatesUploadMaterialsForm()==false 
  UploadMaterialsController-> UploadMaterialsPage: 
  displayError() 
end 

Now convert this input:
${stepsText}
`;

    // 3. Call Gemini API using fetch or use static text in test mode
    let geminiText = "";
    if (TEST_MODE) {
      geminiText = `Primary Actor: ProjectManager<<actor>>\nSecondary Actor: CreateTeamView<<boundary>>, TeamController<<controller>>, TeamModel<<entity>>\n\nAlternate Flow: Invalid Team Input\n  CreateTeamView -> TeamController: validatesTeamName()\n  else Invalid Team Input\n    TeamController -> CreateTeamView: displayErrorMessage()\n  end\n\nMain Flow:\n  ProjectManager -> CreateTeamView: fillInTeamName()\n  ProjectManager -> CreateTeamView: clickCreateTeamButton()\n  CreateTeamView -> TeamController: validatesTeamName()\n  TeamController -> TeamModel: createTeam()\n  TeamModel -> TeamController: passCreatedTeamData()\n  TeamController -> CreateTeamView: sendCreatedTeamData()\n  CreateTeamView -> ProjectManager: showCreatedTeamData()`;
      console.log(
        "[generateSequenceImage] Using static Gemini text for testing:",
        geminiText
      );
    } else {
      try {
        console.log("[generateSequenceImage] Calling Gemini API...");
        const geminiResponse = await fetch("/api/gemini/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            geminiPrompt:
              geminiPrompt
          }),
        });

        const geminiData = await geminiResponse.json();
        console.log("Gemini response:", geminiData);

        geminiText =
          geminiData.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log("[generateSequenceImage] Gemini API response:", geminiText);
      } catch (err) {
        toast.error("Failed to get response from Gemini API");
        setLoading(false);
        // console.error("[generateSequenceImage] Gemini API error:", err);
        return;
      }
    }

    // 3.5. Clean Gemini output
    const cleanedText = geminiText
      .replace(/^```[a-zA-Z]*\n?/, "") // Remove opening backticks
      .replace(/```\s*$/gm, "") // Remove closing backticks anywhere with trailing whitespace
      .trim(); // Final trim

    console.log("[generateSequenceImage] Cleaned Gemini text:", cleanedText);

    // 4. Call your local diagram API using fetch
    try {
      console.log("[generateSequenceImage] Calling diagram API...");
      const diagramResponse = await fetch(
        "https://sagile-sequence-generator.vercel.app/api/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: cleanedText }),
        }
      );
      const arrayBuffer = await diagramResponse.arrayBuffer();
      const base64Image = `data:image/png;base64,${btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      )}`;
      setDiagramImage(base64Image);
      console.log("[generateSequenceImage] Diagram image set.");
    } catch (error) {
      toast.error("Failed to generate diagram image");
      console.error("[generateSequenceImage] Diagram API error:", error);
    }
    setLoading(false);
    console.log("[generateSequenceImage] End");
  };

  const handleStepChange = (flowId: string, stepIdx: number, value: string) => {
    onChange({
      flows: specifications.flows.map((flow) =>
        flow.id === flowId
          ? {
              ...flow,
              steps: flow.steps.map((step, idx) =>
                idx === stepIdx ? { ...step, description: value } : step
              ),
            }
          : flow
      ),
    });
  };

  const handleRemoveStep = (flowId: string, stepIdx: number) => {
    onChange({
      flows: specifications.flows.map((flow) =>
        flow.id === flowId
          ? { ...flow, steps: flow.steps.filter((_, idx) => idx !== stepIdx) }
          : flow
      ),
    });
  };

  return (
    <div style={{ padding: "24px 32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              border: "none",
              background: activeTab === "PREPOST" ? "#2563eb" : "#f3f4f6",
              color: activeTab === "PREPOST" ? "#fff" : "#222",
              padding: "8px 20px",
              borderRadius: 999,
              marginRight: 10,
              fontWeight: 500,
              fontSize: 15,
              boxShadow:
                activeTab === "PREPOST" ? "0 2px 8px #2563eb22" : "none",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
            onClick={() => setActiveTab("PREPOST")}
          >
            Pre&Post condition
          </button>
          {specifications.flows.map((flow) => (
            <button
              key={flow.id}
              style={{
                border: "none",
                background: activeTab === flow.id ? "#2563eb" : "#f3f4f6",
                color: activeTab === flow.id ? "#fff" : "#222",
                padding: "8px 20px",
                borderRadius: 999,
                marginRight: 10,
                fontWeight: 500,
                fontSize: 15,
                boxShadow:
                  activeTab === flow.id ? "0 2px 8px #2563eb22" : "none",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
              onClick={() => setActiveTab(flow.id)}
            >
              Use Case Specification
            </button>
          ))}
          {/* <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              style={{
                border: 'none',
                background: '#f3f4f6',
                color: '#2563eb',
                padding: '8px 16px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 20,
                marginLeft: 2,
                cursor: 'pointer',
                boxShadow: '0 1px 4px #2563eb11',
                transition: 'background 0.2s, color 0.2s'
              }}
              onClick={() => setShowDropdown(d => !d)}
              title="Add flow"
            >
              +
            </button>
            {showDropdown && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                background: 'white', 
                border: '1px solid #d1d5db', 
                borderRadius: 8, 
                zIndex: 1000, 
                minWidth: 160, 
                boxShadow: '0 2px 8px #0001',
                marginTop: 4
              }}>
                <div 
                  style={{ 
                    padding: 12, 
                    cursor: 'pointer', 
                    fontSize: 15, 
                    color: '#2563eb', 
                    fontWeight: 500
                  }} 
                  onClick={() => { handleAddFlow('ALTERNATIVE'); setShowDropdown(false); }}
                >
                  Alternative Flow
                </div>
                <div 
                  style={{ 
                    padding: 12, 
                    cursor: 'pointer', 
                    fontSize: 15, 
                    color: '#ef4444', 
                    fontWeight: 500
                  }} 
                  onClick={() => { handleAddFlow('EXCEPTION'); setShowDropdown(false); }}
                >
                  Exception Flow
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "PREPOST" && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                fontWeight: 600,
                marginBottom: 10,
                display: "block",
                fontSize: 16,
              }}
            >
              Preconditions
            </label>
            {specifications.preconditions.map((cond, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <input
                  type="text"
                  value={cond}
                  onChange={(e) =>
                    onChange({
                      preconditions: specifications.preconditions.map((c, i) =>
                        i === idx ? e.target.value : c
                      ),
                    })
                  }
                  style={{
                    flex: 1,
                    marginRight: 8,
                    background: "#fff",
                    color: "#222",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    padding: "8px 12px",
                    fontSize: 15,
                  }}
                  placeholder={`Precondition ${idx + 1}`}
                />
                <button
                  onClick={() =>
                    onChange({
                      preconditions: specifications.preconditions.filter(
                        (_, i) => i !== idx
                      ),
                    })
                  }
                  style={{
                    color: "#ef4444",
                    border: "none",
                    background: "none",
                    fontSize: 22,
                    cursor: "pointer",
                    marginLeft: 2,
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                onChange({
                  preconditions: [...specifications.preconditions, ""],
                })
              }
              style={{
                marginTop: 8,
                fontSize: 15,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 4px #2563eb22",
                transition: "background 0.2s, color 0.2s",
                marginBottom: 8,
              }}
            >
              + Add precondition
            </button>
          </div>
          <div>
            <label
              style={{
                fontWeight: 600,
                marginBottom: 10,
                display: "block",
                fontSize: 16,
              }}
            >
              Postconditions
            </label>
            {specifications.postconditions.map((cond, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <input
                  type="text"
                  value={cond}
                  onChange={(e) =>
                    onChange({
                      postconditions: specifications.postconditions.map(
                        (c, i) => (i === idx ? e.target.value : c)
                      ),
                    })
                  }
                  style={{
                    flex: 1,
                    marginRight: 8,
                    background: "#fff",
                    color: "#222",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    padding: "8px 12px",
                    fontSize: 15,
                  }}
                  placeholder={`Postcondition ${idx + 1}`}
                />
                <button
                  onClick={() =>
                    onChange({
                      postconditions: specifications.postconditions.filter(
                        (_, i) => i !== idx
                      ),
                    })
                  }
                  style={{
                    color: "#ef4444",
                    border: "none",
                    background: "none",
                    fontSize: 22,
                    cursor: "pointer",
                    marginLeft: 2,
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                onChange({
                  postconditions: [...specifications.postconditions, ""],
                })
              }
              style={{
                marginTop: 8,
                fontSize: 15,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 4px #2563eb22",
                transition: "background 0.2s, color 0.2s",
                marginBottom: 8,
              }}
            >
              + Add postcondition
            </button>
          </div>
        </div>
      )}

      {activeTab !== "PREPOST" && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 0 }}>
            <label
              style={{
                fontWeight: 600,
                marginBottom: 10,
                display: "block",
                fontSize: 16,
              }}
            >
              Sequence Steps
            </label>
            {specifications.flows
              .find((f) => f.id === activeTab)
              ?.steps.map((step, idx) => (
                <div
                  key={step.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 0,
                  }}
                >
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(activeTab, idx, e.target.value)
                    }
                    style={{
                      flex: 1,
                      marginRight: 8,
                      background: "#fff",
                      color: "#222",
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: 15,
                    }}
                    placeholder={`Step ${idx + 1}`}
                  />
                  <button
                    onClick={() => handleRemoveStep(activeTab, idx)}
                    style={{
                      color: "#ef4444",
                      border: "none",
                      background: "none",
                      fontSize: 22,
                      cursor: "pointer",
                      marginLeft: 2,
                    }}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            <button
              onClick={() => handleAddStep(activeTab)}
              style={{
                marginTop: 8,
                fontSize: 15,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 4px #2563eb22",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              + Add step
            </button>
            <button
              onClick={generateSequenceImage}
              style={{
                marginTop: 8,
                marginLeft: 8,
                fontSize: 15,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 1px 4px #2563eb22",
                transition: "background 0.2s, color 0.2s",
              }}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Sequence Image"}
            </button>
          </div>
          {loading && <div>Generating diagram...</div>}
          {diagramImage && (
            <div style={{ marginTop: 16 }}>
              <img
                src={diagramImage}
                alt="Generated Sequence Diagram"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/*
Additional info, implement three tiered layered architecture heuristic. Stereotypes are : actor, boundary, controller, entity.
There are three layers in the layered architecture: presentation map with the boundary, business map with the controller, data layer map with entity.
Data layer will store all the data related to the function and the business layer will be named functionName+Handler
Business layer will be based on the functionality and the data layer will be based on the data model.
Make sure each function are named like functionName() and need to has parameter
*/
