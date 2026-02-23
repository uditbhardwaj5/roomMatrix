import React from 'react';
import {useOutletContext} from "react-router";
import {CheckCircle2, ImageIcon, UploadIcon} from "lucide-react";
import {PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS} from "../../lib/constants";

interface UploadProps {
  onComplete: (base64: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const {isSignedIn} = useOutletContext<AuthContext>()

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current = null;
    };
  }, []);

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return;
    setFile(selectedFile);
    setProgress(0);

    const reader = new FileReader();
    reader.onerror = () => {
      setFile(null);
      setProgress(0);
    }
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            timeoutRef.current = setTimeout(() => {
              onComplete(base64);
              timeoutRef.current = null;
            }, REDIRECT_DELAY_MS);
            return 100;
          }
          return Math.min(prev + PROGRESS_STEP, 100);
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isSignedIn) return;
    
    const droppedFile = e.dataTransfer.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      processFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  return (
    <div className="upload">
      {!file? (
          <div 
            className={`dropzone ${isDragging ? 'is-dragging': ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="drop-input" 
              accept=".jpg,.png,.jpeg,.webp"
              disabled={!isSignedIn}
              onChange={handleChange}
            />
            <div className="drop-content">
              <div className="drop-icon">
                <UploadIcon size={20}/>
              </div>
              <p>
                {isSignedIn ? (
                    "Click to Upload"
                ) : (
                    "Sign in to upload"
                )}
              </p>
              <p className="help">Maximum upload size 50MB</p>
            </div>
          </div>
      ) : (
          <div className="upload-status">
            <div className="status-content">
              <div className="status-icon">
                {progress === 100 ? (
                    <CheckCircle2 className="check" />
                ) : (
                    <ImageIcon className="image" />
                )}
              </div>
              <h3>{file.name}</h3>
              <div className="progress">
                <div className="bar" style={{width: `${progress}%`}} />
                <p className="status-text">
                  {progress === 100 ? 'Redirecting' : `Analyzing Floor Plan ...`}
                </p>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default Upload;