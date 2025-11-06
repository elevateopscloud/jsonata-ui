## JSONata UI

Interfaz interactiva para crear, validar y probar expresiones JSONata sobre datos JSON en tiempo real. Construida con React + Vite + TypeScript.

### Características
- **Editor de JSONata con validación en tiempo real**: usa la librería oficial `jsonata` para compilar y detectar errores de sintaxis con detalle de línea y columna.
- **Sugerencias inteligentes**: recomendaciones para errores comunes (paréntesis, llaves, funciones, operadores, rutas, etc.).
- **Sandbox de pruebas**: ejecuta la expresión automáticamente al escribir; muestra resultado estructurado y errores claros.
- **Contexto disponible como `$ctx`**: evalúa expresiones con datos de entrada y un contexto adicional.
- **UI moderna y responsiva**: componentes accesibles, dark/light mode, y diseño adaptable.

### Tech stack
- React 19, React Router 7, TypeScript 5
- Vite 5
- Radix UI + utilidades (`class-variance-authority`, `clsx`)
- `jsonata` 2.x para validación y evaluación
- Tailwind CSS (a través del plugin de Vite) y utilidades (`tailwind-merge`)

### Estructura principal
- `src/components/Rules/RuleEditor.tsx`: Editor de expresiones con validación y paneles de errores/advertencias.
- `src/components/Rules/RuleSandbox.tsx`: Sandbox de prueba con JSON de entrada, contexto y resultado.
- `src/components/Json/JsonViewer.tsx`: Visor JSON para salida con formato.
- `src/utils/jsonataValidator.ts`: API de validación y prueba (`validateJsonata`, `testJsonataExpression`, `getSuggestions`, `getExpressionInfo`).
- `src/components/ui/*`: Componentes reutilizables de UI.

### Requisitos
- Node.js 18+ y npm 9+ (recomendado)

### Instalación
```bash
npm install
```

### Scripts
- **Desarrollo**: inicia servidor en `http://localhost:3000` y abre el navegador.
```bash
npm run dev
```

- **Lint**: ejecuta ESLint sobre `src`.
```bash
npm run lint
```

- **Type-check**: verifica tipos sin emitir artefactos.
```bash
npm run type-check
```

- **Build**: type-check + build de Vite a `dist/`.
```bash
npm run build
```

- **Preview**: sirve el build de `dist/` localmente.
```bash
npm run preview
```

### Uso rápido
1) Abre la app (modo desarrollo o preview).
2) En el editor, escribe tu expresión JSONata. Los errores de sintaxis aparecerán con detalle de línea/columna.
3) En el Sandbox:
   - Ingresa el JSON de entrada (panel "Input Data").
   - (Opcional) Ingresa el JSON de contexto (panel "Context"), accesible en la expresión como `$ctx`.
   - El resultado se actualiza automáticamente al cambiar la expresión o los JSONs.

Ejemplo mínimo:
```jsonata
$string($.user.id)
```
Con un contexto como:
```json
{ "tenant": "acme" }
```
Y un input como:
```json
{ "user": { "id": 123 } }
```

### Notas sobre JSONata
- Documentación oficial: `https://docs.jsonata.org`
- Soporta funciones y lambdas (`(p1, p2) => expr`), funciones built-in (`$string()`, `$number()`, `$map()`, etc.).
- En este proyecto, el contexto opcional se inyecta como `$ctx` durante la evaluación.

### Despliegue
1) Ejecuta el build: `npm run build`
2) Sirve el contenido estático de `dist/` en tu hosting preferido.

### Licencia
MIT


