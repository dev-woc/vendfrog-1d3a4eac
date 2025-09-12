import { useState } from "react";
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

const mockFiles: UploadedFile[] = [
  {
    id: "1",
    name: "vendor-insurance-2024.pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-10",
    type: "insurance",
    shared: true,
  },
  {
    id: "2",
    name: "business-permit.pdf",
    size: "1.1 MB",
    uploadDate: "2024-01-08",
    type: "permit",
    shared: false,
  },
  {
    id: "3",
    name: "food-handler-cert.pdf",
    size: "875 KB",
    uploadDate: "2024-01-05",
    type: "certification",
    shared: true,
  },
  {
    id: "4",
    name: "tax-registration.pdf",
    size: "1.5 MB",
    uploadDate: "2024-01-03",
    type: "tax",
    shared: false,
  },
  {
    id: "5",
    name: "market-contract-2024.pdf",
    size: "3.2 MB",
    uploadDate: "2024-01-01",
    type: "contract",
    shared: true,
  },
  {
    id: "6",
    name: "liability-insurance.pdf",
    size: "2.8 MB",
    uploadDate: "2023-12-28",
    type: "insurance",
    shared: true,
  },
];

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

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <FileText className="h-10 w-10 text-muted-foreground mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-sm">{file.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {file.size} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant={getTypeColor(file.type)}>
                  {file.type}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                const subject = `Shared Document: ${file.name}`;
                const body = `I'm sharing the following document with you:\n\nDocument: ${file.name}\nType: ${file.type}\nSize: ${file.size}\nUploaded: ${new Date(file.uploadDate).toLocaleDateString()}\n\nPlease note: You'll need to attach the document separately to this email.`;
                window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
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
            <div className="border-2 border-dashed rounded-lg p-6 text-center border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                Insurance documents, permits, certifications (PDF, JPG, PNG)
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Browse Files
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          All Documents ({filteredFiles.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {filteredFiles.map((file) => (
          <DocumentItem key={file.id} file={file} />
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground">
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