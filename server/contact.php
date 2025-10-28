<?php
$json = file_get_contents("form.json");
$form = json_decode($json, true);
$url = $form['url'];
$method = $form['method'];

echo "
    <!DOCTYPE html>
        <html>
            <head>
                <title>Contacto</title>
            </head>
            <body>
                <form action='$url' method='$method'>
";

foreach ($form[fields] as $field){
    $name = $form['name'];
    $type = $form['type'];
    $label = $form['label'];

    if (isset($field['label'])) {
        echo "<label for='$name'>{$field['label']}</label><br>";
    }
    switch ($type) {
        case 'email':
        case 
    }
}

echo "
            </form>
        </body>
    </html>
"
?>