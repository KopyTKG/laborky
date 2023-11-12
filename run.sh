#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux"
    gnome-terminal -- bash -c "cd FrontEnd && npm run dev"
    gnome-terminal -- bash -c "cd BackEnd && python server.py"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Mac OSX"
else
    echo "Windows"
    start powershell -Command 'cd FrontEnd | npm run dev'
fi