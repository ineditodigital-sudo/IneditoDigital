<?php
/**
 * "Cómo te ve Google" ya no es una pantalla aparte: vive dentro de
 * Analíticas, con los mismos datos desglosados y graficados. Esta ruta se
 * queda solo para que los marcadores viejos no caigan en un 404.
 */
set_flash('«Cómo te ve Google» ahora vive dentro de Analíticas, junto con el resto de los datos.');
redirect('/panel/?p=analiticas#google');
