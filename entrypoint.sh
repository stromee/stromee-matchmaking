#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

echo "Replacing env constants in JS"
# array for env

variables=()
for var in $(env | cut -d= -f1); do
    if [[ $var == VITE_* ]]; then
        variables+=("$var")
    fi
done

echo "Variables: ${variables[@]}"

for file in $ROOT_DIR/assets/*.js $ROOT_DIR/index.html; do
    echo "Processing $file ..."
    # this works because vite replaces undefined variables with strings {}.VITE_*
    # loop over variables
    for var in "${variables[@]}"; do
        echo "Replacing $var"
        sed -i "s|{}.${var}|'${!var}'|g" $file
    done

done


echo "Starting Nginx"
nginx -g 'daemon off;'