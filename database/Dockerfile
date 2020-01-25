FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE notifications
ENV MYSQL_USER admin
ENV MYSQL_PASSWORD root

COPY ./sql-scripts /docker-entrypoint-initdb.d