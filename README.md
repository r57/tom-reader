# Tom Reader

Read Topolwater Topas TOM control unit data & push to MQTT.

> NOTE: this code assume direct HTTP connectivity to TOM unit

## Docker

1. Bump version in `package.json` if needed

2. Build docker container (provide `DOCKER_REPO` ENV variable)
    ```
    $ DOCKER_REPO=myrepo.example.com yarn image
    ```

3. Push to DOCKER_REPO
    ```
    $ DOCKER_REPO=myrepo.example.com yarn push
    ```