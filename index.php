<!-- Connect DB -->
<?php
$servername = "127.0.0.1:3306";
$username = "root";
$password = "";
$database = "modern_add_to_cart";

$connection = mysqli_connect($servername, $username, $password);

if (!$connection) {
    die("Connection Failed: " . mysqli_connect_error());
}

// Check if Database Not Exists Then  Create The Database, But If Exists Then Proceed
if (!mysqli_fetch_row(mysqli_query($connection, "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$database'"))) {
    mysqli_query($connection, "CREATE DATABASE " . $database);
}

// New Connection If Database is Created
$connection = mysqli_connect($servername, $username, $password, $database);

$query = mysqli_query($connection, "SHOW TABLES LIKE 'products'");

// Create Table if Does Not Exists
if (mysqli_num_rows($query) == 0) {
    $table = "CREATE TABLE `products` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `product_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `product_price` decimal(10,2) NOT NULL,
    `product_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    mysqli_query($connection, $table);

    // Insert Data
    $seeder = "INSERT INTO products (id, product_name, product_description, product_price, product_image) VALUES 
    (1, 'Yamaha Y16', 'Motosikal Bossku yang di upgrade dari Y15 ke Y16 dengan penampilan yang lebih mantap dan lebih laju. Motorsikal ini menjadi kegilaan oleh mat rempit dan sistur. Motorsikal ini bole dimodifikasi sehingga setanding dengan motorsikal MotoGP.', 10500.00, 'images/y16.png'),
    (2, 'Modenas ZX25R', 'King of 250cc dengan 4 silinder inline khas untuk pengemar kelajuan. Moto yang dinanti-nanti kan oleh pengguna 250cc kerana bunyinya yang sangat sedap didengari. Motorsikal ini mempunya 43.5 kuasa kuda yang boleh menandingi BMW S1000rr.', 33900.00, 'images/zx25r.png'),
    (3, 'Honda C70', 'Motorsikal paling laju dalam sejarah yang menggunakan ekzos standard tanpa sebarang modifikasi untuk melajukan motorsikal. Motorsikal yang digeruni oleh pengguna Ducatti Panigale 1199 kerana takut memakan asap motorsikal ini. Motorsikal ini sudah tidak wujud lagi dan semestinya mempunya nilai yang sangat mahal di dunia mengalahkan buggati la voiture noire.', 9999999.99, 'images/c70.png')";
    mysqli_query($connection, $seeder);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="cart.css">
    <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css">
    <title>Modern Add to Cart</title>
</head>

<body>

    <!-- Top bar -->
    <ul class="x-top-bar">
        <li class="x-modern-cart">
            <i class='bx bx-cart'></i>
            <span class="x-cart-quantity">0</span>
        </li>
    </ul>

    <!-- Cart Section -->
    <div class="x-cart-container">
        <div class="x-cart-header">
            <span class="x-title">Confirm Order</span>
            <span class="x-sign-close">&#10005;</span>
        </div>

        <!-- Cart Summary Like Total Product Quantity & Total All Price -->
        <div class="x-cart-summary">
            <span class="x-cart-summary-title">Your Order</span>
            <div class="x-cart-summary-details">
                <span class="x-cart-summary-quantity">Total 0 item</span>
                <span class="x-cart-summary-price">RM 0.00</span>
            </div>
        </div>

        <!-- Cart Order List -->
        <div class="x-cart-order-list">
            <li class="x-cart-empty-list">
                <i class='bx bxs-x-circle'></i>
                <span class="x-cart-empty-list-text">No item in cart</span>
            </li>
        </div>

        <!-- Cart Button -->
        <div class="x-cart-button">
            <span class="x-cart-reminder">Please make sure your purchase before confirm the order.</span>
            <button type="button" class="x-cart-confirm-order" disabled>
                <span class="x-cart-confirm-order-text">Confirm Order</span>
            </button>
        </div>
    </div>

    <!-- Content for Add to Cart -->
    <div class="x-content">
        <!-- Get All Image from Database -->
        <?php
        $query = mysqli_query($connection, "SELECT * FROM products");

        while ($row = mysqli_fetch_assoc($query)) {
            $id = $row["id"];
            $name = $row["product_name"];
            $description = $row["product_description"];
            $price = $row["product_price"];
            $image = $row["product_image"];

            echo '<div class="x-product-details">';
            echo '<div class="x-image-description-overlay">';
            echo '<img class="x-product-image" src="' . $image . '" alt="' . $name . '">';
            echo '<div class="x-product-description-overlay">' . '<span class="x-product-description">' . $description . '</span>' . '</div>';
            echo '</div>';
            echo '<span class="x-product-name">' . $name . '</span>';
            echo '<span class="x-product-price">' . 'RM ' . $price . '</span>';
            echo '<button type="button" class="x-button-add-to-cart" ' . 'data-x-product-id="' . $id . '"' .
                 ' data-x-product-name="' . $name . '"' . ' data-x-product-price="' . $price . '"' . ' data-x-product-image="' . $image . '"' . '>';
            echo '<span class="x-button-add-to-cart-text">' . 'Add to Cart' . '</span>';
            echo '</button>';
            echo '</div>';
        }
        // Always Close Connection At The End of Your PHP for A Good Practice
        mysqli_close($connection);
        ?>
    </div>

    <!-- Success Message When Add To Cart -->
    <div class="x-success-add-to-cart-message"></div>

    <!-- Scripting -->
    <script src="cart.js"></script>
</body>

</html>
