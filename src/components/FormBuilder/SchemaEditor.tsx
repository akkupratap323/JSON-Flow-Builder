import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateUISchema } from "@/utils/schema-utils";
import { JSONSchemaType, UISchemaType } from "@/types/json-schema";
import { toast } from "@/components/ui/use-toast";

interface SchemaEditorProps {
  initialSchema: JSONSchemaType;
  initialUISchema: UISchemaType;
  onChange: (schema: JSONSchemaType, uiSchema: UISchemaType) => void;
}

const SchemaEditor: React.FC<SchemaEditorProps> = ({
  initialSchema,
  initialUISchema,
  onChange
}) => {
  const [schemaText, setSchemaText] = useState<string>(
    JSON.stringify(initialSchema, null, 2)
  );
  
  const [uiSchemaText, setUISchemaText] = useState<string>(
    JSON.stringify(initialUISchema, null, 2)
  );
  
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("schema");
  
  const handleSchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchemaText(e.target.value);
    setError("");
  };
  
  const handleUISchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUISchemaText(e.target.value);
    setError("");
  };
  
  const generateUISchemaFromSchema = () => {
    try {
      const schema = JSON.parse(schemaText);
      const newUISchema = generateUISchema(schema);
      setUISchemaText(JSON.stringify(newUISchema, null, 2));
      setError("");
      onChange(schema, newUISchema);
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const applyChanges = () => {
    try {
      const schema = JSON.parse(schemaText);
      const uiSchema = JSON.parse(uiSchemaText);
      setError("");
      onChange(schema, uiSchema);
      toast({
        title: "Changes applied",
        description: "Your schema changes have been saved",
        className: "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  const loadTemplate = (type: "contact" | "signup" | "survey") => {
    setError("");
    
    if (type === "contact") {
      setSchemaText(JSON.stringify({
        type: "object",
        title: "Contact Form",
        properties: {
          name: {
            type: "string",
            title: "Full Name",
            minLength: 2
          },
          email: {
            type: "string",
            title: "Email Address",
            format: "email"
          },
          message: {
            type: "string",
            title: "Message",
            minLength: 10
          }
        },
        required: ["name", "email", "message"]
      }, null, 2));
      
      generateUISchemaFromSchema();
      toast({
        title: "Template loaded",
        description: "Contact form template has been applied",
        duration: 2000,
      });
    } else if (type === "signup") {
      setSchemaText(JSON.stringify({
        type: "object",
        title: "Sign Up Form",
        properties: {
          username: {
            type: "string",
            title: "Username",
            minLength: 3,
            pattern: "^[a-zA-Z0-9_]+$"
          },
          email: {
            type: "string",
            title: "Email Address",
            format: "email"
          },
          password: {
            type: "string",
            title: "Password",
            minLength: 8
          },
          confirmPassword: {
            type: "string",
            title: "Confirm Password"
          },
          terms: {
            type: "boolean",
            title: "I agree to the terms and conditions",
            default: false
          }
        },
        required: ["username", "email", "password", "confirmPassword", "terms"]
      }, null, 2));
      
      generateUISchemaFromSchema();
      toast({
        title: "Template loaded",
        description: "Sign up form template has been applied",
        duration: 2000,
      });
    } else if (type === "survey") {
      setSchemaText(JSON.stringify({
        type: "object",
        title: "Customer Survey",
        properties: {
          satisfaction: {
            type: "integer",
            title: "Overall Satisfaction",
            minimum: 1,
            maximum: 5
          },
          feedback: {
            type: "string",
            title: "Detailed Feedback",
            minLength: 10
          },
          improvements: {
            type: "string",
            title: "Suggested Improvements",
            minLength: 10
          },
          wouldRecommend: {
            type: "boolean",
            title: "Would you recommend us?",
            default: false
          },
          source: {
            type: "string",
            title: "How did you hear about us?",
            enum: ["Social Media", "Friend", "Advertisement", "Search Engine", "Other"],
            default: "Social Media"
          }
        }
      }, null, 2));
      
      generateUISchemaFromSchema();
      toast({
        title: "Template loaded",
        description: "Survey form template has been applied",
        duration: 2000,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          Form Schema Editor
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => loadTemplate("contact")}
            className="text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Contact Template
          </Button>
          <Button 
            variant="outline" 
            onClick={() => loadTemplate("signup")}
            className="text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Signup Template
          </Button>
          <Button 
            variant="outline" 
            onClick={() => loadTemplate("survey")}
            className="text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Survey Template
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="schema" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schema">JSON Schema</TabsTrigger>
          <TabsTrigger value="uiSchema">UI Schema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schema" className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full h-[400px] p-4 font-mono text-sm bg-white/70 dark:bg-gray-900/50 border border-blue-100/20 dark:border-blue-900/20 rounded-lg shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={schemaText}
              onChange={handleSchemaChange}
              spellCheck="false"
            />
            <div className="absolute top-2 right-2 text-xs text-gray-400">JSON Schema</div>
          </div>
          <div className="flex justify-between">
            <Button 
              onClick={generateUISchemaFromSchema}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
            >
              Generate UI Schema
            </Button>
            <Button 
              onClick={applyChanges}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              Apply Changes
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="uiSchema" className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full h-[400px] p-4 font-mono text-sm bg-white/70 dark:bg-gray-900/50 border border-blue-100/20 dark:border-blue-900/20 rounded-lg shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={uiSchemaText}
              onChange={handleUISchemaChange}
              spellCheck="false"
            />
            <div className="absolute top-2 right-2 text-xs text-gray-400">UI Schema</div>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={applyChanges}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              Apply Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <div className="bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800 animate-shake">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SchemaEditor;
