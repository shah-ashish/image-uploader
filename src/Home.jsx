import React, { useState, useRef, useCallback } from "react";

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState({ type: "idle", message: "", data: null });

  const dropRef = useRef(null);
  const url = import.meta.env.VITE_BACKEND_URL
  const validateImage = (f) => f && f.type.startsWith("image/");

  const handleFile = useCallback((f) => {
    if (!f) return;

    if (!validateImage(f)) {
      setStatus({ type: "error", message: "Unsupported file type. Use an image." });
      return;
    }

    setStatus({ type: "idle", message: "", data: null });
    setFile(f);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }, []);

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const f = e.dataTransfer.files?.[0];
    if (f) return handleFile(f);

    // handle blob images (screenshots)
    const items = e.dataTransfer.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
          handleFile(item.getAsFile());
          return;
        }
      }
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onPaste = async (e) => {
    const items = e.clipboardData.items;

    // FILES in clipboard
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        handleFile(items[i].getAsFile());
        return;
      }
    }

    // TEXT → maybe URL or base64
    const text = e.clipboardData.getData("text/plain");
    if (!text) {
      setStatus({ type: "error", message: "No image detected in clipboard." });
      return;
    }

    // base64
    if (text.startsWith("data:image")) {
      try {
        const blob = await (await fetch(text)).blob();
        handleFile(new File([blob], "pasted-image.png", { type: blob.type }));
        return;
      } catch {
        setStatus({ type: "error", message: "Invalid pasted data URL." });
        return;
      }
    }

    // remote image
    if (/^https?:\/\/.+\.(png|jpe?g|gif|webp|bmp)/i.test(text)) {
      try {
        const res = await fetch(text);
        const blob = await res.blob();
        const name = text.split("/").pop().split("?")[0];
        handleFile(new File([blob], name, { type: blob.type }));
        return;
      } catch {
        setStatus({ type: "error", message: "Failed to fetch pasted image URL." });
        return;
      }
    }

    setStatus({ type: "error", message: "Clipboard content is not an image." });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Uploading...", data: null });

    if (!file) {
      return setStatus({
        type: "error",
        message: "Please choose an image before submitting.",
      });
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (!data.success) {
        return setStatus({
          type: "error",
          message: data.message || "Upload failed.",
        });
      }

      setStatus({
        type: "success",
        message: data.data.url,
        data,
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Upload failed. Server error.",
      });
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setStatus({ type: "idle", message: "", data: null });

    if (dropRef.current) dropRef.current.focus();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gradient-to-br from-white via-slate-50 to-white/80 rounded-2xl"
    
    
    
    >
      <h3 className="text-2xl font-semibold mb-2">Upload an image</h3>
      <p className="text-sm text-slate-500 mb-4">
        Drop, paste, or select an image. Supports PNG, JPG, GIF, WebP, BMP.
      </p>

      <form onSubmit={onSubmit}>
        <label
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaste={onPaste}
          tabIndex={0}
          className="group relative flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-xl hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gradient-to-b from-white to-slate-50"
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-48 h-48 object-contain rounded-md shadow" />
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="material-icons text-4xl mb-2">image</span>
              <div className="text-sm text-slate-600">Drag, paste, or</div>
              <div className="text-sm font-medium text-indigo-600">choose a file</div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={onInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="w-full flex items-center justify-between mt-2">
            <div className="text-xs text-slate-500">Paste (Ctrl+V) an image</div>
            <button
              type="button"
              onClick={() => dropRef.current?.focus()}
              className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Focus
            </button>
          </div>
        </label>

        <div className="flex items-center gap-3 mt-4">
          <button
            type="submit"
            disabled={status.type === "loading"}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700"
          >
            <span className="material-symbols-outlined">cloud_upload</span>
            {status.type === "loading" ? "Uploading..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={clearFile}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-slate-700 hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">clear</span>
            Clear
          </button>

          {file && (
            <div className="ml-auto text-xs text-slate-600">
              Selected: <span className="font-medium">{file.name}</span>
            </div>
          )}
        </div>
      </form>

      {/* STATUS MESSAGES */}
      <div className="mt-4">
       {status.type === "success" && (
  <div className="rounded-md bg-green-50 border border-green-200 p-3 text-green-800">
    <p className="font-semibold mb-2">Uploaded Successfully!</p>

    {/* URL box with copy button */}
    <div className="flex  sm:flex-row sm:items-center sm:justify-between gap-2 bg-white border rounded-md p-2">
      <a
        href={status.data.data.url}
        target="_blank"
        className="text-indigo-600 underline break-all text-sm flex-1"
      >
        {status.data.data.url}
      </a>

{/*   onClick={() => {
          navigator.clipboard.writeText(status.data.data.url);
        }} */}

    <div className="w-6 h-6 rounded cursor-pointer  flex justify-center items-center bg-green-600 ">
   <span className="material-symbols-outlined text-white "style={{fontSize:'18px'}} >
    content_copy
   </span>
    </div>


    </div>
  </div>
)}


        {status.type === "error" && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-800">
            {status.message}
          </div>
        )}

        {status.type === "idle" && !file && (
          <div className="text-xs text-slate-400 mt-2">No image selected.</div>
        )}
      </div>
    </div>
  );
}
