<?php
/**
 * Un escritor de PDF del tamaño justo para lo que hace falta.
 *
 * Por qué no una librería
 * -----------------------
 * El servidor no tiene composer, ni Chrome, ni wkhtmltopdf, así que las
 * opciones eran subir a mano una librería grande o escribir lo poco que este
 * reporte necesita. Necesita tres cosas: páginas de un tamaño fijo, una
 * imagen JPEG que ocupe la lámina entera y texto encima. Eso son doscientas
 * líneas que se pueden leer de arriba abajo, y ninguna dependencia que
 * mantener ni auditar.
 *
 * Cómo reparte el trabajo
 * -----------------------
 * Lo vistoso —degradados, la tipografía Hanson de los títulos, las gráficas—
 * lo dibuja GD y entra como una sola imagen de fondo por lámina. El texto
 * que alguien va a querer copiar —cifras, tablas, párrafos— va como texto de
 * verdad encima, en Helvetica, que es de las catorce fuentes que todo lector
 * de PDF ya trae. Así el archivo pesa poco y el contenido se puede
 * seleccionar y buscar.
 *
 * El sistema de coordenadas es el de una presentación: 960 × 540 puntos, con
 * el origen ARRIBA a la izquierda, como en pantalla. El PDF lo cuenta desde
 * abajo; esa conversión se hace aquí y no se piensa más.
 */
declare(strict_types=1);

class Pdf
{
    public const ANCHO = 960.0;
    public const ALTO  = 540.0;

    /** @var string[] objetos, indexados desde 1 */
    private array $obj = [];
    /** @var array<int,array{contenido:string,jpeg:?string,w:int,h:int}> */
    private array $paginas = [];
    private string $buffer = '';

    /* Anchos de Helvetica en milésimas de em. Sin esto no se puede centrar
       ni alinear a la derecha, que es la mitad de una lámina decente. */
    private const W_NORMAL = [
        32=>278,33=>278,34=>355,35=>556,36=>556,37=>889,38=>667,39=>191,40=>333,41=>333,42=>389,43=>584,
        44=>278,45=>333,46=>278,47=>278,48=>556,49=>556,50=>556,51=>556,52=>556,53=>556,54=>556,55=>556,
        56=>556,57=>556,58=>278,59=>278,60=>584,61=>584,62=>584,63=>556,64=>1015,65=>667,66=>667,67=>722,
        68=>722,69=>667,70=>611,71=>778,72=>722,73=>278,74=>500,75=>667,76=>556,77=>833,78=>722,79=>778,
        80=>667,81=>778,82=>722,83=>667,84=>611,85=>722,86=>667,87=>944,88=>667,89=>667,90=>611,91=>278,
        92=>278,93=>278,94=>469,95=>556,96=>333,97=>556,98=>556,99=>500,100=>556,101=>556,102=>278,103=>556,
        104=>556,105=>222,106=>222,107=>500,108=>222,109=>833,110=>556,111=>556,112=>556,113=>556,114=>333,
        115=>500,116=>278,117=>556,118=>500,119=>722,120=>500,121=>500,122=>500,123=>334,124=>260,125=>334,126=>584,
    ];
    private const W_NEGRITA = [
        32=>278,33=>333,34=>474,35=>556,36=>556,37=>889,38=>722,39=>238,40=>333,41=>333,42=>389,43=>584,
        44=>278,45=>333,46=>278,47=>278,48=>556,49=>556,50=>556,51=>556,52=>556,53=>556,54=>556,55=>556,
        56=>556,57=>556,58=>333,59=>333,60=>584,61=>584,62=>584,63=>611,64=>975,65=>722,66=>722,67=>722,
        68=>722,69=>667,70=>611,71=>778,72=>722,73=>278,74=>556,75=>722,76=>611,77=>833,78=>722,79=>778,
        80=>667,81=>778,82=>722,83=>667,84=>611,85=>722,86=>667,87=>944,88=>667,89=>667,90=>611,91=>333,
        92=>278,93=>333,94=>584,95=>556,96=>333,97=>556,98=>611,99=>556,100=>611,101=>556,102=>333,103=>611,
        104=>611,105=>278,106=>278,107=>556,108=>278,109=>889,110=>611,111=>611,112=>611,113=>611,114=>389,
        115=>556,116=>333,117=>611,118=>556,119=>778,120=>556,121=>556,122=>500,123=>389,124=>280,125=>389,126=>584,
    ];
    /* Las vocales con acento ocupan lo mismo que la vocal, y el resto de los
       signos que este reporte usa de verdad. */
    private const W_EXTRA = [
        161=>333, 171=>556, 176=>400, 183=>278, 187=>556, 191=>611,
        193=>667, 201=>667, 205=>278, 209=>722, 211=>778, 218=>722, 220=>722,
        225=>556, 233=>556, 237=>222, 241=>556, 243=>556, 250=>556, 252=>556,
        133=>1000, 145=>222, 146=>222, 147=>333, 148=>333, 150=>556, 151=>1000,
    ];

    private function nuevoObjeto(string $cuerpo): int
    {
        $this->obj[] = $cuerpo;
        return count($this->obj);
    }

    /* ---------------------------------------------------------------- */

    /**
     * Abre una lamina en blanco. Todo lo que se dibuje a partir de aqui cae
     * en ella.
     */
    public function pagina(): void
    {
        $this->paginas[] = ['contenido' => '', 'jpeg' => null, 'w' => 0, 'h' => 0];
    }

    /**
     * Le pone el fondo a la lamina abierta.
     *
     * Va aparte de `pagina()` a proposito: el fondo se termina de dibujar
     * cuando ya se sabe que lleva encima —la altura de una tabla, cuantas
     * barras— asi que se entrega al final. La imagen se estira a la lamina
     * completa y se pinta ANTES que el texto, sea cual sea el orden en que
     * se hicieron las llamadas.
     */
    public function fondo(string $jpeg, int $anchoPx, int $altoPx): void
    {
        $p = &$this->actual();
        $p['jpeg'] = $jpeg; $p['w'] = $anchoPx; $p['h'] = $altoPx;
    }

    /** Todo lo que se dibuje va a la última lámina abierta. */
    private function &actual(): array
    {
        if (!$this->paginas) $this->pagina();
        return $this->paginas[count($this->paginas) - 1];
    }

    /* ---------------------------------------------------------------- */

    /** El ancho de un texto, en puntos, para poder centrarlo. */
    public function ancho(string $txt, float $tam, bool $negrita = false): float
    {
        $s = $this->aWinAnsi($txt);
        $tabla = $negrita ? self::W_NEGRITA : self::W_NORMAL;
        $suma = 0;
        for ($i = 0, $n = strlen($s); $i < $n; $i++) {
            $c = ord($s[$i]);
            $suma += $tabla[$c] ?? self::W_EXTRA[$c] ?? 556;
        }
        return $suma / 1000 * $tam;
    }

    /**
     * Texto. `$y` es la línea base contada DESDE ARRIBA, como en pantalla.
     * `$alineado`: 'izq' | 'centro' | 'der'.
     */
    public function texto(float $x, float $y, string $txt, float $tam = 11,
                          bool $negrita = false, string $color = '#FFFFFF',
                          string $alineado = 'izq', float $espaciado = 0): void
    {
        if (trim($txt) === '') return;
        $s = $this->aWinAnsi($txt);
        $w = $this->ancho($txt, $tam, $negrita) + $espaciado * max(0, strlen($s) - 1);
        if ($alineado === 'centro') $x -= $w / 2;
        elseif ($alineado === 'der') $x -= $w;

        [$r, $g, $b] = $this->rgb($color);
        $f = $negrita ? '/F2' : '/F1';
        $p = &$this->actual();
        $p['contenido'] .= sprintf(
            "BT %.3F %.3F %.3F rg %s %.2F Tf %.2F Tc %.2F %.2F Td (%s) Tj ET\n",
            $r, $g, $b, $f, $tam, $espaciado, $x, self::ALTO - $y, $this->escapar($s)
        );
    }

    /**
     * Un párrafo que se parte solo al llegar al ancho. Devuelve la `y` de la
     * línea siguiente, para poder encadenar bloques sin contar a mano.
     */
    /**
     * Cómo queda partido un texto a un ancho dado, sin dibujar nada.
     *
     * Existe para poder reservar el sitio ANTES de pintar: sin esto, quien
     * reparte una lámina tiene que suponer cuántos renglones va a ocupar cada
     * bloque, y suponer es como se llega a dos párrafos encimados.
     */
    public function partir(string $txt, float $ancho, float $tam = 11,
                           bool $negrita = false, int $maxLineas = 0): array
    {
        $palabras = preg_split('/\s+/u', trim($txt)) ?: [];
        $linea = ''; $lineas = [];
        foreach ($palabras as $p) {
            $prueba = $linea === '' ? $p : $linea . ' ' . $p;
            if ($this->ancho($prueba, $tam, $negrita) > $ancho && $linea !== '') {
                $lineas[] = $linea; $linea = $p;
            } else {
                $linea = $prueba;
            }
        }
        if ($linea !== '') $lineas[] = $linea;
        if ($maxLineas > 0 && count($lineas) > $maxLineas) {
            $lineas = array_slice($lineas, 0, $maxLineas);
            $lineas[$maxLineas - 1] = rtrim($lineas[$maxLineas - 1], ' .,;') . '…';
        }
        return $lineas;
    }

    /** Cuántos renglones ocupa. El atajo de arriba, para repartir el alto. */
    public function lineas(string $txt, float $ancho, float $tam = 11,
                           bool $negrita = false, int $maxLineas = 0): int
    {
        return count($this->partir($txt, $ancho, $tam, $negrita, $maxLineas));
    }

    public function parrafo(float $x, float $y, float $ancho, string $txt, float $tam = 11,
                            bool $negrita = false, string $color = '#FFFFFF', float $interlinea = 1.45,
                            int $maxLineas = 0): float
    {
        $lineas = $this->partir($txt, $ancho, $tam, $negrita, $maxLineas);
        foreach ($lineas as $l) {
            $this->texto($x, $y, $l, $tam, $negrita, $color);
            $y += $tam * $interlinea;
        }
        return $y;
    }

    /** Un rectángulo, con esquinas rectas. Para barras y separadores. */
    public function caja(float $x, float $y, float $w, float $h, string $color, float $alfa = 1.0): void
    {
        [$r, $g, $b] = $this->rgb($color);
        $p = &$this->actual();
        $extra = $alfa < 1.0 ? "/A$this->alfaId gs " : '';
        if ($alfa < 1.0) $this->alfas[$this->alfaId] = $alfa;
        $p['contenido'] .= sprintf("q %s%.3F %.3F %.3F rg %.2F %.2F %.2F %.2F re f Q\n",
            $extra, $r, $g, $b, $x, self::ALTO - $y - $h, $w, $h);
        if ($alfa < 1.0) $this->alfaId++;
    }

    private int $alfaId = 1;
    /** @var array<int,float> */
    private array $alfas = [];

    /* ---------------------------------------------------------------- */

    /** El archivo terminado. */
    public function salida(): string
    {
        $recursos = [];
        $fuentes = $this->nuevoObjeto("<</Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding>>");
        $fuenteN = $this->nuevoObjeto("<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding>>");

        $gs = '';
        if ($this->alfas) {
            $partes = [];
            foreach ($this->alfas as $id => $a) {
                $o = $this->nuevoObjeto(sprintf("<</Type /ExtGState /ca %.3F>>", $a));
                $partes[] = "/A$id $o 0 R";
            }
            $gs = ' /ExtGState <<' . implode(' ', $partes) . '>>';
        }

        /* Cada página apunta a Pages y Pages apunta a cada página. Se deja
           una marca y se sustituye al final: adivinar el número por
           adelantado es de las cosas que se rompen al añadir un objeto. */
        $idsPagina = [];
        foreach ($this->paginas as $pg) {
            $xobj = ''; $prefijo = '';
            if (!empty($pg['jpeg'])) {
                $img = $this->nuevoObjeto(
                    "<</Type /XObject /Subtype /Image /Width {$pg['w']} /Height {$pg['h']} "
                    . "/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode "
                    . "/Length " . strlen($pg['jpeg']) . ">>\nstream\n" . $pg['jpeg'] . "\nendstream"
                );
                $xobj = "/XObject <</Im0 $img 0 R>>";
                $prefijo = sprintf("q %.2F 0 0 %.2F 0 0 cm /Im0 Do Q\n", self::ANCHO, self::ALTO);
            }
            $flujo = gzcompress($prefijo . $pg['contenido']);
            $idContenido = $this->nuevoObjeto("<</Length " . strlen($flujo) . " /Filter /FlateDecode>>\nstream\n" . $flujo . "\nendstream");
            $idsPagina[] = $this->nuevoObjeto(
                "<</Type /Page /Parent @@PAGES@@ 0 R "
                . sprintf("/MediaBox [0 0 %.2F %.2F] ", self::ANCHO, self::ALTO)
                . "/Resources <</ProcSet [/PDF /Text /ImageC] "
                . "/Font <</F1 $fuentes 0 R /F2 $fuenteN 0 R>> $xobj$gs>> "
                . "/Contents $idContenido 0 R>>"
            );
        }
        $kids = implode(' ', array_map(fn($i) => "$i 0 R", $idsPagina));
        $idPagesReal = $this->nuevoObjeto("<</Type /Pages /Kids [$kids] /Count " . count($idsPagina) . ">>");
        $idCatalogo = $this->nuevoObjeto("<</Type /Catalog /Pages $idPagesReal 0 R>>");
        $idInfo = $this->nuevoObjeto(
            "<</Title (" . $this->escapar($this->aWinAnsi($this->titulo)) . ") "
            . "/Author (Inedito Digital) /Creator (Panel Inedito) "
            . "/CreationDate (D:" . date('YmdHis') . "-06'00')>>"
        );
        foreach ($idsPagina as $i) {
            $this->obj[$i - 1] = str_replace('@@PAGES@@', (string)$idPagesReal, $this->obj[$i - 1]);
        }

        $this->buffer = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $offsets = [];
        foreach ($this->obj as $i => $cuerpo) {
            $offsets[$i + 1] = strlen($this->buffer);
            $this->buffer .= ($i + 1) . " 0 obj\n" . $cuerpo . "\nendobj\n";
        }
        $inicioXref = strlen($this->buffer);
        $n = count($this->obj) + 1;
        $this->buffer .= "xref\n0 $n\n0000000000 65535 f \n";
        for ($i = 1; $i < $n; $i++) $this->buffer .= sprintf("%010d 00000 n \n", $offsets[$i]);
        $this->buffer .= "trailer\n<</Size $n /Root $idCatalogo 0 R /Info $idInfo 0 R>>\n"
                       . "startxref\n$inicioXref\n%%EOF\n";
        return $this->buffer;
    }

    public string $titulo = 'Reporte';

    /* ---------------------------------------------------------------- */

    /** El PDF habla latin-1; el panel habla UTF-8. */
    private function aWinAnsi(string $s): string
    {
        $r = @iconv('UTF-8', 'CP1252//TRANSLIT', $s);
        return $r === false ? preg_replace('/[^\x20-\x7E]/', '', $s) : $r;
    }

    private function escapar(string $s): string
    {
        return strtr($s, ['\\' => '\\\\', '(' => '\\(', ')' => '\\)', "\r" => '']);
    }

    /** @return array{0:float,1:float,2:float} */
    private function rgb(string $hex): array
    {
        $hex = ltrim($hex, '#');
        return [hexdec(substr($hex, 0, 2)) / 255, hexdec(substr($hex, 2, 2)) / 255, hexdec(substr($hex, 4, 2)) / 255];
    }
}
