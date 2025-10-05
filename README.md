### TODO.CLI
*A CLI based TODO App*

#### Usage
```bash
    # Every task creates an unique taskid
    todocli [command] [options] <arguments>
```
1. Add a task
   ```bash
        $ todocli add "Clean the room"
   ```
2. Delete a task
   ```bash
        $ todocli delete <taskid>
   ```
3. Update a task
    - Mark a task as complete or incomplete
    ```bash
        # to mark complete
        $ todocli update -c <taskid>
        #to mark incomplete
        $ todocli update -n <taskid>
    ```
    - Update the task description
    ```bash
        $ todocli update <taskid>
        ✔Update the task description? Yes
        ✔Enter new task description Clean the bedroom
    ```
4. Show all tasks
   ```bash
        $ todocli status
   ```