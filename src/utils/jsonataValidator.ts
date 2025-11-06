/**
 * JSONata Syntax Validator
 * Uses the real jsonata library for accurate syntax validation
 */

import jsonata from 'jsonata';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validates JSONata expression syntax using the real jsonata library
 */
export const validateJsonata = (expression: string): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!expression.trim()) {
    return { isValid: true, errors, warnings };
  }

  try {
    // Try to compile the expression - this will throw if there are syntax errors
    const compiled = jsonata(expression);
    
    // If compilation succeeds, the syntax is valid
    return { isValid: true, errors, warnings };
  } catch (error: any) {
    // Parse the error message from jsonata
    const errorMessage = error.message || 'Unknown error';
    
    // Try to extract line and column information from the error
    let line = 1;
    let column = 1;
    let message = errorMessage;
    
    // JSONata error format: "Syntax error: ... at position XX"
    const positionMatch = errorMessage.match(/at position (\d+)/);
    if (positionMatch) {
      const position = parseInt(positionMatch[1], 10);
      
      // Calculate line and column from position
      const lines = expression.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
      
      // Clean up error message
      message = errorMessage.replace(/at position \d+/, '').trim();
    }
    
    errors.push({
      line,
      column,
      message: message || 'Syntax error in JSONata expression',
      severity: 'error',
      code: 'SYNTAX_ERROR',
    });
    
    return { isValid: false, errors, warnings };
  }
};

/**
 * Get suggestions for fixing errors
 */
export const getSuggestions = (expression: string): string[] => {
  const suggestions: string[] = [];

  // Common mistakes
  if (expression.includes('==')) {
    suggestions.push('💡 Usa "=" para igualdad, no "=="');
  }

  if (expression.includes('!=')) {
    suggestions.push('💡 Usa "!=" para desigualdad o "and not" en combinaciones');
  }

  if (expression.match(/\$\w+\s*\(/)) {
    suggestions.push('💡 Las funciones JSONata empiezan con $, ej: $string(), $number()');
  }

  if (expression.includes('function') && !expression.includes('=>')) {
    suggestions.push('💡 Usa sintaxis de función lambda: (p1, p2) => expression');
  }

  if (expression.includes('{') && !expression.includes('}')) {
    suggestions.push('💡 Recuerda cerrar los objetos con }');
  }

  if (expression.includes('[') && !expression.includes(']')) {
    suggestions.push('💡 Recuerda cerrar los arrays con ]');
  }

  if (expression.includes('(') && !expression.includes(')')) {
    suggestions.push('💡 Recuerda cerrar los paréntesis');
  }

  // Check for common path mistakes
  if (expression.match(/\.\s*\./)) {
    suggestions.push('💡 Evita puntos consecutivos (. .). Usa la notación de ruta correcta');
  }

  // Suggest using map for iterations
  if (expression.includes('for ')) {
    suggestions.push('💡 Usa $map() o * para iterar sobre arrays en JSONata');
  }

  return suggestions;
};

/**
 * Test a JSONata expression with sample data and optional context
 */
export const testJsonataExpression = async (
  expression: string,
  data: unknown,
  ctx?: unknown
): Promise<{ success: boolean; result: unknown; error?: string }> => {
  try {
    const compiled = jsonata(expression);
    const result = await compiled.evaluate(data, { ctx });
    return { success: true, result };
  } catch (error: any) {
    return {
      success: false,
      result: null,
      error: error.message || 'Error evaluating expression',
    };
  }
};

/**
 * Get basic info about the expression
 */
export const getExpressionInfo = (expression: string): {
  hasVariables: boolean;
  variables: string[];
  hasFunctions: boolean;
  functions: string[];
} => {
  const variables = [...new Set(expression.match(/\$[a-zA-Z_][a-zA-Z0-9_]*/g) || [])];
  const functions = [...new Set(expression.match(/\$[a-zA-Z_][a-zA-Z0-9_]*\s*\(/g) || [])];

  return {
    hasVariables: variables.length > 0,
    variables,
    hasFunctions: functions.length > 0,
    functions: functions.map((f) => f.replace(/\s*\(/, '')),
  };
};
