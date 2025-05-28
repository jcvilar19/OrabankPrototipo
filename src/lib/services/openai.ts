import axios from 'axios';
import * as XLSX from 'xlsx';

interface Product {
  [key: string]: any;
}

const PRODUCTS_FILE = '/data/catalogo_productos.xlsx';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

let conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];

const loadProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(PRODUCTS_FILE);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const products = XLSX.utils.sheet_to_json<Product>(worksheet);
    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

const clienteActual = {
  nombre: "Jessica Rivera Domínguez",
  id: "276344890",
  idmex: "IDMEX2984731635",
  score: 715,
  scoreLabel: "Bueno",
  pagosATiempo: 11,
  pagosTardios: 1,
  porcentajePagosATiempo: 92,
  usoCredito: {
    disponible: 84000,
    utilizado: 36000,
    porcentaje: 30,
    total: 120000,
    estado: "Óptimo"
  },
  cuentas: [
    { tipo: "Nómina", saldo: 17251 },
    { tipo: "Ahorro Vacaciones", saldo: 35000 },
    { tipo: "CETES", saldo: 50000 },
    { tipo: "Platinum", saldo: 24500 }
  ],
  gastos: [
    { categoria: "Vivienda", monto: 8500, porcentaje: 45 },
    { categoria: "Transporte", monto: 2200, porcentaje: 12 },
    { categoria: "Alimentación", monto: 4800, porcentaje: 26 },
    { categoria: "Entretenimiento", monto: 1800, porcentaje: 10 },
    { categoria: "Otros", monto: 1500, porcentaje: 8 }
  ]
};

const clienteContexto = `\n\nCliente actual:\nNombre: ${clienteActual.nombre}\nID: ${clienteActual.id} | IDMEX: ${clienteActual.idmex}\nScore crediticio: ${clienteActual.score} (${clienteActual.scoreLabel})\nPagos a tiempo: ${clienteActual.pagosATiempo}\nPagos tardíos: ${clienteActual.pagosTardios}\n% Pagos a tiempo: ${clienteActual.porcentajePagosATiempo}%\nUso de crédito: ${clienteActual.usoCredito.porcentaje}% de $${clienteActual.usoCredito.total} (Disponible: $${clienteActual.usoCredito.disponible}, Utilizado: $${clienteActual.usoCredito.utilizado}, Estado: ${clienteActual.usoCredito.estado})\nCuentas activas: ${clienteActual.cuentas.map(c => `${c.tipo}: $${c.saldo}`).join(", ")}\nGastos principales: ${clienteActual.gastos.map(g => `${g.categoria}: $${g.monto} (${g.porcentaje}%)`).join(", ")}\n`;

const SYSTEM_MESSAGE = `Eres Paco, el asistente virtual para ejecutivos de OraBank. Tu objetivo es ayudar a los ejecutivos a obtener una visión integral de los clientes que atienden, identificar oportunidades de ventas cruzadas y sugerir productos o servicios relevantes según el perfil y las necesidades detectadas. Proporciona información clara, profesional y orientada a maximizar el valor para el cliente y la institución. No respondas como si hablaras con el cliente final, sino como un asesor para el ejecutivo.

IMPORTANTE: Siempre responde usando los productos concretos listados en el contexto si el usuario pregunta por recomendaciones, productos o ventas cruzadas. Si no hay productos relevantes, sugiere alternativas del catálogo proporcionado.

Contexto disponible:
- Catálogo de productos: lista completa de productos y servicios de OraBank, con todas sus características, beneficios, requisitos y palabras clave asociadas.

EXPLICACIÓN DE LAS COLUMNAS DEL CATÁLOGO DE PRODUCTOS (acceso: {{producto['nombre_columna']}}):
- Título de Variable: Nombre de la variable o campo. (Ejemplo: {{producto['Título de Variable']}})
- id_producto: Identificador único del producto. (Ejemplo: {{producto['id_producto']}})
- tipo_producto: Categoría general del producto (ejemplo: inversión, seguro, crédito, etc.). (Ejemplo: {{producto['tipo_producto']}})
- subtipo_producto: Subcategoría específica del producto. (Ejemplo: {{producto['subtipo_producto']}})
- nombre_producto: Nombre comercial del producto. (Ejemplo: {{producto['nombre_producto']}})
- descripción_corta: Descripción breve del producto. (Ejemplo: {{producto['descripción_corta']}})
- descripcion_comercial: Descripción comercial o de marketing del producto. (Ejemplo: {{producto['descripcion_comercial']}})
- beneficios_clave: Beneficios principales que ofrece el producto. (Ejemplo: {{producto['beneficios_clave']}})
- coberturas: Coberturas incluidas (aplica para seguros). (Ejemplo: {{producto['coberturas']}})
- sumas_aseguradas: Montos asegurados o cubiertos (aplica para seguros). (Ejemplo: {{producto['sumas_aseguradas']}})
- Saldo: Saldo relacionado o requerido para el producto (si aplica). (Ejemplo: {{producto['Saldo']}})
- modalidades_pago: Formas de pago disponibles para el producto. (Ejemplo: {{producto['modalidades_pago']}})
- plazo_contrato: Plazo mínimo o máximo del contrato del producto. (Ejemplo: {{producto['plazo_contrato']}})
- precio_aproximado: Precio o costo estimado del producto. (Ejemplo: {{producto['precio_aproximado']}})
- edad_minima: Edad mínima requerida para contratar el producto. (Ejemplo: {{producto['edad_minima']}})
- edad_maxima: Edad máxima permitida para contratar el producto. (Ejemplo: {{producto['edad_maxima']}})
- ocupaciones: Ocupaciones recomendadas o permitidas para el producto. (Ejemplo: {{producto['ocupaciones']}})
- situaciones_relevantes: Situaciones de vida o eventos donde el producto es relevante. (Ejemplo: {{producto['situaciones_relevantes']}})
- nivel_ingresos_sugerido: Nivel de ingresos recomendado para el producto. (Ejemplo: {{producto['nivel_ingresos_sugerido']}})
- segmento_cliente_objetivo: Segmento de clientes al que va dirigido el producto. (Ejemplo: {{producto['segmento_cliente_objetivo']}})
- trigger_venta: Palabras clave o situaciones que disparan la recomendación del producto. (Ejemplo: {{producto['trigger_venta']}})
- canales_disponibles: Canales donde se puede contratar o consultar el producto. (Ejemplo: {{producto['canales_disponibles']}})
- palabras_clave_asociadas: Palabras clave para identificar necesidades relacionadas con el producto. (Ejemplo: {{producto['palabras_clave_asociadas']}})
- intenciones_clientes: Intenciones o motivos típicos de los clientes para contratar el producto. (Ejemplo: {{producto['intenciones_clientes']}})
- Respuesta_IA: Respuesta sugerida para la IA al recomendar este producto. (Ejemplo: {{producto['Respuesta_IA']}})

INSTRUCCIONES:
1. Analiza la información del usuario y su mensaje.
2. Utiliza palabras clave presentes en la base de datos para identificar necesidades, intereses o eventos relevantes (por ejemplo: "ahorro", "viaje", "retiro", "inversión", "protección", "educación", "jubilación", "emergencia", etc.).
3. Si detectas una oportunidad, recomienda el producto más adecuado del catálogo.
4. Explica brevemente por qué ese producto es relevante, usando datos concretos del catálogo.
5. Si el usuario pregunta por un producto específico, responde con detalles exactos (características, tasas, requisitos, beneficios).
6. Si el producto no existe, sugiere alternativas disponibles.
7. Responde siempre en español, de manera clara, profesional y amable.
8. Presenta la información en listas o párrafos cortos, fáciles de leer.
9. No saludes ni te despidas, ve directo a la respuesta.
`;

export const openaiService = {
  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Cargar productos
      const products = await loadProducts();
      // Filtrar productos relevantes según palabras clave en el mensaje del usuario
      const lowerMsg = userMessage.toLowerCase();
      let productosRelevantes = products.filter(p => {
        const nombre = (p["nombre_producto"] || "").toLowerCase();
        const tipo = (p["tipo_producto"] || "").toLowerCase();
        const palabras = (p["palabras_clave_asociadas"] || "").toLowerCase();
        return (
          lowerMsg.includes(nombre) ||
          lowerMsg.includes(tipo) ||
          palabras.split(",").some((kw: string) => lowerMsg.includes(kw.trim()))
        );
      });
      // Palabras clave para forzar inclusión de productos
      const triggerKeywords = [
        'recomendación', 'recomendar', 'recomiendas', 'venta cruzada', 'ofrecer', 'sugerir', 'sugerencia', 'oportunidad', 'producto'
      ];
      const triggered = triggerKeywords.some(kw => lowerMsg.includes(kw));
      // Si no hay coincidencias, incluir productos según trigger o los primeros 3 por defecto
      if (productosRelevantes.length === 0) {
        if (triggered) {
          productosRelevantes = products.slice(0, 5);
        } else {
          productosRelevantes = products.slice(0, 3);
        }
      }
      // Construir texto de productos para el prompt, reemplazando 'Inbursa' por 'OraBank'
      const productosTexto = productosRelevantes.map((p, idx) =>
        `Producto ${idx + 1}:
- Nombre: ${(p["nombre_producto"] || "").replace(/Inbursa/gi, "OraBank")}
- Descripción: ${(p["descripcion_comercial"] || "").replace(/Inbursa/gi, "OraBank")}
- Beneficios: ${(p["beneficios_clave"] || "").replace(/Inbursa/gi, "OraBank")}`
      ).join('\n\n');
      // Construir el mensaje del sistema
      const systemMessage = SYSTEM_MESSAGE + clienteContexto + `\n\nProductos relevantes del catálogo para esta consulta:\n${productosTexto}`;
      // DEPURACIÓN: Mostrar el prompt final en consola
      console.log("PROMPT ENVIADO A OPENAI:\n", systemMessage);
      // Construir historial (últimos 10 mensajes)
      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: systemMessage }
      ];
      for (const msg of conversationHistory.slice(-10)) {
        messages.push(msg);
      }
      messages.push({ role: 'user', content: userMessage });
      // Llamada a OpenAI
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const aiResponse = response.data.choices[0].message.content;
      // Guardar historial
      conversationHistory.push({ role: 'user', content: userMessage });
      conversationHistory.push({ role: 'assistant', content: aiResponse });
      if (conversationHistory.length > 50) {
        conversationHistory.splice(0, conversationHistory.length - 50);
      }
      return aiResponse;
    } catch (e: any) {
      console.error('Error en sendMessage:', e?.response?.data || e);
      throw new Error(e?.response?.data?.error?.message || 'Error al procesar tu mensaje. Por favor, intenta de nuevo.');
    }
  },
  clearHistory() {
    conversationHistory = [];
  }
};