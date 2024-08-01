FROM typesense/typesense:26.0

RUN apt-get update
RUN apt-get install -y curl