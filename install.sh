#!/bin/bash

TARGET_DIR="$HOME/.todo_cli"

git clone https://github.com/su1nta/todo_cli.git $TARGET_DIR
cd todo_cli
npm install
chmod +x todo.js
npm link

echo "Todo-cli is now installed! You may need to restart your shell to start using it."
