
// Types for JSON Schema-based form building

export interface JSONSchemaType {
  type: string;
  title?: string;
  description?: string;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
  definitions?: Record<string, JSONSchemaType>;
}

export interface JSONSchemaProperty {
  type: string;
  title?: string;
  description?: string;
  format?: string;
  default?: any;
  enum?: any[];
  enumNames?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  $ref?: string;
}

export interface UISchemaType {
  type: string;
  elements: UISchemaElement[];
}

export interface UISchemaElement {
  type: string;
  scope?: string;
  label?: string;
  elements?: UISchemaElement[];
  options?: UISchemaOptions;
}

export interface UISchemaOptions {
  rows?: number;
  placeholder?: string;
  format?: string;
  showAsStar?: boolean;
  [key: string]: any;
}

export interface FormConfiguration {
  schema: JSONSchemaType;
  uiSchema: UISchemaType;
}

export interface FormData {
  [key: string]: any;
}

export interface FormError {
  path: string;
  message: string;
}

export interface FormState {
  data: FormData;
  errors: FormError[];
  valid: boolean;
}
