import { Upload, FileText, Share2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  type: "insurance" | "permit" | "certification";
  shared: boolean;
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
];

function FileItem({ file }: { file: UploadedFile }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
      <div className="flex items-center space-x-3">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {file.size} • {new Date(file.uploadDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={file.type === "insurance" ? "default" : "secondary"}>
          {file.type}
        </Badge>
        {file.shared ? (
          <Badge variant="outline" className="text-success border-success">
            <Check className="h-3 w-3 mr-1" />
            Shared
          </Badge>
        ) : (
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function FileUpload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Document Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Drop files here or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">
            Insurance documents, permits, certifications (PDF, JPG, PNG)
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Documents</h4>
          {mockFiles.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </div>
        
        <Button className="w-full" variant="outline">
          View All Documents
        </Button>
      </CardContent>
    </Card>
  );
}