#!/usr/bin/env bash
#
#   App build/deploy command arguments
#   
#   1) install-dependencies ----- Install/reinstall Node dependencies
#   2) start-dev ---------------- Start development environment
#   3) lint --------------------- Run backend and frontend linters
#   4) test --------------------- Run backend and frontend tests
#   5) build -------------------- Build build backend and frontend apps
#   5) deploy ENV --------------- Deploy app to given environment
#   6) destroy ENV -------------- Destroy app in given environment
#
#   ENV: dev, stage, prod
#   CMD: init, apply, destroy

function validate_environment {
    if [ $# -eq 0 ]; then
        echo "Missing environment"
        exit
    elif [ $1 != "dev" ] && [ $1 != "stage" ] && [ $1 != "prod" ]; then
        echo "Invalid environment"
        exit
    else
        source vars/default.conf
        source vars/$1.conf
    fi
}

if [ $# -eq 0 ]; then
    echo "Missing command argument"
    exit
elif [ $1 == "install-dependencies" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    echo "Installing frontend dependencies..."
    cd ../frontend
    npm install
elif [ $1 == "start-dev" ]; then
    echo "Starting dev environment..."
    validate_environment "dev"
    concurrently -k -n "DATABASE,BACKEND,FRONTEND" -c "blue,green,red" \
        "docker-compose --file backend/docker-compose.yml up" \
        "npm --prefix backend run serve" \
        "npm --prefix frontend run serve"
elif [ $1 == "lint" ]; then
    validate_environment "dev"
    echo "Running backend linters..."
    npm --prefix backend run lint
    echo "Running frontend linters..."
    npm --prefix frontend run lint
elif [ $1 == "test" ]; then
    echo "Running frontend tests ..."
    npm --prefix frontend run test
elif [ $1 == "build" ]; then
    validate_environment $2
    echo "Building $2 app..."
    npm --prefix backend build
    npm --prefix frontend run build:$NODE_ENV
    mkdir -p backend/build/public
    rm -rf backend/build/public/www
    cp -R frontend/www backend/build/public/www
elif [ $1 == "deploy" ]; then
    validate_environment $2
    echo "Deploying $2 app..."
    ./run.sh build $2
    npm --prefix backend run deploy
elif [ $1 == "destroy" ]; then
    validate_environment $2
    echo "Destroying $2 app..."
    npm --prefix backend run destroy
else
    echo "Invalid command argument"
    exit
fi