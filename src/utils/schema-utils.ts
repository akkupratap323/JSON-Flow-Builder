
import { JSONSchemaType, JSONSchemaProperty, UISchemaType, UISchemaElement, FormError } from "../types/json-schema";

// Generate a default UI schema from a JSON schema
export function generateUISchema(schema: JSONSchemaType): UISchemaType {
  const elements: UISchemaElement[] = [];
  
  if (schema.properties) {
    for (const [key, property] of Object.entries(schema.properties)) {
      elements.push(createUIElement(key, property));
    }
  }
  
  return {
    type: "VerticalLayout",
    elements
  };
}

function createUIElement(key: string, property: JSONSchemaProperty): UISchemaElement {
  if (property.type === "object" && property.properties) {
    const childElements: UISchemaElement[] = [];
    
    for (const [childKey, childProperty] of Object.entries(property.properties)) {
      childElements.push(createUIElement(`${key}.${childKey}`, childProperty));
    }
    
    return {
      type: "Group",
      label: property.title || formatPropertyName(key),
      elements: childElements
    };
  }
  
  if (property.type === "array" && property.items) {
    return {
      type: "Control",
      scope: `#/properties/${key}`,
      label: property.title || formatPropertyName(key)
    };
  }
  
  return {
    type: "Control",
    scope: `#/properties/${key}`,
    label: property.title || formatPropertyName(key),
    options: createOptions(property)
  };
}

function createOptions(property: JSONSchemaProperty): Record<string, any> {
  const options: Record<string, any> = {};
  
  if (property.format === "textarea") {
    options.rows = 5;
  }
  
  if (property.enum && property.enum.length > 3 && property.enum.length < 7) {
    options.format = "radio";
  }
  
  if (property.type === "integer" && property.minimum === 1 && property.maximum === 5) {
    options.showAsStar = true;
  }
  
  return options;
}

// Format a property name from camelCase or snake_case to Title Case
export function formatPropertyName(name: string): string {
  // Handle camelCase
  const fromCamel = name.replace(/([A-Z])/g, ' $1');
  
  // Handle snake_case
  const fromSnake = fromCamel.replace(/_/g, ' ');
  
  // Title case
  return fromSnake
    .split('.')
    .pop()!
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Simple validation against schema (in a real app, use a library like Ajv)
export function validateForm(data: any, schema: JSONSchemaType): FormError[] {
  const errors: FormError[] = [];
  
  if (schema.properties) {
    for (const [key, property] of Object.entries(schema.properties)) {
      validateProperty(data[key], property, key, errors);
    }
  }
  
  if (schema.required) {
    for (const field of schema.required) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push({
          path: field,
          message: `${formatPropertyName(field)} is required`
        });
      }
    }
  }
  
  return errors;
}

function validateProperty(value: any, property: JSONSchemaProperty, path: string, errors: FormError[]): void {
  if (value === undefined || value === null) {
    return;
  }
  
  if (property.type === "string") {
    if (property.minLength && value.length < property.minLength) {
      errors.push({
        path,
        message: `Must be at least ${property.minLength} characters`
      });
    }
    
    if (property.maxLength && value.length > property.maxLength) {
      errors.push({
        path,
        message: `Must be at most ${property.maxLength} characters`
      });
    }
    
    if (property.pattern) {
      const regex = new RegExp(property.pattern);
      if (!regex.test(value)) {
        errors.push({
          path,
          message: `Invalid format`
        });
      }
    }
    
    if (property.format === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        errors.push({
          path,
          message: `Invalid email address`
        });
      }
    }
  }
  
  if (property.type === "number" || property.type === "integer") {
    if (property.minimum !== undefined && value < property.minimum) {
      errors.push({
        path,
        message: `Must be at least ${property.minimum}`
      });
    }
    
    if (property.maximum !== undefined && value > property.maximum) {
      errors.push({
        path,
        message: `Must be at most ${property.maximum}`
      });
    }
  }
  
  if (property.type === "object" && property.properties) {
    for (const [key, prop] of Object.entries(property.properties)) {
      validateProperty(value?.[key], prop, `${path}.${key}`, errors);
    }
  }
  
  if (property.type === "array" && property.items && Array.isArray(value)) {
    value.forEach((item, index) => {
      validateProperty(item, property.items!, `${path}[${index}]`, errors);
    });
  }
}
