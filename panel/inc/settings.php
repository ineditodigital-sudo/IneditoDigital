<?php
function settings_all(string $table): array {
    $out = [];
    try { foreach (db()->query("SELECT k,v FROM `$table`") as $r) $out[$r['k']] = $r['v']; } catch (Throwable $e) {}
    return $out;
}
function settings_save(string $table, array $data): void {
    $st = db()->prepare("INSERT INTO `$table` (k,v) VALUES (:k,:v) ON DUPLICATE KEY UPDATE v=VALUES(v)");
    foreach ($data as $k => $v) $st->execute([':k' => $k, ':v' => (string)$v]);
}
function field(string $name, string $label, array $vals, string $type='text', string $help=''): void {
    $v = e($vals[$name] ?? '');
    echo '<div><label>'.e($label).'</label>';
    if ($type==='textarea') echo '<textarea name="'.$name.'">'.$v.'</textarea>';
    else echo '<input type="text" name="'.$name.'" value="'.$v.'">';
    if ($help) echo '<div class="mini" style="margin-top:4px">'.e($help).'</div>';
    echo '</div>';
}
