# 🔧 Configuración para Datos Reales de Firebase

## ⚠️ IMPORTANTE: Configuración Requerida

Para que el dashboard muestre **datos reales** de tu base de datos Firebase, necesitas seguir estos pasos:

### 📋 Paso 1: Obtener Configuración Web de Firebase

1. **Ve a la Consola de Firebase**: https://console.firebase.google.com/
2. **Selecciona tu proyecto**: `plan-de-lealtad-5cbd9`
3. **Haz clic en el ícono de engranaje** ⚙️ → "Configuración del proyecto"
4. **En la sección "Tus apps"**:
   - Si NO tienes una app web, haz clic en **"Agregar app"** → Selecciona **Web** (</> ícono)
   - Si YA tienes una app web, selecciónala
5. **Copia la configuración** que se muestra (algo así):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "plan-de-lealtad-5cbd9.firebaseapp.com",
  projectId: "plan-de-lealtad-5cbd9",
  storageBucket: "plan-de-lealtad-5cbd9.appspot.com",
  messagingSenderId: "100848900872851840577",
  appId: "1:100848900872851840577:web:..."
};
```

### 📝 Paso 2: Actualizar config.js

1. **Abre el archivo** `config.js`
2. **Reemplaza** la configuración existente con la que copiaste de Firebase
3. **Guarda** el archivo

### 🚀 Paso 3: Iniciar el Servidor

**Opción A - PowerShell (Recomendado):**
```powershell
.\iniciar.ps1
```

**Opción B - Comandos manuales:**
```powershell
npm install
npm start
```

### 🔍 Paso 4: Verificar Conexión

1. **Abre tu navegador** en: http://localhost:3000
2. **Verifica el indicador de estado**:
   - 🟢 **Verde**: Conectado a Firebase (datos reales)
   - 🔴 **Rojo**: Error de conexión
   - 🟡 **Amarillo**: Conectando...

### 📊 Qué Datos Obtendrás

Una vez configurado correctamente, el dashboard mostrará:

- ✅ **Registros Hoy**: Usuarios reales registrados hoy en Firebase Auth
- ✅ **Registros Ayer**: Usuarios reales registrados ayer
- ✅ **Total Usuarios**: Número real total en tu base de datos Firebase
- ✅ **Gráfico Semanal**: Registros reales de los últimos 7 días

### 🔧 Solución de Problemas

#### Error: "Servidor no disponible"
- **Causa**: No has iniciado el servidor Node.js
- **Solución**: Ejecuta `npm start` o `.\iniciar.ps1`

#### Error: "Firebase configuration"
- **Causa**: Configuración incorrecta en `config.js`
- **Solución**: Verifica que copiaste correctamente la configuración web

#### Error: "Access denied"
- **Causa**: Permisos de Firebase
- **Solución**: Verifica las reglas de Firebase Authentication

### 📁 Archivos Importantes

- `config.js` → Configuración de Firebase (DEBES actualizar)
- `server.js` → Servidor backend con credenciales reales
- `.env` → Variables de entorno (YA configurado)
- `app.js` → Frontend que consume datos reales

### 🔒 Seguridad

✅ **Las credenciales del service account** están seguras en el servidor backend  
✅ **Solo la configuración web** se usa en el frontend  
✅ **Datos reales** sin exponer credenciales sensibles  

---

## 🎯 Resultado Final

Una vez completada la configuración, tendrás un dashboard que:

1. **Se conecta directamente** a tu Firebase Authentication
2. **Muestra datos reales** de usuarios registrados
3. **Se actualiza automáticamente** cada 5 minutos
4. **Funciona de forma segura** sin exponer credenciales

¿Necesitas ayuda con algún paso? ¡Consulta la documentación de Firebase o contacta soporte técnico!
