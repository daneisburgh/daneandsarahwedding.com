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
#   7) terraform CMD ENV -------- Run Terraform command for given environment
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
elif [ $1 == "terraform" ]; then
    if [ $# -ne 3 ]; then
        echo "Missing command arguments"
        exit
    else
        if [ $2 != "init" ] && [ $2 != "apply" ] && [ $2 != "destroy" ]; then
            echo "Invalid terraform command"
            exit
        else
            validate_environment $3
            cd terraform/environments/$3
            echo "Running terraform $2 for $3 environment..."

            if [ $2 == "init" ]; then
                terraform init
            else
                terraform $2 \
                    -var="app_name=$APP_NAME" \
                    -var="db_username=$DB_USERNAME" \
                    -var="db_password=$DB_PASSWORD"
            fi
        fi
    fi
else
    echo "Invalid command argument"
    exit
fi