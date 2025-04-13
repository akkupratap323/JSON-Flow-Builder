import React, { useState, useEffect } from "react";
import { JSONSchemaType, UISchemaType, FormData, FormError } from "../../types/json-schema";
import { validateForm } from "../../utils/schema-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface FormRendererProps {
  schema: JSONSchemaType;
  uiSchema: UISchemaType;
  initialData?: FormData;
  onSubmit?: (data: FormData) => void;
  onValidate?: (isValid: boolean, errors: FormError[]) => void;
  onChange?: (data: FormData) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  uiSchema,
  initialData = {},
  onSubmit,
  onValidate,
  onChange
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormError[]>([]);
  
  // Validate form when data changes
  useEffect(() => {
    const validationErrors = validateForm(formData, schema);
    setErrors(validationErrors);
    
    if (onValidate) {
      onValidate(validationErrors.length === 0, validationErrors);
    }
    
    if (onChange) {
      onChange(formData);
    }
  }, [formData, schema, onValidate, onChange]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, schema);
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      if (onSubmit) {
        onSubmit(formData);
      }
      toast({
        title: "Form submitted successfully",
        description: "Your form data has been processed.",
      });
    } else {
      toast({
        title: "Form has errors",
        description: "Please fix the validation errors before submitting.",
        variant: "destructive"
      });
    }
  };
  
  const handleChange = (path: string, value: any) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      
      // Handle nested paths (e.g., "person.name")
      const pathParts = path.split('.');
      let current = newData;
      
      // Create nested objects if they don't exist
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Set the value at the final path
      current[pathParts[pathParts.length - 1]] = value;
      
      return newData;
    });
  };
  
  const renderUIElement = (element: any, path: string = ""): JSX.Element => {
    if (!element) return <></>;
    
    switch (element.type) {
      case "VerticalLayout":
      case "HorizontalLayout":
      case "Group":
        return (
          <div 
            key={element.label || "group"} 
            className={cn(
              "form-section rounded-lg bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-6 animate-fade-in border border-blue-100/20 dark:border-blue-900/20 shadow-sm", 
              element.type === "HorizontalLayout" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"
            )}
          >
            {element.label && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{element.label}</h3>
                <Separator className="mb-6 bg-blue-100/20 dark:bg-blue-900/20" />
              </>
            )}
            {element.elements?.map((childElement: any) => 
              renderUIElement(childElement, path)
            )}
          </div>
        );
      
      case "Control": {
        // Extract property path from scope (e.g., "#/properties/firstName" -> "firstName")
        const propertyPath = element.scope?.replace("#/properties/", "");
        if (!propertyPath) return <></>;
        
        // Get actual path by joining with parent path
        const fullPath = path ? `${path}.${propertyPath}` : propertyPath;
        
        // Find property in schema
        const schemaPath = propertyPath.split('/');
        let property = schema.properties?.[schemaPath[0]];
        
        for (let i = 1; i < schemaPath.length; i++) {
          if (property?.properties) {
            property = property.properties[schemaPath[i]];
          }
        }
        
        if (!property) return <></>;
        
        // Find error for this field
        const fieldError = errors.find(err => err.path === propertyPath);
        
        return (
          <div key={fullPath} className="form-field space-y-2 animate-slide-in">
            <Label 
              htmlFor={fullPath} 
              className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
            >
              {element.label || propertyPath}
              {schema.required?.includes(propertyPath) && 
                <span className="text-red-500 text-sm">*</span>
              }
            </Label>
            
            {renderControl(property, fullPath, formData[propertyPath], element.options)}
            
            {fieldError && (
              <p className="text-red-500 text-sm mt-1 animate-shake">{fieldError.message}</p>
            )}
          </div>
        );
      }
      
      default:
        return <></>;
    }
  };
  
  const renderControl = (property: any, path: string, value: any, options?: any): JSX.Element => {
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      handleChange(path, e.target.value);
      // Show toast for input changes
      toast({
        title: "Changes applied",
        description: "Your changes have been saved",
        duration: 1500,
      });
    };
    
    switch (property.type) {
      case "string":
        if (property.enum) {
          if (options?.format === "radio") {
            return (
              <RadioGroup 
                value={value || ""} 
                onValueChange={(val) => handleChange(path, val)}
                className="flex flex-col sm:flex-row gap-4"
              >
                {property.enum.map((option: string, index: number) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${path}-${option}`} />
                    <Label htmlFor={`${path}-${option}`}>
                      {property.enumNames?.[index] || option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            );
          }
          
          return (
            <Select value={value || ""} onValueChange={(val) => handleChange(path, val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={options?.placeholder || `Select ${path}`} />
              </SelectTrigger>
              <SelectContent>
                {property.enum.map((option: string, index: number) => (
                  <SelectItem key={option} value={option}>
                    {property.enumNames?.[index] || option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        
        if (property.format === "textarea" || options?.rows) {
          return (
            <Textarea
              id={path}
              value={value || ""}
              onChange={handleFieldChange}
              rows={options?.rows || 3}
              placeholder={options?.placeholder || `Enter ${path}`}
              className="w-full resize-y min-h-[100px] bg-white/70 dark:bg-gray-900/50"
            />
          );
        }
        
        return (
          <Input
            id={path}
            type={property.format === "email" ? "email" : "text"}
            value={value || ""}
            onChange={handleFieldChange}
            placeholder={options?.placeholder || `Enter ${path}`}
            className="w-full bg-white/70 dark:bg-gray-900/50"
          />
        );
      
      case "number":
      case "integer":
        if (options?.showAsStar) {
          return (
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleChange(path, star)}
                  className={`text-2xl ${value >= star ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          );
        }
        
        return (
          <Input
            id={path}
            type="number"
            value={value || ""}
            onChange={handleFieldChange}
            min={property.minimum}
            max={property.maximum}
            step={property.type === "integer" ? 1 : 0.01}
            placeholder={options?.placeholder || `Enter ${path}`}
            className="w-full bg-white/70 dark:bg-gray-900/50"
          />
        );
      
      case "boolean":
        if (options?.format === "switch") {
          return (
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => handleChange(path, checked)}
              id={path}
            />
          );
        }
        
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={path}
              checked={value || false}
              onCheckedChange={(checked) => handleChange(path, checked)}
            />
            <Label htmlFor={path}>
              {options?.checkboxLabel || property.title || "Yes"}
            </Label>
          </div>
        );
      
      default:
        return <></>;
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="space-y-8">
        {uiSchema.elements.map((element) => renderUIElement(element))}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
          <Button 
            type="reset" 
            variant="outline"
            className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              setFormData(initialData);
              toast({
                title: "Form reset",
                description: "All fields have been reset to their initial values",
                variant: "default",
              });
            }}
          >
            Reset
          </Button>
          <Button 
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormRenderer;
