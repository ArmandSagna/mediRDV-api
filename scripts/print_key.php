<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
echo "CONFIG_KEY=" . config('app.key') . PHP_EOL;
echo "ENV_APP_KEY=" . getenv('APP_KEY') . PHP_EOL;
