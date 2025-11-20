<?php
// ===============================
// LOAD GLOBALS JSON
// ===============================
$globals = json_decode(
    file_get_contents(__DIR__.'/../js/globals.json'),
    true,
    512,
    JSON_THROW_ON_ERROR
);

// ===============================
// DIRECTORIES FOR I18N
// ===============================
$translationsDir = __DIR__.'/../js/i18n/';
$outputDir = __DIR__.'/compiled_files/';

if (!is_dir($outputDir)) mkdir($outputDir, 0755, true);

// ===============================
// PROCESS ALL TRANSLATION FILES
// ===============================
foreach (glob($translationsDir.'*.json') as $file) {

    $lang = basename($file, '.json');

    $translations = json_decode(
        file_get_contents($file),
        true,
        512,
        JSON_THROW_ON_ERROR
    ) ?: [];

    // ===============================
    // REPLACE PLACEHOLDERS IN TRANSLATIONS
    // ===============================
    foreach ($translations as $key => &$entry) {
        foreach ($entry as $type => &$value) {

            if (!is_string($value)) continue;

            preg_match_all('/{{\s*([^}]+)\s*}}/', $value, $matches);

            if (!empty($matches[1])) {
                foreach ($matches[1] as $var) {
                    $var = trim($var);
                    $replacement = $globals[$var] 
                        ?? ($translations[$var]['text'] ?? '');

                    $value = str_replace('{{'.$var.'}}', $replacement, $value);
                }
            }
        }
        unset($value);
    }
    unset($entry);

    // ===============================
    // EXPORT TRANSLATIONS AS CLEAN PHP
    // ===============================
    $export = "<?php\nreturn ".var_export($translations, true).";\n";
    file_put_contents($outputDir.$lang.'.php', $export);
}

echo "✅ Compiled translations on $outputDir\n";
?>
