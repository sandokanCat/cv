<?php
$form = simplexml_load_file("form.xml");
$action = $form['action'];
$method = $form['method'];
$enctype = $form['enctype'];

echo "
    <!DOCTYPE html>
        <html>
            <head>
                <title>Contacto</title>
            </head>
            <body>
                <form action='$action' method='$method'>
";

foreach ($form->field as $field){
    $name = (string)$field->name;
    $type = (string)$field->type;
    $label = (string)$field->label;

    if ($name == 'content') {
        echo "
            <label for='$name'>$label</label>
            <br/>
            <$type id='$name' name='$name'></$type>
            <br/>
        ";
    }
    else if ($name == 'consent') {
        echo "
            <input id='$name' name='$name' type='$type' value='$label'>
            <label for='$name'>$label</label>
            <br/>
        ";
    } else if ($name == 'send') {
        echo "
            <input id='$name' name='$name' type='$type' value='$label'>
            <br/>
        ";
    } else {
        echo "
            <label for='$name'>$label</label>
            <br/>
            <input id='$name' name='$name' type='$type' required>
            <br/>
        ";
    }
}

echo "
            </form>
        </body>
    </html>
"
?>