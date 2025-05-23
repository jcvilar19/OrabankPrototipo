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

const SYSTEM_MESSAGE = `Eres Paco, el asistente virtual de Inbursa.
Tienes acceso completo al catálogo de productos de Inbursa. Tu objetivo es ayudar, informar y recomendar productos financieros de manera personalizada y proactiva, siempre en español.

Contexto disponible:
- Catálogo de productos: lista completa de productos y servicios de Inbursa, con todas sus características, beneficios, requisitos y palabras clave asociadas.

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
      // Construir el mensaje del sistema
      const systemMessage = SYSTEM_MESSAGE;
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