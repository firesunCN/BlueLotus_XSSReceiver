FROM ubuntu:latest

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get -yq install \
    curl \
    git \
    apache2 \
    libapache2-mod-php7.0 \
    php7.0-mcrypt \
    php7.0 && \
    rm -rf /var/lib/apt/lists/* && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
	
RUN /usr/sbin/phpenmod mcrypt
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf && \
    sed -i "s/variables_order.*/variables_order = \"EGPCS\"/g" /etc/php/7.0/apache2/php.ini

ENV ALLOW_OVERRIDE **False**

ADD run.sh /run.sh

RUN chmod 755 /*.sh

RUN mkdir -p /app && rm -fr /var/www/html && ln -s /app /var/www/html

RUN git clone https://github.com/firesunCN/BlueLotus_XSSReceiver.git /app/tmp/ && \
	mv /app/tmp/* /app/ && \
	rm -fr /app/tmp/ && \
	mv /app/config-sample.php /app/config.php && \
	pass=`php -r '$salt="!KTMdg#^^I6Z!deIVR#SgpAI6qTN7oVl";$key="bluelotus";$key=md5($salt.$key.$salt);$key=md5($salt.$key.$salt);$key=md5($salt.$key.$salt);echo $key;'`;sed -i  "s/2a05218c7aa0a6dbd370985d984627b8/$pass/g" /app/config.php  && \
	rm -fr /app/diff && \
	rm -fr /app/guide && \
	rm -fr /app/src
	
EXPOSE 80

WORKDIR /app

CMD ["/run.sh"]
