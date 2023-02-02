FROM php:7.2-apache
COPY ./ /var/www/html/
RUN chmod a+rw /var/www/html/data \ 
    && chmod a+rw /var/www/html/myjs \
    && chmod a+rw /var/www/html/template \
    && rm -rf .git/ diff/ guide/ src/ Dockerfile

