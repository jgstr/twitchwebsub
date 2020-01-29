FROM mysql:5.7

ENV MYSQL_ALLOW_EMPTY_PASSWORD yes
ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE notifications
ENV MYSQL_USER user
ENV MYSQL_PASSWORD password

COPY ./sql-scripts /docker-entrypoint-initdb.d

## Original
# FROM mysql:5.7

# ENV MYSQL_ALLOW_EMPTY_PASSWORD yes

# COPY ./sql-scripts /docker-entrypoint-initdb.d