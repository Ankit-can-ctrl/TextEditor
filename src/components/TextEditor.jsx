import { useState } from "react";
import Draggable from "react-draggable";
import {
  Undo,
  Redo,
  Type,
  Bold,
  Italic,
  Underline,
  AlignCenter,
} from "lucide-react";

const FONT_STYLES = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier",
  "Verdana",
  "Georgia",
  "Palatino",
  "Garamond",
  "Bookman",
  "Comic Sans MS",
  "Trebuchet MS",
  "Arial Black",
  "Impact",
];

const TextEditor = () => {
  const [textBoxes, setTextBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addTextBox = () => {
    const newBox = {
      id: Date.now(),
      text: "New Text",
      x: 50,
      y: 50,
      fontSize: 16,
      fontFamily: "Arial",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      alignCenter: false,
    };
    const newTextBoxes = [...textBoxes, newBox];
    setTextBoxes(newTextBoxes);
    setSelectedBox(newBox.id);
    addToHistory(newTextBoxes);
  };

  const handleTextChange = (e) => {
    if (selectedBox !== null) {
      const newTextBoxes = textBoxes.map((box) =>
        box.id === selectedBox ? { ...box, text: e.target.value } : box
      );
      setTextBoxes(newTextBoxes);
    }
  };

  const toggleStyle = (style) => {
    if (selectedBox !== null) {
      const newTextBoxes = textBoxes.map((box) =>
        box.id === selectedBox ? { ...box, [style]: !box[style] } : box
      );
      setTextBoxes(newTextBoxes);
      addToHistory(newTextBoxes);
    }
  };

  const changeFontSize = (delta) => {
    if (selectedBox !== null) {
      const newTextBoxes = textBoxes.map((box) =>
        box.id === selectedBox
          ? {
              ...box,
              fontSize: Math.max(8, Math.min(72, box.fontSize + delta)),
            }
          : box
      );
      setTextBoxes(newTextBoxes);
      addToHistory(newTextBoxes);
    }
  };

  const changeFontFamily = (fontFamily) => {
    if (selectedBox !== null) {
      const newTextBoxes = textBoxes.map((box) =>
        box.id === selectedBox ? { ...box, fontFamily } : box
      );
      setTextBoxes(newTextBoxes);
      addToHistory(newTextBoxes);
    }
  };

  const toggleAlignCenter = () => {
    if (selectedBox !== null) {
      const newTextBoxes = textBoxes.map((box) =>
        box.id === selectedBox ? { ...box, alignCenter: !box.alignCenter } : box
      );
      setTextBoxes(newTextBoxes);
      addToHistory(newTextBoxes);
    }
  };

  const addToHistory = (newState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTextBoxes(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTextBoxes(history[historyIndex + 1]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={undo}
            className="p-2 bg-white rounded shadow"
            disabled={historyIndex <= 0}
          >
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            className="p-2 bg-white rounded shadow"
            disabled={historyIndex >= history.length - 1}
          >
            <Redo size={20} />
          </button>
        </div>

        {/* This is the canvas */}
        <div
          id="canvas"
          className="relative bg-white p-8 rounded-lg shadow-md mb-4 "
          style={{ width: "660px", height: "300px", border: "1px solid #ccc" }}
        >
          {textBoxes.map((box) => (
            <Draggable
              key={box.id}
              bounds="parent" // Restricts movement within the parent (canvas)
              defaultPosition={{ x: box.x, y: box.y }}
              onStop={(e, data) => {
                const newTextBoxes = textBoxes.map((tb) =>
                  tb.id === box.id ? { ...tb, x: data.x, y: data.y } : tb
                );
                setTextBoxes(newTextBoxes);
                addToHistory(newTextBoxes);
              }}
            >
              <div
                className={`absolute cursor-move ${
                  box.alignCenter ? "text-center" : ""
                }`}
                style={{
                  fontSize: `${box.fontSize}px`,
                  fontFamily: box.fontFamily,
                  fontWeight: box.isBold ? "bold" : "normal",
                  fontStyle: box.isItalic ? "italic" : "normal",
                  textDecoration: box.isUnderline ? "underline" : "none",
                }}
                onMouseDown={() => setSelectedBox(box.id)}
              >
                {box.text}
              </div>
            </Draggable>
          ))}
        </div>

        <div
          className="flex justify-between items-center bg-white p-2 rounded-lg shadow"
          style={{ zIndex: 10 }}
        >
          <input
            type="text"
            value={
              selectedBox !== null
                ? textBoxes.find((box) => box.id === selectedBox)?.text || ""
                : ""
            }
            onChange={handleTextChange}
            className="p-1 border rounded"
            disabled={selectedBox === null}
          />
          <select
            value={
              selectedBox !== null
                ? textBoxes.find((box) => box.id === selectedBox)?.fontFamily
                : ""
            }
            onChange={(e) => changeFontFamily(e.target.value)}
            className="p-1 border rounded"
            disabled={selectedBox === null}
          >
            {FONT_STYLES.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <button onClick={() => changeFontSize(-1)} className="p-1">
              -
            </button>
            <span>
              {selectedBox !== null
                ? textBoxes.find((box) => box.id === selectedBox)?.fontSize
                : "--"}
            </span>
            <button onClick={() => changeFontSize(1)} className="p-1">
              +
            </button>
          </div>
          <button
            onClick={() => toggleStyle("isBold")}
            className={`p-1 ${
              selectedBox !== null &&
              textBoxes.find((box) => box.id === selectedBox)?.isBold
                ? "bg-gray-200"
                : ""
            }`}
          >
            <Bold size={20} />
          </button>
          <button
            onClick={() => toggleStyle("isItalic")}
            className={`p-1 ${
              selectedBox !== null &&
              textBoxes.find((box) => box.id === selectedBox)?.isItalic
                ? "bg-gray-200"
                : ""
            }`}
          >
            <Italic size={20} />
          </button>
          <button
            onClick={() => toggleStyle("isUnderline")}
            className={`p-1 ${
              selectedBox !== null &&
              textBoxes.find((box) => box.id === selectedBox)?.isUnderline
                ? "bg-gray-200"
                : ""
            }`}
          >
            <Underline size={20} />
          </button>
          <button onClick={toggleAlignCenter} className="p-1">
            <AlignCenter size={20} />
          </button>
          <button
            onClick={addTextBox}
            className="p-2 bg-blue-500 text-white rounded"
          >
            <Type size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
