# Dockerfile for DockerUI

FROM ubuntu:12.04

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y apache2 

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

EXPOSE 80

ADD . /var/www/

RUN chown www-data -R /var/www/ 

CMD ["/usr/sbin/apache2", "-D", "FOREGROUND"] 
