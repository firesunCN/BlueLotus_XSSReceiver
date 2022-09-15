FROM php:7.4-apache

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
WORKDIR /var/www/html

COPY . .
RUN chmod 777 -R ./
RUN echo "\nDirectoryIndex index.php" >> .htaccess