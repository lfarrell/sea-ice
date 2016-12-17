<?php
$files = scandir('data/raw');

foreach($files as $file) {
    if(is_dir("data/$file")) continue;
    $fh = fopen("data/processed/$file", "wb");
    fputcsv($fh, ['year','month','value','anomaly','type']);

    $type = preg_split('/_/', preg_split('/\./', $file)[0])[0];

    if (($handle = fopen("data/raw/$file", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if(!preg_match('/^\d{6}/', $data[0])) {
                continue;
            }

            $year = substr($data[0], 0, 4);
            $month = substr($data[0], -2);
            fputcsv($fh, [$year, $month, $data[1], $data[2], $type]);
        }
        fclose($handle);
    }

    echo "$file processed\n";
}