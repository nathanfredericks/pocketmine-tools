FROM php:7.2-apache

WORKDIR /var/www/html

COPY . .

RUN mkdir -p data/tmp
RUN mkdir -p data/phars

RUN chmod -R 777 data/tmp
RUN chown -R root:www-data data/tmp
RUN chmod -R 777 data/phars
RUN chown -R root:www-data data/phars

RUN apt update
RUN apt install -y libzip-dev libyaml-dev
RUN pecl install zip
RUN pecl install yaml
RUN docker-php-ext-enable zip yaml

EXPOSE 80