import { useState, useRef } from "react";
import { Upload, FileText, Share2, Check, FolderOpen, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  type: "insurance" | "permit" | "certification";
  shared: boolean;
}

// Empty array for new users - no pre-populated files
const mockFiles: UploadedFile[] = [];

function FileItem({ file }: { file: UploadedFile }) {
  const handleDownload = () => {
    // Create a dummy file for download demonstration
    const content = `Document: ${file.name}\nType: ${file.type}\nSize: ${file.size}\nUploaded: ${new Date(file.uploadDate).toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const subject = `Shared Document: ${file.name}`;
    const body = `I'm sharing the following document with you:

Document: ${file.name}
Type: ${file.type}
Size: ${file.size}
Uploaded: ${new Date(file.uploadDate).toLocaleDateString()}

IMPORTANT: Please manually attach the file "${file.name}" to this email before sending.

You can download the file and attach it to share with others.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg bg-muted/20 gap-3">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {file.size} • {new Date(file.uploadDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDownload}
          className="hover:bg-muted min-h-[40px] min-w-[40px]"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleShare}
          className="hover:bg-muted min-h-[40px] min-w-[40px]"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    // Here you would typically upload the files
    console.log("Files to upload:", Array.from(files));
    // For now, just show an alert
    alert(`Selected ${files.length} file(s) for upload`);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          File Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors cursor-pointer ${
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleChange}
            className="hidden"
          />
          <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Upload & Organize Your Business Files</p>
          <p className="text-xs text-muted-foreground mt-1 px-2 leading-relaxed">
            Save and upload logos for organizers, insurance documents, permits, 
            certifications, and contracts all in one place for easy access when 
            organizers need them.
          </p>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onButtonClick(); }} className="min-h-[44px]">
              <FolderOpen className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>
        </div>
        
        {mockFiles.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Files</h4>
            {mockFiles.map((file) => (
              <FileItem key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No files uploaded yet</p>
            <p className="text-xs">Upload your first file to get started</p>
          </div>
        )}
        
        <Button className="w-full min-h-[44px]" variant="outline" asChild>
          <Link to="/documents">Manage All Files</Link>
        </Button>
      </CardContent>
    </Card>
  );
}