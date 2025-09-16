import { useState, useRef } from "react";
import { FileText, Upload, Share2, Check, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDocuments } from "@/hooks/use-documents";
import { formatFileSize } from "@/lib/utils";

interface Document {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  document_type: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
}

function DocumentItem({ document, onDownload, onDelete }: { 
  document: Document; 
  onDownload: (doc: Document) => void;
  onDelete: (docId: string, storagePath: string) => void;
}) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "insurance":
        return "default";
      case "permit":
        return "secondary";
      case "certification":
        return "outline";
      case "contract":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleShare = () => {
    const subject = `Shared Document: ${document.file_name}`;
    const body = `I'm sharing the following document with you:

Document: ${document.file_name}
Type: ${document.document_type}
Size: ${formatFileSize(document.file_size)}
Uploaded: ${new Date(document.created_at).toLocaleDateString()}

IMPORTANT: Please manually attach the file "${document.file_name}" to this email before sending.

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
              <h3 className="font-medium text-sm truncate">{document.file_name}</h3>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(document.file_size)} • Uploaded {new Date(document.created_at).toLocaleDateString()}
              </p>
              <Badge 
                variant={getTypeColor(document.document_type) as any}
                className="text-xs mt-1"
              >
                {document.document_type}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDownload(document)}
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(document.id, document.storage_path)}
              className="hover:bg-muted min-h-[40px] min-w-[40px] text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
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
  const { documents, loading, uploadFiles, downloadDocument, deleteDocument } = useDocuments();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected files for upload:", files);
      await uploadFiles(files, filterType === "all" ? "other" : filterType);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    console.log("File select triggered");
    fileInputRef.current?.click();
  };

  const filteredFiles = documents.filter((document) => {
    const matchesSearch = document.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || document.document_type === filterType;
    return matchesSearch && matchesType;
  });

  const documentTypes = ["all", "insurance", "permit", "certification", "contract", "logo", "other"];

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
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
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

      {loading ? (
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <p className="text-sm text-muted-foreground">Loading documents...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredFiles.map((document) => (
            <DocumentItem 
              key={document.id} 
              document={document} 
              onDownload={downloadDocument}
              onDelete={deleteDocument}
            />
          ))}
        </div>
      )}

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