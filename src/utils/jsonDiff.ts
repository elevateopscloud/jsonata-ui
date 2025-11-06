import { IChange, diff } from 'json-diff-ts';

export type DiffType = 'added' | 'removed' | 'modified' | 'unchanged';

export interface DiffItem {
  path: string;
  type: DiffType;
  oldValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
}

/**
 * Construye el path completo recursivamente desde los cambios anidados
 */
function buildFullPath(
  change: IChange,
  parentPath = ''
): Array<{ path: string; type: DiffType; oldValue: unknown; newValue: unknown }> {
  const results = [];

  // Determinar si la clave es un índice de array
  const isArrayIndex = /^\d+$/.test(change.key);

  // Construir el path actual
  const currentPath = parentPath
    ? isArrayIndex
      ? `${parentPath}[${change.key}]`
      : `${parentPath}.${change.key}`
    : change.key;

  // Mapear tipo de operación
  let type: DiffType = 'unchanged';
  if (change.type === 'ADD') {
    type = 'added';
  } else if (change.type === 'REMOVE') {
    type = 'removed';
  } else if (change.type === 'UPDATE') {
    type = 'modified';
  }

  // Agregar cambio actual
  results.push({
    path: currentPath,
    type,
    oldValue: change.type === 'REMOVE' ? change.value : change.oldValue,
    newValue: change.value,
  });

  // Procesar cambios anidados recursivamente
  if (change.changes && change.changes.length > 0) {
    for (const nestedChange of change.changes) {
      results.push(...buildFullPath(nestedChange, currentPath));
    }
  }

  return results;
}

/**
 * Convierte el resultado de json-diff-ts al formato DiffItem con paths correctos
 */
function adaptJsonDiffTsResult(changes: IChange[]): DiffItem[] {
  const flattened: Array<{ path: string; type: DiffType; oldValue: unknown; newValue: unknown }> = [];

  // Procesar cada cambio de nivel superior recursivamente
  for (const change of changes) {
    flattened.push(...buildFullPath(change));
  }

  // Convertir a DiffItem
  return flattened.map((item) => ({
    path: item.path,
    type: item.type,
    oldValue: item.oldValue as Record<string, unknown>,
    newValue: item.newValue as Record<string, unknown>,
  }));
}

/**
 * Compara dos objetos JSON usando json-diff-ts
 * Retorna un array de diferencias en formato DiffItem
 */
export function getJsonDiff(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>
): DiffItem[] {
  try {
    const changes = diff(oldObj || {}, newObj || {}, { treatTypeChangeAsReplace: false });
    const adaptedChanges = adaptJsonDiffTsResult(changes);

    // Si no hay cambios, retornar un array vacío (json-diff-ts no incluye items sin cambios)
    return adaptedChanges;
  } catch (error) {
    // En caso de error, retornar array vacío
    console.error('Error al calcular diff:', error);
    return [];
  }
}

export function valueToString(value: unknown): string {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
