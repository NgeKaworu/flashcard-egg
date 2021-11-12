#!/bin/bash
set -e

tag=ngekaworu/flashcard-egg

docker build --file ./Dockerfile --tag ${tag} ..;
docker push ${tag};
