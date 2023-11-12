#!/bin/bash


if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux"
    gnome-terminal -- bash -c "cd FrontEnd && npm i"
    gnome-terminal -- bash -c "cd BackEnd && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Mac OSX"
else
    echo "Windows"
    start powershell -Command 'cd FrontEnd | npm i'
fi