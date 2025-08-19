# SWAG Frontend Challenge – Solución de Alex Pereyra

Este repositorio contiene **mi solución al challenge de Frontend Developer** propuesto por SWAG.

## Links de la entrega
- Repositorio: https://github.com/alexmp2602/frontend-challenge
- Demo en Vercel: https://frontend-challenge-swag.vercel.app/

## Notas Personales
- Actualicé dependencias en `package.json` para compatibilidad con Node vXX.  
- Corregí los bugs reportados en el enunciado.  
- Funcionalidades implementadas:  
   - Carrito de compras con persistencia en `localStorage`  
   - Filtros avanzados (proveedor, rango de precios, reset)  
   - Simulador de cotización con resumen exportable  
   - Mejoras UX: loading states, validaciones y mensajes de error claros  
   - Se agregaron pequeñas optimizaciones de accesibilidad y mobile.

## Instalación Rápida

npm install
npm run dev

## Build de Producción

npm run build
npm run preview

# SWAG Frontend Challenge

Tiempo estimado: 45-90 minutos
Objetivo: Crear un mini catálogo de productos funcional con React + TypeScript.

---

## Comenzar

# 1. Clonar el repositorio
git clone https://github.com/alexmp2602/frontend-challenge
cd frontend-challenge

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
http://localhost:3000

---

## Autor
**Alex Pereyra**  
- LinkedIn: https://linkedin.com/in/alex-pereyra-dev
- Portafolio: https://www.alexpereyra.dev

---

## 📋 Tu Misión

Eres el desarrollador frontend de **SWAG Chile** y necesitas completar un catálogo de productos para el lanzamiento. El diseño está implementado, pero hay **bugs que corregir** y **funcionalidades que completar**.

### **Lo que YA está funcionando:**
✅ Estructura básica del proyecto  
✅ Diseño y estilos CSS  
✅ Navegación entre páginas  
✅ Datos de productos mock  

### **Lo que NECESITAS hacer:**

#### **🐛 PARTE 1: Detección y Corrección de Bugs (40 puntos)**

Encuentra y corrige estos 8 bugs críticos:

1. **Bug de Búsqueda:** La búsqueda es case-sensitive y no encuentra productos
2. **Bug de Ordenamiento:** Falta implementar ordenamiento por precio
3. **Bug de Estado:** Productos "pending" se muestran como "disponibles"
4. **Bug de Stock:** Un producto aparece sin stock cuando debería tener 150 unidades
5. **Bug de Datos:** Faltan 14 productos para llegar al total prometido de 20
6. **Bug de Cálculo:** La calculadora de precios no encuentra el mejor descuento por volumen
7. **Bug de Formato:** Los precios no muestran formato chileno (CLP)
8. **Bug de Validación:** No hay validación de cantidad máxima en inputs

#### **🛠️ PARTE 2: Implementación de Funcionalidades (40 puntos)**

Implementa estas 4 funcionalidades clave:

1. **Carrito de Compras:**
   - Agregar productos al carrito
   - Mostrar contador de items en el header
   - Persistir carrito en localStorage

2. **Filtros Avanzados:**
   - Filtro por proveedor
   - Filtro por rango de precios
   - Limpiar todos los filtros

3. **Simulador de Cotización:**
   - Formulario con datos de empresa
   - Cálculo de precio final con descuentos
   - Generar resumen en formato exportable

4. **Mejoras de UX:**
   - Loading states en la aplicación
   - Animaciones suaves en transiciones
   - Mensajes de error user-friendly

#### **🎨 PARTE 3: Creatividad y Mejoras (20 puntos)**

Sorpréndenos con mejoras que creas importantes:

- **Performance:** Optimizaciones que consideres necesarias
- **Accesibilidad:** Mejoras para usuarios con discapacidades  
- **Mobile:** Optimizaciones para dispositivos móviles
- **Funcionalidades extra:** Lo que creas que falta para una mejor experiencia

---

## 📊 Cómo te Evaluamos

### **Sistema de Puntos:**
- 🐛 **Bugs corregidos:** 5 puntos cada uno (max 40 pts)
- 🛠️ **Funcionalidades:** 10 puntos cada una (max 40 pts)  
- 🎨 **Creatividad:** Hasta 20 puntos extra
- ⚡ **Velocidad:** Bonus por completarlo en la ventana de tiempo asignada

### **Criterios de Evaluación:**
1. **Funcionamiento:** ¿La aplicación corre sin errores?
2. **Calidad del código:** ¿Es limpio y mantenible?
3. **Solución de problemas:** ¿Detectaste y solucionaste los bugs?
4. **Implementación:** ¿Las nuevas funcionalidades funcionan correctamente?
5. **UX/UI:** ¿La experiencia de usuario es fluida?
6. **Innovación:** ¿Agregaste valor extra no solicitado?

---

## 🎯 Consejos para el Éxito

### **⚡ Para máximo puntaje:**
- **Lee TODO este README** antes de empezar a codear
- **Prioriza los bugs** antes que las funcionalidades nuevas
- **Testea cada cambio** para asegurar que funciona
- **Comenta tu código** si haces algo complejo
- **Haz commits descriptivos** para mostrar tu proceso

### **🔍 Pistas para encontrar bugs:**
- Revisa `src/data/products.ts` - hay inconsistencias de datos
- Los filtros en `ProductList.tsx` tienen lógica incorrecta
- La calculadora en `PricingCalculator.tsx` no calcula bien
- Algunos estados de producto no se manejan correctamente

### **💡 Ideas para funcionalidades:**
- El carrito puede ser un contexto de React
- Los filtros pueden usar URL params para compartir links
- Las cotizaciones pueden generar un PDF o enviar email
- Los loading states mejoran mucho la percepción de velocidad

### **⚠️ Lo que NO tienes que hacer:**
- ❌ No cambies la estructura de carpetas principal
- ❌ No instales librerías pesadas innecesarias
- ❌ No reescribas todo desde cero
- ❌ No te preocupes por el backend (usa mocks)

---

## 📤 Cómo Entregar

### **Cuando termines:**

1. **Asegúrate que todo funciona:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Haz push a tu repositorio GitHub**

3. **Despliega en Vercel/Netlify** (recomendado)

4. **Envía tu solución automáticamente:**
   
   ## 🎯 **[ENVIAR CHALLENGE →](https://swag-challenge-form.vercel.app)**
   
   ⚠️ **IMPORTANTE:** Usa el formulario oficial arriba para enviar tu solución.
   
   **Información requerida:**
   - 🔗 URL de tu repositorio GitHub (fork con tu solución)
   - 🚀 URL de la aplicación desplegada (opcional)
   - 👤 Tu nombre completo
   - 📧 Tu email de contacto

---

## 🏆 Pasos Siguientes

- **Evaluación:** Tu solución será evaluada automáticamente tras el envío
- **Revisión:** Nuestro equipo evaluará tu solución en 24-48 horas
- **Feedback:** Si pasas a la siguiente fase, te contactaremos para una video llamada de 15 minutos
- **Decisión final:** Dentro de 48 horas de la entrega

---

## 🤔 ¿Preguntas?

**NO** puedes hacer preguntas durante el challenge - parte del test es manejar ambigüedad de forma autónoma. Sin embargo, si tienes problemas técnicos para ejecutar el proyecto, puedes escribir a `dev@swag.cl`.

---

## 🎮 Ready? ¡Let's Code!

**Recuerda:** Buscamos desarrolladores que puedan **resolver problemas reales** bajo presión, **entregar resultados rápidos** y **pensar como usuarios**. 

**¡Demuéstranos de qué estás hecho! 🚀**

---

## Nota Importante

Agradecemos tu postulación para el cargo de Desarrollador/a Front-end en SWAG. Debido a la gran cantidad de postulaciones y a la urgencia de nuestro proceso, hemos diseñado este desafío técnico para evaluar de forma rápida y justa a todos los candidatos.

**Sobre el Desafío**
Entendemos que este desafío es más extenso de lo habitual. Lo hemos creado para evaluar tus habilidades de resolución de problemas en un entorno realista. Queremos ser transparentes contigo:

**Propósito:**
Es una prueba diseñada exclusivamente para este proceso. El objetivo es que demuestres tus capacidades en un proyecto que simula las condiciones de trabajo que encontrarás con nosotros.

**Ética y Respeto:**
Valoramos y respetamos tu tiempo y trabajo. El código que desarrolles será revisado únicamente con fines de evaluación y bajo ninguna circunstancia se utilizará en nuestro producto final.

**Flujo del proceso:**
- Envías tu solución.
- Nuestro sistema la evalúa de forma automática y te envía un correo con tu puntaje.
- Si tu puntaje es excepcional, te contactaremos para agendar una entrevista por video.
- Si no eres seleccionado, puedes eliminar tu repositorio una vez que recibas el correo con tu puntaje.

Agradecemos tu comprensión e interés.

---
