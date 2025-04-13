import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { JSONSchemaType, UISchemaType, FormData } from "@/types/json-schema";
import { generateUISchema } from "@/utils/schema-utils";
import SchemaEditor from "./SchemaEditor";
import FormRenderer from "./FormRenderer";

const FormBuilder: React.FC = () => {
  const [schema, setSchema] = useState<JSONSchemaType>({
    type: "object",
    title: "Registration Form",
    properties: {
      firstName: {
        type: "string", 
        title: "First Name",
        minLength: 2
      },
      lastName: {
        type: "string", 
        title: "Last Name",
        minLength: 2
      },
      email: {
        type: "string", 
        title: "Email",
        format: "email"
      },
      age: {
        type: "integer", 
        title: "Age",
        minimum: 18,
        maximum: 100
      },
      subscribe: {
        type: "boolean", 
        title: "Subscribe to newsletter",
        default: false
      }
    },
    required: ["firstName", "lastName", "email"]
  });
  
  const [uiSchema, setUISchema] = useState<UISchemaType>(
    generateUISchema(schema)
  );
  
  const [formData, setFormData] = useState<FormData>({});
  const [activeTab, setActiveTab] = useState<string>("edit");
  
  const handleSchemaChange = (newSchema: JSONSchemaType, newUISchema: UISchemaType) => {
    setSchema(newSchema);
    setUISchema(newUISchema);
  };
  
  const handleFormChange = (data: FormData) => {
    setFormData(data);
  };
  
  const handleSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // In a real app, you might send this data to an API
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 mb-4">
          JSON Flow Builder
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Build dynamic forms using JSON Schema. Define your form structure, customize the UI, and see changes in real-time.
        </p>
      </div>
      
      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="edit" className="text-sm sm:text-base">Edit Schema</TabsTrigger>
          <TabsTrigger value="preview" className="text-sm sm:text-base">Preview Form</TabsTrigger>
        </TabsList>
        
        <Card className="border-blue-100/20 dark:border-blue-900/20 shadow-lg backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <TabsContent value="edit" className="mt-0 space-y-4">
              <SchemaEditor 
                initialSchema={schema}
                initialUISchema={uiSchema}
                onChange={handleSchemaChange}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                    {schema.title || "Form Preview"}
                  </h2>
                </div>
                
                <Separator className="bg-blue-100/20 dark:bg-blue-900/20" />
                
                <FormRenderer 
                  schema={schema}
                  uiSchema={uiSchema}
                  initialData={formData}
                  onChange={handleFormChange}
                  onSubmit={handleSubmit}
                />
                
                <Separator className="bg-blue-100/20 dark:bg-blue-900/20" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Form Data:</h3>
                  <pre className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 overflow-auto text-sm whitespace-pre-wrap break-words">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default FormBuilder;
