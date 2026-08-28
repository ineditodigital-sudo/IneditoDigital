# Línea base PageSpeed · inedito.digital · 2026-08-28

Análisis corrido por Cristian a las 10:31 (GMT-6), con el rediseño completo del
index ya en producción. Cierra el pendiente TEC-01 del checklist.
Fuente: https://pagespeed.web.dev/analysis/https-www-inedito-digital/w3atuf83ce

## Celulares (Moto G Power emulado, 4G lenta, Lighthouse 13.4.1)

| Categoría | Puntaje |
|---|---|
| Rendimiento | 92 |
| Accesibilidad | 96 |
| Recomendaciones | 100 |
| SEO | 100 |
| Navegación con agentes | 3/3 |

- First Contentful Paint: 1.8 s
- Largest Contentful Paint: 2.9 s
- Total Blocking Time: 70 ms
- Cumulative Layout Shift: 0
- Speed Index: 3.7 s

Oportunidades señaladas (no urgentes, para la siguiente pasada de rendimiento):
- Mejora de entrega de imágenes: ~84 KiB
- JavaScript sin usar: ~71 KiB
- Imágenes sin `width`/`height` explícitos
- 2 animaciones no compuestas · 3 tareas largas en el hilo principal
- Accesibilidad: pares de contraste señalados (96)

## Escritorio

| Categoría | Puntaje |
|---|---|
| Rendimiento | 96 |
| Accesibilidad | 96 |
| Recomendaciones | 100 |
| SEO | 100 |
| Navegación con agentes | 3/3 |

- First Contentful Paint: 0.5 s
- Largest Contentful Paint: 0.7 s
- Total Blocking Time: 90 ms
- Cumulative Layout Shift: 0.003
- Speed Index: 1.8 s

**Lectura:** el index rediseñado pasa las mediciones que el propio servicio
promete (90+ en ambos factores), con SEO 100 y CLS ~0. La próxima corrida se
compara contra estos números.
