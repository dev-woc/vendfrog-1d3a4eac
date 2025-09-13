import { useState, useRef } from "react";
import { FileText, Upload, Share2, Check, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  type: "insurance" | "permit" | "certification" | "tax" | "contract";
  shared: boolean;
  url?: string;
}

// Sample data for returning users only
const mockFiles: UploadedFile[] = [];

function DocumentItem({ file }: { file: UploadedFile }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "insurance":
        return "default";
      case "permit":
        return "secondary";
      case "certification":
        return "outline";
      case "tax":
        return "destructive";
      case "contract":
        return "default";
      default:
        return "secondary";
    }
  };

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
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm truncate">{file.name}</h3>
              <p className="text-xs text-muted-foreground">
                {file.size} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
              </p>
              <Badge 
                variant={getTypeColor(file.type) as any}
                className="text-xs mt-1"
              >
                {file.type}
              </Badge>
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
      </CardContent>
    </Card>
  );
}

interface AllDocumentsProps {
  showUpload?: boolean;
}

export function AllDocuments({ showUpload = true }: AllDocumentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log("Selected files:", files);
      // You can add file processing logic here
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const filteredFiles = mockFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const documentTypes = ["all", "insurance", "permit", "certification", "tax", "contract"];

  return (
    <div className="space-y-6">
      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload New Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={triggerFileSelect}
            >
              <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1 px-2">
                Insurance documents, permits, certifications (PDF, JPG, PNG)
              </p>
              <Button variant="outline" size="sm" className="mt-4 min-h-[44px]" onClick={triggerFileSelect}>
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-h-[44px]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[44px] min-w-[120px]"
        >
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold">
          All Documents ({filteredFiles.length})
        </h3>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {filteredFiles.map((file) => (
          <DocumentItem key={file.id} file={file} />
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No documents found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Upload your first document to get started."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}