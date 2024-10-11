#!/bin/bash

SESH="laborky"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
	if [[ "$1" == "dev" ]]; then
		gnome-terminal -- bash -c "./run.sh -rtmux"
		nvim .
        elif [[ "$1" == "build" ]]; then
		gnome-terminal -- bash -c "./run.sh -tbuild"
		nvim .		
	elif [[ "$1" == "-tbuild" ]]; then
		tmux has-session -t $SESH 2>/dev/null
		if [ $? != 0 ]; then
			tmux new-session -d -s $SESH -n "api"
			tmux send-keys -t $SESH:api "cd Backend	&& python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && sleep 5 && python server.py" C-m

			tmux new-window -t $SESH -n "webserver"
			tmux send-keys -t $SESH:webserver "cd FrontEnd && bun install && bun run build && bun start" C-m

			tmux new-window -t $SESH -n "db"
			tmux send-keys -t $SESH:db "docker compose up" C-m
		fi
		tmux attach-session -t $SESH

	elif [[ "$1" == "-tmux" ]]; then
		gnome-terminal -- bash -c "./run.sh -rtmux"
	elif [[ "$1" == "-rtmux" ]]; then
		tmux has-session -t $SESH 2>/dev/null
		if [ $? != 0 ]; then
			tmux new-session -d -s $SESH -n "api"
			tmux send-keys -t $SESH:api "cd Backend	&& python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && sleep 5 && python server.py" C-m

			tmux new-window -t $SESH -n "webserver"
			tmux send-keys -t $SESH:webserver "cd FrontEnd && bun install && bun run dev" C-m

			tmux new-window -t $SESH -n "db"
			tmux send-keys -t $SESH:db "docker compose up" C-m

			tmux new-window -t $SESH -n "term"
		fi
		tmux attach-session -t $SESH
	else
    		echo "Linux"
    		gnome-terminal -- bash -c "docker compose -f docker-compose.fe.yml up"
    		gnome-terminal -- bash -c "cd BackEnd && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python server.py"
	fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Mac OSX"
else
    echo "Windows"
    start powershell -Command 'cd FrontEnd;npm i --force; npm run dev'
    start powershell -Command 'cd BackEnd; python -m venv venv; ./venv/Scripts/activate; pip install -r requirements.txt; python server.py'
fi
