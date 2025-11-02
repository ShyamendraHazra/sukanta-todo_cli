# TODO.CLI
A minimal, file-backed CLI to manage a personal TODO list.

- Entry point: [todo.js](todo.js)
- Data store: [tasks.json](tasks.json)
- Version source: [package.json](package.json) via [`getVersion`](todo.js)

## Features
- Add tasks with auto-generated unique IDs.
- List all tasks with completion status.
- Update task status and description interactively.
- Delete tasks with confirmation.
- JSON-backed storage using LowDB (no external database).

## How it works
- The CLI is implemented in [todo.js](todo.js) using Commander and LowDB.
- Data is stored in [tasks.json](tasks.json) via LowDB’s `JSONFileSync` adapter.
- Notable functions in [todo.js](todo.js):
  - [`getVersion`](todo.js): reads version from [package.json](package.json).
  - [`connDb`](todo.js): creates a LowDB connection to [tasks.json](tasks.json).
  - [`showAllTasks`](todo.js): prints all tasks with their status and IDs.

## Requirements
- Node.js 18+ (LTS recommended)
- macOS/Linux/WSL recommended for global usage
- Ensure the CLI entry file is executable: `chmod +x todo.js`

Note: If you encounter "Cannot find module '@inquirer/prompts'", install it:
```bash
npm i @inquirer/prompts
```

## Installation

### For users (global install)
1. Clone or download this project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make the script executable (Unix-like systems):
   ```bash
   chmod +x todo.js
   ```
4. Link the CLI globally:
   ```bash
   npm link
   ```
5. Now use it anywhere with `todocli`.

#### For automated install run below command in your terminal
```bash
curl https://raw.githubusercontent.com/su1nta/todo_cli/master/install.sh | sh

```
To remove:
```bash
npm unlink -g todo_cli
```

### For users (local use without linking)
Run directly from the project directory:
```bash
npm start -- [command] [options] <args>
# or
node todo.js [command] [options] <args>
```

### For developers
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Run locally:
   ```bash
   npm start -- status
   ```
3. For CLI development, link it:
   ```bash
   chmod +x todo.js
   npm link
   todocli status
   ```
4. Update version in [package.json](package.json); it is read by [`getVersion`](todo.js).

## Usage

General syntax:
```bash
todocli [command] [options] <arguments>
```

Commands:
- Add a task
  ```bash
  todocli add "Clean the room"
  # or with multiple words (both forms work)
  todocli add Clean the room
  ```
- Show all tasks
  ```bash
  todocli status
  ```
  Output format:
  ```
  [X] Task Title (taskid)
  [ ] Another Task (taskid)
  ```
- Update a task
  - Mark complete:
    ```bash
    todocli update -c <taskid>
    ```
  - Mark not complete:
    ```bash
    todocli update -n <taskid>
    ```
  - Update description (interactive):
    ```bash
    todocli update <taskid>
    # You will be prompted:
    # ✔ Update task description? Yes/No
    # ✔ Enter new task description: <text>
    ```
  Notes:
  - Do not use `-c` and `-n` together (the CLI will error).
- Delete a task
  ```bash
  todocli delete <taskid>
  # You will be asked for confirmation.
  # If the task was not completed, a warning is shown.
  ```

## Data storage
- File: [tasks.json](tasks.json)
- Schema:
  ```json
  {
    "tasks": [
      { "id": "string", "task": "string", "completed": true | false }
    ]
  }
  ```
- The app initializes the file when missing. If JSON is corrupted, the add flow resets to an empty list; the update flow shows an error prompt.

## Examples
```bash
# Add
todocli add "Drink more water"

# List
todocli status

# Complete a task
todocli update -c mgcoy7ll

# Edit description
todocli update mgcoygeh

# Delete
todocli delete mgcoyl6t
```

## Troubleshooting
- Module '@inquirer/prompts' not found:
  ```bash
  npm i @inquirer/prompts
  ```
- Permission denied when running:
  ```bash
  chmod +x todo.js
  ```
- Invalid JSON in [tasks.json](tasks.json):
  - Fix the JSON manually or run an `add` to reinitialize.

## Project structure
```
.
├─ todo.js        # CLI source
├─ tasks.json     # LowDB JSON store
├─ package.json   # Metadata, bin, scripts
└─ README.md
```

## License
ISC
